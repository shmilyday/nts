/**
 * Created by yangluguang on 2014/12/16.
 */

angular.module('myApp.commonDirectives', []).directive('commonCityareas',
    function($http) {
        return {
            restrict: 'AE',
            templateUrl: 'tpls/directives/cityareas.html',
            scope: {
                citys: '=',
                aois: '=',
                filter: '='
            },
            link: function(scope, element, attrs, ctrl) {
                console.log(scope.cityareas);
            }
        };
    }
);