(function(angular, undefined) {
'use strict';

angular.module('angularApp', ['ui.router', 'ui.bootstrap', 'ngStorage', 'ngResource', 'ngSanitize', 'ngMessages', 'ngNotify', 'ngDialog', 'chart.js', 'ngWebSocket', 'angular-loading-bar'])

.constant('ENV', {shortSHA:'99cc55f',SHA:'99cc55ff45a9aece4290cb2a9f6f7d7e844e0686',currentUser:'MrXploder',lastCommitTime:'"2018-09-16 13:49:49 -0300"',lastCommitAuthor:'"MrXploder"',lastCommitMessage:'"added 2 charts\r\n\r\n1.- represents the current month vs the same month but from a previous year\r\n\r\n2.- represents the current month vs the previous month.\r\n"',name:'master',lastCommitNumber:'7'})

;
})(angular);