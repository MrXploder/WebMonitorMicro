const express = require('express');
const path = require('path');
const app = express();
const WebSocket = require('ws');
const _ = require('lodash')

const wss = new WebSocket.Server({ port: 12345 });

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
  });

  setInterval(function mock(){
  	ws.send(_.random(250, 350));
  }, 2000);
});

/*LiveReaload section*/
var livereload = require('livereload');
var server = livereload.createServer();
server.watch(__dirname + "/public");

/**
	Make the folder "public" a static asset folder.
*/
app.use('/', express.static(path.join(__dirname, 'public')));

/*Routes definitions for the rest-api goes here*/

/*Start the server*/
app.listen(80);
console.log('Stack Running at port 80...');
console.log('WebSocket Running at port 12345...');