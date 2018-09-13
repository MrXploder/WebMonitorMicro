(function() {
	'use strict';

	angular
		.module('angularApp')
		.filter('wordCounter', wordCounterFilter);

	// wordCounterFilter.$inject = [""];

	function wordCounterFilter() {
		return function(value) {
			if (value && (typeof value === "string")) {
				return value.trim().split(/\s+/).length;
			} else {
				return 0;
			}
		}
	}
})();