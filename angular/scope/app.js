var app = angular.module('myApp', []);

debugger;
var otherApp = angular.module('myApp');

console.log(otherApp);

app.directive('myDirective', function() {
	return {
		scope: {
			username: '@username',
			onLogin: '&onLogin'
		},
		templateUrl: 'myDirective.html',
		replace: true,
		link: function(scope, element, attrs, controller) {
			console.log(scope.username, scope.password);
		}
	};
});

app.controller('LoginController', function($scope) {
	$scope.username = 'lonelyclick';

	$scope.doLogin = function() {
		alert('doLogin');
	};
});

app.controller('UserController', ['$scope', function($scope) {
	$scope.password = '123';

	$scope.sayHello = function () {
		alert('hello');
	};
}]);

app.directive('passwordDirective', function() {
	return {
		restrict: 'AE',
		scope: {
			password: '=',
			sayHelloMethod: '&'
		},
		template: '<div><input type="text" ng-model="password"/>{{password}} <button ng-click="sayHelloMethod()">sayHello</button></div>'
	};
});