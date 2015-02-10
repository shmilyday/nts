var app = angular.module('myApp', ['myApp.settings', 'myApp.orderlist', 'myApp.commonDirectives',
	'myApp.commonService',
	'ui.router'
]);

app.config(function($stateProvider, $urlRouterProvider) {
	$urlRouterProvider.otherwise('/orderlist');
	$stateProvider.state('auth', {
		url: '/auth',
		templateUrl: 'tpls/auth.html'
	});
});

app.controller('tabController', ['$scope', function($scope) {
	$scope.onLogout = function() {
		alert('You Clicked logout BUTTON');
	}
}]);	