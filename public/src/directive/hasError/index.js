(function(){
	'use strict';

	angular
	.module('angularApp')
	.directive('hasError', hasErrorDirective);

	// hasErrorDirective.$inject = [""];

	function hasErrorDirective(){
		return {
			restrict: "A",
			link: link,
		}

		function link(scope, element, attributes){
			scope.$watch(attributes.hasError, value => {
				if(value) element.addClass('has-error');
				else element.removeClass('has-error');
			});
		}
	}
})();