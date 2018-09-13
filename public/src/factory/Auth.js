(function() {
	'use strict';

	angular
		.module('angularApp')
		.factory('Auth', authFactory);

	authFactory.$inject = ["$sessionStorage", "$resource"];

	function authFactory($sessionStorage, $resource) {
		const Resource = $resource('/auth', {}, {});

		Resource.prototype.$logIn = function() {
			return new Promise((resolve, reject) => {
				this
					.$save()
					.then(operator => {
						$sessionStorage.currentUser = operator;
						resolve();
					})
					.catch(reject);
			})
		}

		return Resource;
	}
})();