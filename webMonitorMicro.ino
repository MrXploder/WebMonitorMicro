#include <ArduinoJson.h>
#include <TimeLib.h>
#include <ESP8266WiFi.h>
#include <ESP8266WiFiMulti.h>
#include <ArduinoOTA.h>
#include <ESP8266WebServer.h>
#include <ESP8266mDNS.h>
#include <WiFiUdp.h>
#include <FS.h>
#include <WebSocketsServer.h>

ESP8266WebServer server(80);       // create a web server on port 80
WebSocketsServer webSocket = WebSocketsServer(81);    // create a websocket server on port 81

File fsUploadFile;
WiFiUDP Udp;

const char *ssid = "VTR-7236151";
const char *password = "hw9wcXhtHsm4";

const char* mdnsName = "webMonitor"; // Domain name for the mDNS responder

//Servidor NTP
IPAddress ntpServerIP;
const char* ntpServerName = "ntp.shoa.cl";
const int timeZone = 0;
unsigned int localPort = 8888; //Puerto local para escuchar paquetes UDP

/**
Valor actual del medidor a la hora de programar
*/

char websocketBuffer[100];


unsigned long previousMillis = 0;
unsigned long currentMillis = 0;
unsigned long i = 0;

int currentAnalogValue = 0;
int previousAnalogValue = 0;

const long interval = 50;

const int analogTopThreshold = 500;
const int analogBottomThreshold = 300;
bool thresholdFlag = false;

const int measurerSteps = 32;
int measurerTicks = 0;
long int measurerValue = 588200;

/*__________________________________________________________SETUP_________________________________________________________*/
void setup() {
  Serial.begin(115200);        // Start the Serial communication to send messages to the computer
  delay(10);
  Serial.println("\r\n");

  startWiFi();                 // Start a Wi-Fi access point, and try to connect to some given access points. Then wait for either an AP or STA connection

  startSPIFFS();               // Start the SPIFFS and list all contents

  startWebSocket();            // Start a WebSocket server

  startMDNS();                 // Start the mDNS responder
  /**
    Start a HTTP server with a file read handler and an upload handler
  */
  startServer();

  startNTP();

}

/*__________________________________________________________LOOP__________________________________________________________*/

void loop() {
  webSocket.loop();                           // constantly check for websocket events
  server.handleClient();                      // run the server
  currentMillis = millis();
  StaticJsonBuffer<100> jsonBuffer;
  JsonObject& root = jsonBuffer.createObject();

  if (currentMillis - previousMillis >= interval) {
    previousMillis = currentMillis;

    currentAnalogValue = analogRead(A0);
    Serial.println(currentAnalogValue);

    if(!thresholdFlag){
      if(currentAnalogValue > analogTopThreshold){
        Serial.println("current analog value is higher than the top threshold value, sending data");
        measurerTicks++;
        if(measurerTicks > measurerSteps){
          measurerTicks = 0;
          measurerValue += 1;
          root["time"] = now();
          root["value"] = measurerValue;
          root.printTo(websocketBuffer, sizeof(websocketBuffer));
          Serial.print("sending-> ");
          Serial.println(String(websocketBuffer));
          webSocket.broadcastTXT(websocketBuffer);
        }
        thresholdFlag = true;

      }
    }
    else{
      if(currentAnalogValue < analogBottomThreshold){
        thresholdFlag = false;
      }
    }
  }
}

/*__________________________________________________________SETUP_FUNCTIONS__________________________________________________________*/

void startWiFi() { // Start a Wi-Fi access point, and try to connect to some given access points. Then wait for either an AP or STA connection
  WiFi.begin(ssid, password);             // Connect to the network
  Serial.print("Connecting to ");
  Serial.print(ssid);
  Serial.println(" ...");

  int i = 0;
  while (WiFi.status() != WL_CONNECTED) { // Wait for the Wi-Fi to connect
    delay(1000);
    Serial.print('.');
  }

  Serial.println('\n');
  Serial.println("Connection established!");
  Serial.print("IP address:\t");
  Serial.println(WiFi.localIP());         // Send the IP address of the ESP8266 to the computer
}

void startSPIFFS() { // Start the SPIFFS and list all contents
  SPIFFS.begin();                             // Start the SPI Flash File System (SPIFFS)
  Serial.println("SPIFFS started. Contents:");
  {
    Dir dir = SPIFFS.openDir("/");
    while (dir.next()) {                      // List the file system contents
      String fileName = dir.fileName();
      size_t fileSize = dir.fileSize();
      Serial.printf("\tFS File: %s, size: %s\r\n", fileName.c_str(), formatBytes(fileSize).c_str());
    }
    Serial.printf("\n");
  }
}

void startWebSocket() { // Start a WebSocket server
  webSocket.begin();                          // start the websocket server
  // webSocket.onEvent(webSocketEvent);          // if there's an incomming websocket message, go to function 'webSocketEvent'
  Serial.println("WebSocket server started.");
}

void startMDNS() { // Start the mDNS responder
  MDNS.begin(mdnsName);                        // start the multicast domain name server
  Serial.print("mDNS responder started: http://");
  Serial.print(mdnsName);
  Serial.println(".local");
}

void startServer() { // Start a HTTP server with a file read handler and an upload handler
  server.onNotFound(handleNotFound);          // if someone requests any other file or page, go to function 'handleNotFound'
  server.begin();                             // start the HTTP server
  Serial.println("HTTP server started.");
}

void startNTP(){
  Udp.begin(localPort);            //Inicializamos el Servicio de UDP
  Serial.print("UDP for NTP client started at port: ");
  Serial.println(Udp.localPort()); //Imprimimos el puerto local UDP
  setSyncProvider(getNtpTime);
}

/*_________________________________________________SERVER_HANDLERS________________________________________________________*/


// if the requested file or page doesn't exist, return a 404 not found error
void handleNotFound(){
  if(!handleFileRead(server.uri())){          // check if the file exists in the flash memory (SPIFFS), if so, send it
    server.send(404, "text/plain", "404: File Not Found");
  }
}

// send the right file to the client (if it exists)
bool handleFileRead(String path) {
  Serial.println("handleFileRead: " + path);
  if (path.endsWith("/")) path += "index.html";          // If a folder is requested, send the index file
  String contentType = getContentType(path);             // Get the MIME type
  String pathWithGz = path + ".gz";
  if (SPIFFS.exists(pathWithGz) || SPIFFS.exists(path)) { // If the file exists, either as a compressed archive, or normal
    if (SPIFFS.exists(pathWithGz))                         // If there's a compressed version available
      path += ".gz";                                         // Use the compressed verion
    File file = SPIFFS.open(path, "r");                    // Open the file
    size_t sent = server.streamFile(file, contentType);    // Send it to the client
    file.close();                                          // Close the file again
    Serial.println(String("\tSent file: ") + path);
    return true;
  }
  Serial.println(String("\tFile Not Found: ") + path);   // If the file doesn't exist, return false
  return false;
}

// void webSocketEvent(uint8_t num, WStype_t type, uint8_t * payload, size_t lenght) { // When a WebSocket message is received
//   switch (type) {
//     case WStype_DISCONNECTED:             // if the websocket is disconnected
//     Serial.printf("[%u] Disconnected!\n", num);
//     break;
//     case WStype_CONNECTED: {              // if a new websocket connection is established
//       IPAddress ip = webSocket.remoteIP(num);
//       Serial.printf("[%u] Connected from %d.%d.%d.%d url: %s\n", num, ip[0], ip[1], ip[2], ip[3], payload);
//     }
//     break;
//     case WStype_TEXT:                     // if new text data is received
//     Serial.printf("[%u] get Text: %s\n", num, payload);
//     if (payload[0] == '#') {            // we get RGB data
//       uint32_t rgb = (uint32_t) strtol((const char *) &payload[1], NULL, 16);   // decode rgb data
//       int r = ((rgb >> 20) & 0x3FF);                     // 10 bits per color, so R: bits 20-29
//       int g = ((rgb >> 10) & 0x3FF);                     // G: bits 10-19
//       int b =          rgb & 0x3FF;                      // B: bits  0-9

//       analogWrite(LED_RED,   r);                         // write it to the LED output pins
//       analogWrite(LED_GREEN, g);
//       analogWrite(LED_BLUE,  b);
//     } else if (payload[0] == 'R') {                      // the browser sends an R when the rainbow effect is enabled
//       rainbow = true;
//     } else if (payload[0] == 'N') {                      // the browser sends an N when the rainbow effect is disabled
//       rainbow = false;
//     }
//     break;
//   }
// }

/*__________________________________________________________HELPER_FUNCTIONS__________________________________________________________*/

String formatBytes(size_t bytes) { // convert sizes in bytes to KB and MB
  if (bytes < 1024) {
    return String(bytes) + "B";
  } else if (bytes < (1024 * 1024)) {
    return String(bytes / 1024.0) + "KB";
  } else if (bytes < (1024 * 1024 * 1024)) {
    return String(bytes / 1024.0 / 1024.0) + "MB";
  }
}

String getContentType(String filename) { // determine the filetype of a given filename, based on the extension
  if (filename.endsWith(".html")) return "text/html";
  else if (filename.endsWith(".css")) return "text/css";
  else if (filename.endsWith(".js")) return "application/javascript";
  else if (filename.endsWith(".ico")) return "image/x-icon";
  else if (filename.endsWith(".gz")) return "application/x-gzip";
  return "text/plain";
}

const int NTP_PACKET_SIZE = 48; // NTP time is in the first 48 bytes of message
byte packetBuffer[NTP_PACKET_SIZE]; //buffer to hold incoming & outgoing packets

//Funcion para sincronizar el reloj interno con servidor NTP
time_t getNtpTime(){
  while (Udp.parsePacket() > 0) ; // discard any previously received packets
  Serial.println("Incializando Sincronización con Servidor NTP");
  WiFi.hostByName(ntpServerName, ntpServerIP);
  sendNTPpacket(ntpServerIP);
  uint32_t beginWait = millis();
  while (millis() - beginWait < 1500) {
    int size = Udp.parsePacket();
    if (size >= NTP_PACKET_SIZE) {
      Serial.println("Sincronización Exitosa");
      Udp.read(packetBuffer, NTP_PACKET_SIZE);  // read packet into the buffer
      unsigned long secsSince1900;
      // convert four bytes starting at location 40 to a long integer
      secsSince1900 =  (unsigned long)packetBuffer[40] << 24;
      secsSince1900 |= (unsigned long)packetBuffer[41] << 16;
      secsSince1900 |= (unsigned long)packetBuffer[42] << 8;
      secsSince1900 |= (unsigned long)packetBuffer[43];
      return secsSince1900 - 2208988800UL + timeZone * SECS_PER_HOUR;
    }
  }
  Serial.println("El Servidor NTP No Responde =(");
  return 0; // return 0 if unable to get the time
}

//Funcion para enviar paquetes UDP dada una direccion
void sendNTPpacket(IPAddress &address){
  // set all bytes in the buffer to 0
  memset(packetBuffer, 0, NTP_PACKET_SIZE);
  // Initialize values needed to form NTP request
  // (see URL above for details on the packets)
  packetBuffer[0] = 0b11100011;   // LI, Version, Mode
  packetBuffer[1] = 0;     // Stratum, or type of clock
  packetBuffer[2] = 6;     // Polling Interval
  packetBuffer[3] = 0xEC;  // Peer Clock Precision
  // 8 bytes of zero for Root Delay & Root Dispersion
  packetBuffer[12]  = 49;
  packetBuffer[13]  = 0x4E;
  packetBuffer[14]  = 49;
  packetBuffer[15]  = 52;
  // all NTP fields have been given values, now
  // you can send a packet requesting a timestamp:
  Udp.beginPacket(address, 123); //NTP requests are to port 123
  Udp.write(packetBuffer, NTP_PACKET_SIZE);
  Udp.endPacket();
}

// void setHue(int hue) { // Set the RGB LED to a given hue (color) (0° = Red, 120° = Green, 240° = Blue)
//   hue %= 360;                   // hue is an angle between 0 and 359°
//   float radH = hue*3.142/180;   // Convert degrees to radians
//   float rf, gf, bf;

//   if(hue>=0 && hue<120){        // Convert from HSI color space to RGB
//     rf = cos(radH*3/4);
//     gf = sin(radH*3/4);
//     bf = 0;
//   } else if(hue>=120 && hue<240){
//     radH -= 2.09439;
//     gf = cos(radH*3/4);
//     bf = sin(radH*3/4);
//     rf = 0;
//   } else if(hue>=240 && hue<360){
//     radH -= 4.188787;
//     bf = cos(radH*3/4);
//     rf = sin(radH*3/4);
//     gf = 0;
//   }
//   int r = rf*rf*1023;
//   int g = gf*gf*1023;
//   int b = bf*bf*1023;

//   analogWrite(LED_RED,   r);    // Write the right color to the LED output pins
//   analogWrite(LED_GREEN, g);
//   analogWrite(LED_BLUE,  b);
// }
