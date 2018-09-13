(function() {
	'use strict';

	angular
		.module('angularApp')
		.filter('characterCounter', characterCounterFilter);

	// characterCounterFilter.$inject = [""];

	function characterCounterFilter() {
		return function(value) {
			if (value && (typeof value === "string")) {
				return value.split('').length;
			} else {
				return 0;
			}
		}
	}
})();