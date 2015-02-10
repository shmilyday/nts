/**
 * Created by yangluguang on 2014/12/16.
 */
angular.module('myApp.orderlist', ['ui.router']).config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider.state('orderlist', {
            url: '/orderlist?cityid&aoiid&time&lasttime&status',
            views: {
                '': {
                    templateUrl: 'tpls/orderlist/orderlist.html'
                },
                'orders@orderlist': {
                    templateUrl: 'tpls/orderlist/orders.html'
                },
                'knights@orderlist': {
                    templateUrl: 'tpls/orderlist/knights.html'
                }
            },
            controller: function($scope, $stateParams) {
                console.log($stateParams);
            }
        });
    }
]).controller('orderController', function($scope, cityareasService) {
    $scope.citys = cityareasService.getCitys();
    $scope.aois = [];

    $scope.filter = {
        city: $scope.citys[0],
        aoi: null
    };

    $scope.onFilter = function() {
        console.log($scope.filter);
    };

    $scope.$watch('filter.city', function(newVal, oldVal) {
        $scope.aois = cityareasService.getAois(newVal);
        $scope.filter.aoi = $scope.aois[0];
    });
});