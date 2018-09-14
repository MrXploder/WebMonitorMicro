(function(angular) {
	'use strict';

	angular
		.module('angularApp')
		.controller('homeController', homeController);

	homeController.$inject = ["$scope", "WebMonitor"];

	function homeController($scope, WebMonitor) {
		let $ctrl = this;

		$ctrl.$WebMonitor = WebMonitor;

		activate();
		/////////////////////////////////////////////////////////

		function activate() {

		}
	}
})(angular);