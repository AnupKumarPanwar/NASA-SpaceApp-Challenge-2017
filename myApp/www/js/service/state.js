app.factory('State', ['$rootScope', 'Config', function($rootScope, Config) {
    var service = {};
    var mapStatus = 0;
    var buttonStatus = 0;
    var tripStatus = true;  //gmus
    var unitStatus = 0;  //meter
    var gpsStatus = 0;
    var gpsAccessStatus = true;
    var navStatus = false;
    var popupStatus = false;
    var fieldtripEnabled = false;
    var saveStatus = false;

    service.setMap=function(status){
      mapStatus = status;
      var phase = $rootScope.$root.$$phase;
      if (phase == '$apply' || phase == '$digest') return;
      $rootScope.$apply();
    };
    service.isMap=function(status){
      if(mapStatus === status) return true;
      return false;
    };
    service.getMap=function(){
      return mapStatus;
    };

    service.setTrip=function(status){
      tripStatus = status;
      Config.setTripMode(tripStatus);
      var phase = $rootScope.$root.$$phase;
      if (phase == '$apply' || phase == '$digest') return;
      $rootScope.$apply();
    };
    service.isTrip=function(status){
      if(tripStatus === status) return true;
      return false;
    };
    service.getTrip=function(){
      return tripStatus;
    };

    service.setUnit=function(status){
      unitStatus = status;
      var phase = $rootScope.$root.$$phase;
      if (phase == '$apply' || phase == '$digest') return;
      $rootScope.$apply();
    };
    service.isUnit=function(status){
      if(unitStatus === status) return true;
      return false;
    };
    service.getUnit=function(){
      return unitStatus;
    };

    service.setButton=function(status){
      if(status>=2 && !Config.isCurrentDB(1)){
        return;
      }
      buttonStatus = status;
      var phase = $rootScope.$root.$$phase;
      if (phase == '$apply' || phase == '$digest') return;
      $rootScope.$apply();
    };
    service.isButton=function(status){
      if(buttonStatus === status) return true;
      return false;
    };
    service.getButton=function(){
      return buttonStatus;
    };

    service.setSaveStatus=function(status){
      saveStatus = status;
      var phase = $rootScope.$root.$$phase;
      if (phase == '$apply' || phase == '$digest') return;
      $rootScope.$apply();
    };
    service.isSaveStatus=function(status){
      if(saveStatus === status) return true;
      return false;
    };
    service.getSaveStatus=function(){
      return saveStatus;
    };

    service.setPopup=function(status){
      popupStatus = status;
      var phase = $rootScope.$root.$$phase;
      if (phase == '$apply' || phase == '$digest') return;
      $rootScope.$apply();
    };
    service.isPopup=function(status){
      if(popupStatus === status) return true;
      return false;
    };
    service.getPopup=function(){
      return popupStatus;
    };

    service.setGPSAccess=function(status){
      gpsAccessStatus = status;
      var phase = $rootScope.$root.$$phase;
      if (phase == '$apply' || phase == '$digest') return;
      $rootScope.$apply();
    };
    service.isGPSAccess=function(status){
      if(gpsAccessStatus === status) return true;
      return false;
    };
    service.getGPSAccess=function(){
      return gpsAccessStatus;
    };

    service.setGPS=function(status){
      gpsStatus = status;
      var phase = $rootScope.$root.$$phase;
      if (phase == '$apply' || phase == '$digest') return;
      $rootScope.$apply();
    };
    service.isGPS=function(status){
      if(gpsStatus === status) return true;
      return false;
    };
    service.getGPS=function(){
      return gpsStatus;
    };

    service.setNav=function(status){
      navStatus = status;
      var phase = $rootScope.$root.$$phase;
      if (phase == '$apply' || phase == '$digest') return;
      $rootScope.$apply();
    };
    service.isNav=function(status){
      if(navStatus === status) return true;
      return false;
    };
    service.getNav=function(){
      return navStatus;
    };

    return service;
}]);
