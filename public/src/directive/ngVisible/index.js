(function() {
	'use strict';

	angular
		.module('angularApp')
		.directive('ngVisible', ngVisibleDirective);

	function ngVisibleDirective() {
		function link(scope, element, attributes) {
			scope.$watch(attributes.ngVisible, value => {
				element.css('visibility', value ? 'visible' : 'hidden');
			});
		}

		return {
			restrict: "A",
			link: link,
		}
	}
})();