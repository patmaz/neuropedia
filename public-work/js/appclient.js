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
        });
}]);

app.controller("mainViewController", ["$scope", "$resource", function ($scope, $resource) {

    $scope.api = $resource("/mongodb", {}, {
        get: {
            method: 'GET',
            isArray: true
        }
    });
    
    $scope.apiResult = $scope.api.get();
    console.log($scope.apiResult);
    
}]);