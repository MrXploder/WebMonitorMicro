(function(angular) {
	'use strict';

	angular
		.module('angularApp')
		.controller('homeController', homeController);

	homeController.$inject = ["$scope", "WebMonitor"];

	function homeController($scope, WebMonitor) {
		let $ctrl = this;

		$ctrl.$WebMonitor = WebMonitor;
		$ctrl.$Chart = {
			labels: [],
			data: [],
			colors: [],
			series: ["Consumo Electrico"],
			options: {
				maintainAspectRatio: false,
				hover: {
					animationDuration: 0
				},
				legend: {
					display: false
				},
				animation: false,
				tooltips: {
					enabled: false,
				},
				scales: {
					yAxes: [{
						display: true,
						ticks: {
							min: 0,
							max: 450,
							steps: 20,
						}
					}]
				},
				animation: {
					duration: 1,
					onComplete: function() {
						var chartInstance = this.chart;
						var ctx = chartInstance.ctx;

						ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontSize, Chart.defaults.global.defaultFontStyle, Chart.defaults.global.defaultFontFamily);
						ctx.textAlign = 'center';
						ctx.textBaseline = 'bottom';

						this.data.datasets.forEach(function(dataset, i) {
							var meta = chartInstance.controller.getDatasetMeta(i);
							meta.data.forEach(function(bar, index) {
								var data = dataset.data[index];
								ctx.fillText(data, bar._model.x, bar._model.y - 5);
							});
						});
					}
				},
			}
		}
		$ctrl.$ChartTwo = {
			percentage: 0,
			data: [],
		}
		$ctrl.$ChartThree = {
			percentage: 0,
			data: [],
		}

		activate();
		/////////////////////////////////////////////////////////

		function activate() {

		}

		$scope.$watch("$ctrl.$WebMonitor", function(newValue) {
			if (!newValue) return;

			$ctrl.$Chart.labels = [];
			$ctrl.$Chart.colors = [];
			$ctrl.$Chart.data = [];

			$ctrl.$ChartTwo.data = [];

			/**
			If only we could pass an array of objects to the chartjs library :(
			*/
			newValue.forEach(item => {
				$ctrl.$Chart.labels.push(item.timestamp.format("MMM").toString());
				$ctrl.$Chart.colors.push(item.color);
				$ctrl.$Chart.data.push(Math.floor(item.diffK));
			});

			/**
			$ctrl.$Chart.data always have 13 items, so, for the sake of simplicity we do this
			*/
			const [first, , , , , , , , , , , secondToLast, last] = $ctrl.$Chart.data;

			$ctrl.$ChartTwo.data = [first, last];
			$ctrl.$ChartThree.data = [secondToLast, last];

			if ((first - last) >= 1) {
				$ctrl.$ChartTwo.percentage = first - last;
				$ctrl.$ChartTwo.relation = "menos";
			} else {
				$ctrl.$ChartTwo.percentage = last - first;
				$ctrl.$ChartTwo.relation = "más";
			}

			if ((secondToLast - last) >= 1) {
				$ctrl.$ChartThree.percentage = secondToLast - last;
				$ctrl.$ChartThree.relation = "menos";
			} else {
				$ctrl.$ChartThree.percentage = last - secondToLast;
				$ctrl.$ChartThree.relation = "más";
			}
		}, true);
	}
})(angular);