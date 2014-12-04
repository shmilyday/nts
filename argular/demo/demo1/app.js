/**
 * Created by yangluguang on 2014/11/18.
 */
function ClockController($scope, $timeout) {

    $scope.userinfo = {
        username: '',
        password: ''
    };

    function updateClock() {
        $scope.clock = new Date();
        $timeout(function () {
            updateClock();
        }, 1000);
    }

    updateClock();

    $scope.userinfo.username = 'lonelyclick';
}