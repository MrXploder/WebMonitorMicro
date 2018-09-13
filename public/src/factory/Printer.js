(function() {
	'use strict';

	angular
		.module('angularApp')
		.factory('ngPrinter', ngPrinterFactory);

	ngPrinterFactory.$inject = ["$compile", "$http", "$timeout", "$templateCache", "$rootScope"];

	function ngPrinterFactory($compile, $http, $timeout, $templateCache, $rootScope) {
		function printHtml(html) {
			return new Promise((resolve, reject) => {
				let hiddenFrame = $('<iframe style="visibility: hidden"></iframe>').appendTo('body')[0];
				let htmlContent = `<!doctype html><html><body onload="printAndRemove();">${html}</body></html>`;
				let doc = hiddenFrame.contentWindow.document.open("text/html", "replace");

				hiddenFrame.contentWindow.printAndRemove = function() {
					hiddenFrame.contentWindow.print();
					$(hiddenFrame).remove();
					resolve();
				}

				doc.write(htmlContent);
				doc.close();
			});
		}

		function print(options) {
			return new Promise((resolve, reject) => {
				$http
					.get(options.templateUrl)
					.then(templateData => {
						let template = templateData.data;
						let printScope = $rootScope.$new();

						angular.extend(printScope, options.data);

						let element = $compile($(`<div>${template}</div>`))(printScope);

						printHtml(element.html())
							.then(() => {
								printScope.$destroy();
								resolve();
							});
					});
			});
		}

		return {
			print: print,
		}
	}
})();