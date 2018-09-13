(function(angular) {
	'use strict';

	angular
		.module('angularApp')
		.controller('homeController', homeController);

	homeController.$inject = ["$scope", "WebMonitor"];

	function homeController($scope, WebMonitor) {
		let $ctrl = this;

		$ctrl.webMonitor = WebMonitor;
		$ctrl.colors = ['#45b7cd', '#ff6384', '#ff8e72'];

		$ctrl.options = {
			animation: {
				duration: 0
			},
			scales: {
				yAxes: [{
					display: true,
					ticks: {
						beginAtZero: true,
						steps: 10,
						stepValue: 5,
						max: 450,
						min: 100,
					}
				}],
			}
		}
		$ctrl.datasetOverride = [{
			label: "Bar chart",
			borderWidth: 1,
			type: 'bar'
		}, {
			label: "Line chart",
			borderWidth: 3,
			hoverBackgroundColor: "rgba(255,99,132,0.4)",
			hoverBorderColor: "rgba(255,99,132,1)",
			type: 'line'
		}];

		activate();
		/////////////////////////////////////////////////////////

		function activate() {

		}
	}
})(angular);