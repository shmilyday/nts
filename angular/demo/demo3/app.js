/**
 * Created by yangluguang on 2014/11/18.
 */

var app = angular.module('myApp', []);

app.controller('UserController', function ($scope, $parse) {

    //$scope.parseValue = 'somethins';

    $scope.$watch('username', function (newVal, oldVal, scope) {
        if (newVal !== oldVal) {
            var parseFun = $parse(newVal);
            $scope.parsedValue = parseFun(scope);
        }
    });

    $scope.a = 2;
});