(function(){
	'use strict';

	angular
	.module('angularApp')
	.directive('hasSuccess', hasSuccessDirective);

	// hasSuccessDirective.$inject = [""];

	function hasSuccessDirective(){
		return {
			restrict: "A",
			link: link,
		}

		function link(scope, element, attributes){
			scope.$watch(attributes.hasSuccess, value => {
				if(value) element.addClass('has-success');
				else element.removeClass('has-success');
			});
		}
	}
})();