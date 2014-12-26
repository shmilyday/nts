/**
 * Created by yangluguang on 2014/12/16.
 */

angular.module('myApp.commonDirectives', []).directive('commonCityareas',
    function ($http) {
        return {
            restrict: 'AE',
            templateUrl: 'tpls/directives/cityareas.html',
            link: function (scope, element, attrs, ctrl) {
                $http({
                    url: '/nts/README',
                    type: 'json'
                }).success(function (data, status) {
                    //console.log(arguments);
                    // load select data
                });

                var $city = element.find('[data-node="city"]'),
                    $area = element.find('[data-node="area"]');

                $city.bind('change', function () {
                    scope[attrs.changeload]($city.val(), $area.val());
                });

                $area.bind('change', function () {
                    scope[attrs.changeload]($city.val(), $area.val());
                });

                scope.stateParams.cityid && $city.val(scope.stateParams.cityid);
                scope.stateParams.aoiid && $area.val(scope.stateParams.aoiid);

                if (scope.stateParams.cityid) {
                    $city.val(scope.stateParams.cityid);
                } else {
                    scope[attrs.changeload]({cityid: $city.val()});
                }

                if (scope.stateParams.aoiid) {
                    $area.val(scope.stateParams.aoiid);
                } else {
                    scope[attrs.changeload]({aoiid: $area.val()});
                }

            }
        };
    }
);