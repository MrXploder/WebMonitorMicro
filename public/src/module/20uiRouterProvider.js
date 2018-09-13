(function() {
	'use strict';

	angular
		.module('angularApp')
		.config(uiRouterProvider);

	uiRouterProvider.$inject = ["$stateProvider", "$urlRouterProvider"];


	function uiRouterProvider($stateProvider, $urlRouterProvider) {
		/*redirect to home if user loads a no-routed page e.x: host without '#'  */
		$urlRouterProvider.when('', '/home');
		/*if state does not exists, redirect to home*/
		$urlRouterProvider.otherwise('/home');

		$stateProvider
			.state('home', {
				url: '/home',
				templateUrl: "src/route/home/template.html",
				controller: "homeController",
				controllerAs: "$ctrl",
			})
	}
})();