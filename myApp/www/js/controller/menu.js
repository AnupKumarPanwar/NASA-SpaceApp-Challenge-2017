app.controller('MenuCtrl', function($scope, Config, Modal, State, $location, DB, DataService, IonicUtilService, $ionicListDelegate, Message, $window) {
    $scope.slider = {
    	tripmode: "plane",
        gps: true,
        unitmode: "metric"
    };
    //change gps
    $scope.$watch("slider.gps", function(){
        State.setGPSAccess($scope.slider.gps);
    });
    //change trip mode
    var getTripMode = function(){
        if($scope.slider.tripmode==="car") return false;
        else if($scope.slider.tripmode==="plane") return true;
        else return true;
    };
    $scope.$watch(function(){return State.getMap();}, function(){
        if(State.isMap(0)||State.isMap(1)){
            State.setTrip(getTripMode());
        }
    });
    $scope.$watch("slider.tripmode", function(){
        if(State.isMap(0)|| State.isMap(1)){
        	State.setTrip(getTripMode());
        }
    });

    //change unit mode
    var getUnitMode = function(){
        if($scope.slider.unitmode==="metric") return 0;
        else if($scope.slider.unitmode==="imperial") return 1;
        else return 0;
    };
    var getUnitString = function(mode){
        if(mode==0) return "metric";
        else return "imperial";
    };

    $scope.unitChange = function(mode){
        if($window.ga) $window.ga.trackEvent('Units', 'Changed', $scope.slider.unitmode);
        State.setUnit(getUnitMode());
        if(localStorage){
            localStorage.setItem("foc_unit", State.getUnit());
        }
    }
    
    $scope.$watch(function(){return State.getUnit();}, function(){
        $scope.slider.unitmode = getUnitString(State.getUnit());
    });

    //reopen tutorial
    $scope.tutorial = function(){
      Modal.instruction().then(function(scope) {
          scope.start();
      });
    }

    $scope.fieldtrip = function(){
      if(Config.fieldModal) Config.fieldModal.start();
      $location.path("app/map");
    };
    // Returns count of field trips in selected path
    $scope.getFieldTripCount = function() {
        if(DataService.get('fieldtripguides')) {
            return DataService.get('fieldtripguides').length;
        }
        else {
            return 0;
        }
    };
});
