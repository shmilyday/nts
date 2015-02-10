var app = angular.module('myApp', []);

app.factory('userService', function($http) {
	var githubUrl = 'https://api.github.com';

	var runUserRequest = function(username, path) {
		return $http({
			method: 'JSONP',
			url: githubUrl + '/users/' + username + '/' + path + '?callback=JSON_CALLBACK'
		});
	};

	return {
		events: function(username) {
			return runUserRequest(username, 'events');
		}
	};
});

function Person() {
	var me = this;
	me.username = 'hhstuhacker';
	me.age = 33;
}

Person.prototype.sayInfo = function() {
	var me = this;
	alert(me.username + ' , ' + me.age);
};

app.service('personService', Person);

app.controller('LoginController', function($scope, $log, $timeout, userService, personService, myService, constantKey, appKey) {
	$scope.username = 'lonelyclick';

	$scope.person = personService;

	var timeout;

	$scope.$watch('username', function(newUsername) {
		if (timeout) timeout.cancel();
		timeout = $timeout(function() {
			userService.events(newUsername).success(function(data) {
				$log.log(arguments);
				$scope.events = data.data;
			}).error(function() {
				alert(2);
			});;
		}, 500);
	});

	myService.success(function() {
		console.log(arguments);
	});

	$scope.constantKey = constantKey;
	$scope.appKey = appKey;
});

app.provider('myService', {
	githubUrl: 'https://api.github.com',

	setGithubUrl: function(url) {
		var me = this;
		me.githubUrl = url;
	},

	method: 'JSONP',

	$get: function($http) {
		var me = this;
		return $http({
			method: me.method,
			url: me.githubUrl + '/users/lonelyclick/events?callback=JSON_CALLBACK'
		})
	}
});

app.config(function(myServiceProvider) {
	myServiceProvider.setGithubUrl('http://api.baidu.com');
});

app.value('appKey', 'appValue');
app.constant('constantKey', 'constantValue');

app.config(function (constantKey) {
	console.log(constantKey);
});