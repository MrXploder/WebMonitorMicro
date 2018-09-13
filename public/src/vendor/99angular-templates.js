angular.module("templates-main", ["empty.html"]);

angular.module("empty.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("empty.html",
    "");
}]);
