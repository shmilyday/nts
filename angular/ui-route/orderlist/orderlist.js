/**
 * Created by yangluguang on 2014/12/16.
 */
angular.module('myApp.orderlist', ['ui.router']).config(['$stateProvider', '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {
        $stateProvider.state('orderlist', {
            url: '/orderlist?cityid&aoiid&time&lasttime&status',
            views: {
                '': {
                    templateUrl: 'tpls/orderlist/orderlist.html'
                },
                'orders@orderlist': {
                    templateUrl: 'tpls/orderlist/orders.html',
                    controller: function ($scope, $state, $stateParams, $http) {
                        /*$scope.goState = function (params) {
                         $state.go('orderlist', params);
                         $scope.onQuery();
                         }

                         $scope.stateParams = $stateParams;

                         $scope.onQuery = function () {
                         $http({
                         url: '/nts/README'
                         }).success(function () {
                         alert(1);
                         });
                         };*/

                        $scope.cityareas = {};
                    }
                },
                'knights@orderlist': {
                    templateUrl: 'tpls/orderlist/knights.html'
                }
            },
            controller: function ($scope, $stateParams) {
                console.log($stateParams);
            }
        });
    }
]);