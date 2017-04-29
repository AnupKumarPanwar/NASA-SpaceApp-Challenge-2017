app.controller('InstructionCtrl', function($ionicSlideBoxDelegate, $scope, $location, $window) {

      $scope.slideChanged = function(index) {
        $scope.slideIndex = index;
      };

      $scope.next = function() {
        $ionicSlideBoxDelegate.next();
      };
      $scope.previous = function() {
        $ionicSlideBoxDelegate.previous();
      };
      $scope.skip = function() {
        if ($window.ga) {
          $window.ga.trackEvent('Tutorial','Skipped');
        }
        $location.path('/app/map');
      };
      $scope.quit = function() {
        if ($window.ga) {
          $window.ga.trackEvent('Tutorial','Finished');
        }
        $location.path('/app/map');
      };

      if ($window.ga) {
        $window.ga.trackEvent('Tutorial', 'Started');
      }
})
