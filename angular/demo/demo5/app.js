/**
 * Created by yangluguang on 2014/11/18.
 */

var app = angular.module('myApp', []);

app.directive('hello', function () {
    return {
        restrict: 'AEMC',
        template: '<button>I am Button</button>',
        replace: true
    };
});

app.directive('world', function () {
    return {
        restrict: 'A',
        templateUrl: 'template.tmpl',
        replace: 'true'
    };
});

app.directive('welcome', function () {
    return {
        restrict: 'A',
        template: '<div>I am Template Content <span ng-transclude></span>  {{myAttr}}</div>',
        repleace: true,
        transclude: true,
        scope: {
            myAttr: '@'
        }
    };
});

app.controller('LoginController', function ($scope) {
    $scope.username = 'baidu username';

    $scope.doLogin = function () {
        console.log('doLogin 111');
    };
});

app.controller('UserController', function ($scope) {
    $scope.username = 'lonelyclick';

    $scope.doLogin2 = function () {
        console.log('doLogin 22222');
    };
});

app.directive('baidu', function () {
    return {
        restrict: 'A',
        template: '<div>Baidu Code</div>',
        replace: true,
        link: function (scope, element, attr) {
            element.bind('click', function () {
                console.log(attr);
                scope.$apply(attr.howtoload);
            });
        }
    };
});

app.directive('superman', function () {
    return {
        scope: {},
        restrict: 'AE',
        controller: function ($scope) {
            $scope.arr = [];
            this.add = function () {
                $scope.arr.push('add');
            };

            this.sub = function () {
                $scope.arr.push('sub');
            };

            this.good = function () {
                $scope.arr.push('good');
            };
        },
        link: function (scope, element, attr) {
            element.bind('mouseenter',function () {
                console.log(scope.arr);
            });
        }
    };
});

app.directive('add', function () {
    return {
        restrict: 'AE',
        require: '^superman',
        //template: '<div>add div</div>',
        link: function (scope, element, attr, superController) {
            superController.add();
        }
    };
});

app.directive('sub', function () {
    return {
        restrict: 'AE',
        require: '^superman',
        //template: '<div>add div</div>',
        link: function (scope, element, attr, superController) {
            superController.sub();
        }
    };
});

app.directive('good', function () {
    return {
        restrict: 'AE',
        require: '^superman',
        //template: '<div>add div</div>',
        link: function (scope, element, attr, superController) {
            superController.good();
        }
    };
});