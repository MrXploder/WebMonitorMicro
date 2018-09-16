const express = require('express');
const path = require('path');
const app = express();
const WebSocket = require('ws');
const moment = require('moment');

const wss = new WebSocket.Server({
	port: 81
});

wss.on('connection', function connection(ws) {
	const jArrayData = [{
		value: 370400,
		diff: 34200,
		month: 9,
		year: 2017,
	}, {
		value: 382700,
		diff: 12300,
		month: 10,
		year: 2017,
	}, {
		value: 396200,
		diff: 13500,
		month: 11,
		year: 2017,
	}, {
		value: 412300,
		diff: 16100,
		month: 12,
		year: 2017,
	}, {
		value: 425400,
		diff: 13100,
		month: 1,
		year: 2018,
	}, {
		value: 443300,
		diff: 17900,
		month: 2,
		year: 2018,
	}, {
		value: 459800,
		diff: 16500,
		month: 3,
		year: 2018,
	}, {
		value: 475500,
		diff: 15700,
		month: 4,
		year: 2018,
	}, {
		value: 489000,
		diff: 13500,
		month: 5,
		year: 2018,
	}, {
		value: 502400,
		diff: 13400,
		month: 6,
		year: 2018,
	}, {
		value: 519100,
		diff: 16700,
		month: 7,
		year: 2018,
	}, {
		value: 533100,
		diff: 14000,
		month: 8,
		year: 2018,
	}];
	
	let measurerValue = 533100;
	let measurerDiff = 0;

	ws.on('message', function incoming(message) {
		console.log('received: %s', message);
	});

	setInterval(function mock() {
		measurerValue++;
		measurerDiff++;
		ws.send(JSON.stringify([...jArrayData, {
			value: measurerValue,
			diff: measurerDiff,
			month: 9,
			year: 2018
		}]));
	}, 5000);
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
console.log('WebSocket Running at port 81...');