(function() {
	'use strict';

	angular
		.module('angularApp')
		.factory('WebMonitor', WebMonitorFactory);

	WebMonitorFactory.$inject = ["$websocket"];

	function WebMonitorFactory($websocket) {
		// Open a WebSocket connection
		let dataStream = $websocket('ws://localhost:12345');

		const rawData = [];
		const averageData = [];
		const timeStampLabels = [];

		dataStream.onMessage(({data: message}) => {
			message = parseInt(message);

			timeStampLabels
				.splice(0, 1)
				.push(moment().utc().format("HH:mm:ss"));

			rawData
				.splice(0, 1)
				.push(message);

			averageData
				.splice(0, 1)
				.push(Math.floor(rawData.reduce((accumulator, data) => accumulator + data, 0) / rawData.length));
		});

		return {
			collection: [rawData, averageData],
			labels: timeStampLabels,
			get: function() {
				dataStream.send(JSON.stringify({
					action: 'get'
				}));
			}
		};
	}
})();