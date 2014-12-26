/**
 * Created by yangluguang on 2014/12/10.
 */

var knightControllers = angular.module('knightControllers', []);

knightControllers.controller('LoginController', ['$scope',
    function ($scope) {
        $scope.user = {
            username: '',
            password: ''
        };

        //$scope.user.usernameValid = $scope.user.username.length > 2;

        $scope.doLogin = function () {
            console.log($scope.user);
        };

        $scope.doReset = function () {
            console.log($scope.user);
        };
    }
]);

knightControllers.controller('RegisterController', ['$scope',
    function ($scope) {
        $scope.user = {};

        $scope.doRegister = function () {
            console.log($scope);
        };
    }
]);

knightControllers.controller('ListController', ['$scope',
    function ($scope) {
        $scope.username = 'list';
    }
]);