app.directive('fcBox', function() {
    return {
        restrict: 'E',
        scope: {},
        template: '<div ng-show="visible()"></div>',
        compile: function(element, attrs){
            var type = attrs.type;
            var width = attrs.width||'auto';
            var attrobj = {};
            if(type) attrobj[type]=type;
            element.children().attr(attrobj);
            element.children().css({width: width+'px'});
        },
        controller: function($scope, $element, $attrs) {
            var visible=false;
            this.setVisible = function(bool){
                visible=bool;
            };
            this.getVisible = function(){
                return visible;
            };
            $scope.visible= function(){
                return visible;
            };
        }
    };
});

app.directive('info', function(GPS, $rootScope, State) {
    return {
        restrict: 'AE',
        scope: false,
        templateUrl: 'templates/util/box/info.html',
        controller: function($scope, $element, $attrs) {
            var geolocation={
                speed: 0,
                alt: 0
            };
            var unit = {
                speed: "",
                alt: ""
            };

            var name = "infocontent";
            $scope.getUrl = function(){
                return "templates/util/box/"+name+".html";
            };

            $scope.$watch(function(){
                return State.getGPS();
            }, function(){
                if(State.isGPS(2)){
                    name = "infosearch";
                }else if(State.isGPS(1)){
                    name = "infocontent";
                }else{
                    console.log("gps state is 0")
                }
            });

            $scope.getGeolocation = function(){
                var position = GPS.geolocation.getPosition();
                var speed = GPS.geolocation.getSpeed()||0;
                var altitude = GPS.geolocation.getAltitude()||0;
                geolocation.speed = parseFloat(Math.round(speed*10) / 10).toFixed(1);
                geolocation.alt = parseFloat(Math.round(altitude*10) / 10).toFixed(0);
                return geolocation;
            };

            $scope.getGeolocationWithUnit = function() {
                $scope.getGeolocation();
                if(State.isUnit(0)){
                    return {speed: geolocation.speed, alt: geolocation.alt };
                }else if(State.isUnit(1)){
                    return {speed: parseFloat(Math.round(geolocation.speed*2.236*10)/10).toFixed(1), alt: parseFloat(Math.round(geolocation.alt*3.28*10)/10).toFixed(0) };
                }else{
                    return {speed: "", alt: ""};
                }
            }

            $scope.getUnit = function() {
                if(State.isUnit(0)){
                    return {
                        speed: "m/s",
                        alt: "m"
                    };
                }else if(State.isUnit(1)){
                    return {
                        speed: "mph",
                        alt: "ft"
                    }
                }else{
                    return {speed: "", alt: ""}
                }
            };

            $rootScope.$watch(function(){return State.getUnit();}, function(){
                $scope.getGeolocationWithUnit();
                $scope.getUnit();
            });
        }
    };
});
app.directive('buttonGpsTriggered', function($rootScope, State, $window) {
    return {
        restrict: 'AE',
        require: '^fcBox',
        link: function(scope, element, attrs, controller) {
            var name = attrs.buttonname||"";
            $rootScope.$watch(State.getGPS, function(){
                if(!State.getGPS()){
                    controller.setVisible(false);
                }
            });
            $rootScope.$on("event:button", function(event, value) {
                if($window.ga) $window.ga.trackEvent('GPS','Information',value.state);
                if(value.name === name) controller.setVisible(value.state);
            });
        }
    };
});
