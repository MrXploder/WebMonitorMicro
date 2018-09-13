(function(){
	'use strict';

	angular
	.module('angularApp')
	.directive('hasWarning', hasWarningDirective);

	// hasWarningDirective.$inject = [""];

	function hasWarningDirective(){
		return {
			restrict: "A",
			link: link,
		}

		function link(scope, element, attributes){
			scope.$watch(attributes.hasWarning, value => {
				if(value) element.addClass('has-warning');
				else element.removeClass('has-warning');
			});
		}
	}
})();