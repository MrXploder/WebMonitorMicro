# WebMonitorMicro
Proyecto enfocado en captar los impulsos opticos de los medidores electronicos monofasicos.

# About
El proyecto se basa en captar los impulsos generados por un LED indicador que poseen los medidores electronicos monofasicos
encontrados en las casas con instalaciones electricas modernas. 

Este LED indicador tiene 2 configuraciones que vienen de fabrica. 
-> 1600
-> 3200
Estos numeros corresponden a la unidad de medida -> impulsos * kilowatt / hora, lo que significa que el LED indicador
"parpadeará" 1600 ó 3200 veces por cada kilowatt consumido.

Esto nos brinda la posibilidad de "sensar" el consumo actual sin invadir ni alterar la instalación electrica domiciliaria.

Mediante un metodo NO-invasivo, se utiliza un ESP8266 con una LDR conectada al pin analogico.
El ESP8266 actuará como HTTP Server y Websocket Server con mDNS.
Mediante este metodo, el ESP brindará de un server http para conectarnos y ocupar tecnologias web para adquirir los datos via websockets

- El objetivo principal es mostrar en pantalla el consumo instantaneo en un grafico -> 
Si dividimos la cantidad de impulsos por 100 -> (1600 / 100 => 16 ó 3200 / 100 => 32) nos da que cada 16/32 impulsos tenemos 10watt
por lo que nuestra medicion es mas rapida.

- Y mostrar un aproximado a pagar por concepto de energia electrica considerando 
1.- Lo que debo pagar actualmente segun lo que ya e consumido
2.- mostrar una proyeccion a pagar con respecto al promedio.
