(function(angular, undefined) {
'use strict';

angular.module('angularApp', ['ui.router', 'ui.bootstrap', 'ngStorage', 'ngResource', 'ngSanitize', 'ngMessages', 'ngNotify', 'ngDialog', 'chart.js', 'ngWebSocket', 'angular-loading-bar'])

.constant('ENV', {shortSHA:'c9245ea',SHA:'c9245ea8413de157ea1c2ab31ea3947bd0596432',currentUser:'MrXploder',lastCommitMessage:'"Initial commit\r\n"',name:'master',lastCommitAuthor:'"MrXploder"',lastCommitTime:'"2018-09-11 18:40:23 -0300"',lastCommitNumber:'1'})

;
})(angular);