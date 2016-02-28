var app = angular.module("app", ["ngResource", "ngRoute"]);

app.config(["$routeProvider", function ($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl: "/html/index2.html",
            controller: "mainViewController"
        })
        .when("/add", {
            templateUrl: "/html/addentry.html",
            controller: "mainViewController"
        })
        .when("/upload", {
            templateUrl: "/html/upload.html",
            controller: "mainViewController"
        })
        .when("/choose/:id", {
            templateUrl: "/html/chosen.html",
            controller: "chosenOne"
        });
}]);

app.controller("mainViewController", ["$scope", "$resource", "$routeParams", function ($scope, $resource, $routeParams) {

    $scope.api = $resource("/mongodb", {}, {
        get: {
            method: 'GET',
            isArray: true
        }
    });
    
    $scope.apiResult = $scope.api.get();
    console.log($scope.apiResult);
    
    
}]);

app.controller("chosenOne", ["$scope", "$resource", "$routeParams", function ($scope, $resource, $routeParams) {

    $scope.api = $resource("/mongodb/:id", {}, {
        get: {
            method: 'GET',
            isArray: true
        }
    });
    
    $scope.apiResult = $scope.api.get({ id: $routeParams.id });
    
}]);

app.directive("item", function() {
    return {
        templateUrl: "html/singleentry.html",
        replace: true,
        restrict: "AE",
        scope: {
            data: "="
        }
    };
});