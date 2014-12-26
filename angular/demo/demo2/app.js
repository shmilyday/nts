/**
 * Created by yangluguang on 2014/11/18.
 */

var app = angular.module('myApp', []);

app.controller('LoginController', function ($scope) {
    $scope.userinfo = {
        username: '',
        password: ''
    };

    $scope.doLogin = function () {
        alert($scope.userinfo.username + ' -- ' + $scope.userinfo.password);
    }
});