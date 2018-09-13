(function(angular) {
  'use strict';

  angular
    .module('angularApp')
    .filter('timeStampTo', timeStampTo);

  function timeStampTo() {
    return function(timeStamp, toFormat) {
      return timeStamp ? moment.utc(timeStamp, "x").format(toFormat).toString() : "";
    }
  }
})(window.angular);