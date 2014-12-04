/**
 * Created by yangluguang on 2014/11/18.
 */

var app = angular.module('myApp', []);

angular.module('myApp.filters', []).filter('capitalize', function () {
    return function (input) {
        if (input) {
            return input[0].toUpperCase() + input.slice(1);
        }
    }
});

app.controller('FilterController', function ($scope, $parse) {
    $scope.n = 123;
    $scope.today = new Date();
});