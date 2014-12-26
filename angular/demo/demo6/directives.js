/**
 * Created by yangluguang on 2014/12/15.
 */

var knightDirectives = angular.module('commonDirectives', []);
knightDirectives.directive('uniqueUser', function ($http) {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, ctrl) {
            element.bind('keyup', function (e) {
                if (ctrl.$error.required || ctrl.$error.minlength || ctrl.$error.maxlength) return;
                $http({method: 'GET', url: 'data/unique.php?username=' + e.currentTarget.value}).
                    success(function (data, status, headers, config) {
                        if (parseInt(data) == 0) {
                            ctrl.$error.unique = false;
                            ctrl.$setValidity('username', true);
                        } else {
                            ctrl.$error.unique = true;
                            ctrl.$setValidity('username', false);
                        }
                    }).error(function (data, status, headers, config) {
                        ctrl.$error.unique = false;
                        ctrl.$setValidity('username', false);
                    });
            });
        }
    };
});

knightDirectives.directive('goodPoint', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, atts, ctrl) {
            var fibonacci = [1, 2, 3, 5, 8, 13, 20, 40, 80];

            ctrl.$parsers.unshift(function (viewValue) {
                if (fibonacci.indexOf(parseInt(viewValue)) >= 0) {
                    ctrl.$setValidity('fibonacci', true);
                    return viewValue;
                } else {
                    ctrl.$setValidity('fibonacci', false);
                    return;
                }
            });
        }
    };
});