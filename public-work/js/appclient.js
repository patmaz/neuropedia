var app = angular.module("app", ["ngResource", "ngRoute", "ngAnimate"]);

app.config(["$routeProvider", function ($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl: "/html/index2.html",
            controller: "mainViewController"
        })
        .when("/choose/:id", {
            templateUrl: "/html/chosen.html",
            controller: "chosenOne"
        })
        .when("/about", {
            templateUrl: "/html/about.html",
            controller: "mainViewController"
        });
}]);

app.service('getData', ['$resource', function($resource) {
    this.getAllTitles = function() {
        var api = $resource("/mongodb", {}, {
            get: {
                method: 'GET',
                isArray: true
            }
        });
        return api.get();
    };
    this.getEntry = function(title) {
        var api = $resource("/mongodb/:id", {}, {
            get: {
                method: 'GET',
                isArray: true
            }
        });
        var apiResult = api.get({
            id: title
        });
        return apiResult;
    };
}]);

app.filter('approveHtml', ['$sce', function($sce){
    return function(html) {
        return $sce.trustAsHtml(html);
    };
}]);

app.controller("mainViewController", ["$scope", "getData", function ($scope, getData) {
    $scope.apiResult = getData.getAllTitles();
}]);

app.controller("chosenOne", ["$scope", "$routeParams", "getData", function ($scope, $routeParams, getData) {
    $scope.apiResult = getData.getEntry($routeParams.id);
}]);

app.directive("item", function () {
    return {
        templateUrl: "html/singleentry.html",
        replace: true,
        restrict: "AE",
        scope: {
            data: "="
        }
    };
});