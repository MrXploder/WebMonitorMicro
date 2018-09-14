(function() {
	'use strict';

	angular
		.module('angularApp')
		.factory('WebMonitor', WebMonitorFactory);

	WebMonitorFactory.$inject = ["$websocket"];

	function WebMonitorFactory($websocket) {
		const dataStream = $websocket('ws://localhost:81');
		const collection = [];
		const kilowatts = [];
		let currentKwValue = 0;
		let previousKwValue = 0;

		dataStream.onMessage(function(message){
			let messageData = JSON.parse(message.data);
			collection.push(messageData);

			let currentKwValue = Math.floor(messageData.value / 100);
			if(previousKwValue < currentKwValue) {
				kilowatts.push({value: currentKwValue, price: (currentKwValue * 199)});
				previousKwValue = angular.copy(currentKwValue);
			}
		});

		return {
			collection: collection,
			kilowatts: kilowatts,
		}
	}
})();