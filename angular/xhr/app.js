var app = angular.module('myApp', []);

app.controller('LoginController', function($scope, $http) {
	$scope.username = 'abc';

	/*var lru = $cacheFactory('lru', {
		capacity: 20
	});*/


	$http({
		url: 'test.json',
		method: 'GET'
	}).success(function(data, status, headers, config) {
		console.log(data, status, headers(), config);
	}).error(function(data, status, headers, config) {
		console.log(data, status, headers(), config);
	});

	$http({
		url: 'test.json',
		method: 'GET',
		cache: true
	}).success(function(data, status, headers, config) {
		console.log(data, status, headers(), config);
	}).error(function(data, status, headers, config) {
		console.log(data, status, headers(), config);
	});
});

app.factory('myInterceptor', function($q) {
	var interceptor = {
		'request': function(config) {

			console.log('request success');

			// 成功的请求方法
			return config; // 或者 $q.when(config);
		},
		'response': function(response) {

			console.log('response success');

			// 响应成功
			return response; // 或者 $q.when(config);
		},
		'requestError': function(rejection) {
			// 请求发生了错误，如果能从错误中恢复，可以返回一个新的请求或promise
			return response; // 或新的promise
			// 或者，可以通过返回一个rejection来阻止下一步
			// return $q.reject(rejection);
		},
		'responseError': function(rejection) {
			// 请求发生了错误，如果能从错误中恢复，可以返回一个新的响应或promise
			return rejection; // 或新的promise
			// 或者，可以通过返回一个rejection来阻止下一步
			// return $q.reject(rejection);
		}
	};
	return interceptor;
});

app.config(function($httpProvider) {
	$httpProvider.interceptors.push('myInterceptor');

	$httpProvider.defaults.headers.common['X-Requested-By'] = 'BaiDu Powerful';
	$httpProvider.defaults.headers.common['X-MX4-powfully-good-phone'] = 'FALSE';
});

/*app.config(function($httpProvider, $cacheFactory) {
	$httpProvider.defaults.cache = $cacheFactory('lru', {
		capacity: 20
	});
});*/