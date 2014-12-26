var app = angular.module('myApp', ['myApp.settings', 'myApp.orderlist', 'myApp.commonDirectives','ui.router']);

app.config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/orderlist');
    $stateProvider.state('auth', {
        url: '/auth',
        templateUrl: 'tpls/auth.html'
    });
});