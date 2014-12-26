var app = angular.module('myApp', ['ngRoute', 'knightControllers', 'commonDirectives']);

app.config(function ($routeProvider) {
    $routeProvider.when('/login', {
        templateUrl: 'tpls/login.tmpl',
        controller: 'LoginController'
    }).when('/register', {
        templateUrl: 'tpls/register.tmpl',
        controller: 'RegisterController'
    }).when('/list', {
        templateUrl: 'tpls/list.tmpl',
        controller: 'ListController'
    }).otherwise({
        redirectTo: '/register'
    })
});