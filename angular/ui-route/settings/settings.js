/**
 * Created by yangluguang on 2014/12/16.
 */

angular.module('myApp.settings', ['ui.router']).config(['$stateProvider', '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.when('/settings', '/settings/kmanager');
        $stateProvider.state('settings', {
            url: '/settings',
            templateUrl: 'tpls/settings/settings.html',
            abstract: true
        }).state('settings.kmanager', {
            url: '/kmanager',
            templateUrl: 'tpls/settings/kmanager.html'
        }).state('settings.kperformance', {
            url: '/kperformance',
            templateUrl: 'tpls/settings/kperformance.html'
        }).state('settings.dmanager', {
            url: '/dmanager',
            templateUrl: 'tpls/settings/dmanager.html'
        }).state('settings.comanager', {
            url: '/comanager',
            templateUrl: 'tpls/settings/comanager.html'
        }).state('settings.stmanager', {
            url: '/stmanager',
            templateUrl: 'tpls/settings/stmanager.html'
        });
    }
]);