(function() {
	'use strict';

	angular
		.module('angularApp')
		.factory('WebMonitor', WebMonitorFactory);

	WebMonitorFactory.$inject = ["$websocket"];

	function WebMonitorFactory($websocket) {
		const dataStream = $websocket('ws://localhost:81');
		const Collection = [];

		dataStream.onMessage(function(message) {
			/**
			We need to keep the original array because the Angular Factory "WebMonitor" is used in all over the app
			so if we change the value here on every event it should be updated in the other references too.

			-> We first parse the received message
			-> then we reset the original array by setting its length to 0
			-> then we loop trough the parsed message "messageData" and push the objects to the original array
			-> in the loop we add some interesting this such the price of the "kilowatt per hour"
			-> finally return the original Collection Array

			If we just simply do => Collection = JSON.parse(message.data)
			we will be setting Collection to a brand new array thus breaking the reference.
			Forcing us to $watch for every change.
			*/
			let messageData = JSON.parse(message.data);

			/** The ESP sends all the stored data, but we only need the last 13 months*/
			messageData = messageData.slice(-13);

			Collection.length = 0;

			messageData.forEach((item, index, array) => {
				item.valueK = item.value / 100;
				item.diffK = item.diff / 100;
				item.diffBill = Math.floor(item.diffK * 133.8);
				item.timestamp = moment(`${item.month}/${item.year}`, "M/YYYY").utc();
				item.color = index === 0 ? '#eeeeee' : index === 11 ? '#607d8b' : index === 12 ? '#212121' : '#9e9e9e';

				Collection.push(item);
			});
		});
		/**
		The last element in Collection Array is the current measure of the value in the real-life
		data is structured in this abstracted way
		=> [...previousMonths{...},{...previousMonth},{...currentMonth}]

		Thus the currentMonth as the following properties
		=> {month: ..., year: ..., value:..., diff:...}
		"month" is the current month thats being measured
		"year" is the current year thats being measured
		"value" is the TOTAL amount reflected in the real-life counter. for example, If we take a look at the real-life meter then this number will supose to be the same as that
		"diff" is a very useful parameter because it gives us the current value minus the previous value.
		*/
		return Collection;
	}
})();