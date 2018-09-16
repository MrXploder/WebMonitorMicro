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
						var chartInstance = this.chart,
							ctx = chartInstance.ctx;

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

			newValue.forEach(item => {
				$ctrl.$Chart.labels.push(item.timestamp.format("MMM").toString());
				$ctrl.$Chart.colors.push(item.color);
				$ctrl.$Chart.data.push(Math.floor(item.diffK));
			});

			$ctrl.$ChartTwo.data = [$ctrl.$Chart.data[0], $ctrl.$Chart.data[12]];
			$ctrl.$ChartTwo.percentage = $ctrl.$Chart.data[0] - $ctrl.$Chart.data[12];
			
			$ctrl.$ChartThree.data = [$ctrl.$Chart.data[11], $ctrl.$Chart.data[12]];
			$ctrl.$ChartThree.percentage = $ctrl.$Chart.data[11] - $ctrl.$Chart.data[12];



		}, true);
	}
})(angular);