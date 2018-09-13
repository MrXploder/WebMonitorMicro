(function(){
	'use strict';

	angular
	.module('angularApp')
	.config(ngDialogConfig);

	ngDialogConfig.$inject = ["ngDialogProvider"];

	function ngDialogConfig(ngDialogProvider){
		ngDialogProvider.setDefaults({
			className: 'ngdialog-theme-default',
			plain: false,
			showClose: false,
			closeByDocument: false,
			closeByEscape: false,
		});
	}
})();


