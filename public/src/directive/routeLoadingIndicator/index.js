(function(){
  angular
  .module('angularApp')
  .directive('routeLoadingIndicator', routeLoadingIndicatorDirective);

  routeLoadingIndicatorDirective.$inject = ["$rootScope"];

  function routeLoadingIndicatorDirective($rootScope){
    return {
      restrict: 'E',
      templateUrl: '/src/directive/routeLoadingIndicator/template.html',
    };
  }
})();