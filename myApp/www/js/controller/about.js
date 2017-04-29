app.controller('AboutCtrl', ['$ionicPlatform', '$scope', 'Config', function($ionicPlatform, $scope, Config) {
    $scope.rateUs = function () {
        /*if ($scope.isDevice('ios')) {
            window.open('itms-apps://itunes.apple.com/us/app/flyover-country/id1059886913?mt=8');
        }else {
            window.open('market://details?id=com.ionicframework.app303739');
        }*/
    };
    $scope.isDevice=function(devicename){
        return $ionicPlatform.is(devicename);
    }

}]);
