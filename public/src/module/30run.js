/*
 *
 * @author  "MrXploder"
 * @date		 "May/2018"
 * @about   ""
 *
 */
(function(angular) {
	'use strict';

	angular
		.module('angularApp')
		.run(angularRunMethod);

	angularRunMethod.$inject = ["$rootScope", "$localStorage", "$sessionStorage", "$state", "$window", "$timeout", "$interval", "ngNotify"];

	function angularRunMethod($rootScope, $localStorage, $sessionStorage, $state, $window, $timeout, $interval, ngNotify) {
		/*do not expose internal flags*/
		let iRouteChanging = false;

		/*config ngNotify*/
		/*I modify ngNotify so the padding bottom is the same as the navbar heigh*/
		ngNotify.config({
			theme: 'pure',
			position: 'top',
			duration: 3000,
			sticky: false,
			button: false,
			html: false
		});

		/**
			globals for easy access in all templates...
			rootScope is: $rs
		 	route controllers are: $ctrl
		 	dialog controllers are: $vm
		 	directive controllers are: $vd

			$currentUser must be a function because of the angular digest cycle, if is a plain object
			angular will initialize it once, but if its a function will call-it periodically, this must be
			something about the ngStorage library.
		*/
		$rootScope.$rs = {
			$currentUser() {
				return $sessionStorage.currentUser;
			},
			$isRouteChanging: false,
		};

		/**
			catch all route changes at start
			We mainly do here is to catch if the user is not-logged-in and in the case if its true, redirect
		 	it to the "login state". In every route definition must be a data->requireLogin-> true<->false property
		 	so we know if that state he wants to go require login to access.
		*/
		$rootScope.$on('$stateChangeStart', (event, toState, toParams, fromState, fromParams) => {
			$rootScope.$rs.$isRouteChanging = true;

			if (toState.data.requireLogin && !$sessionStorage.currentUser) {
				event.preventDefault();
				$state.go("login");
			}
		});


		/**
			catch all route changes at success
			this here is only for displaying a "preloader" div. In every "stateChangeStart" we
		 	set a flag and when this event rises, we unset that flag. In view we use ng-hide to animate transitions
		 	and rootscope because we are not binded by any controller.

		 	Here I add a little delay so the transitions are smooth
		*/
		$rootScope.$on('$stateChangeSuccess', () => {
			$timeout(function() {
				$rootScope.$rs.$isRouteChanging = false;
			}, 100);
		});

		/**
			In case of error when switching routes, redirect to a route that we know it exist.
			Unset 'isChanging' flag is not necessary here because when we redirect to a valid route,
			the 'stateChangeSuccess' will do the work. These way we prevent showing the route while doing
			the workaround.
		*/
		$rootScope.$on('$stateChangeError', () => {
			$state.go("home");
		});
		$rootScope.$on('$stateNotFound', () => {
			$state.go("home");
		});
	}
})(window.angular);