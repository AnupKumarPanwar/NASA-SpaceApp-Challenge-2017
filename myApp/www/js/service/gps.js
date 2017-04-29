app.factory('GPS', ['State', 'Config', '$timeout', 'Util', 'OL', '$rootScope', '$window', function(State, Config, $timeout, Util, OL, $rootScope, $window) {
    var service = {};
    service.geolocation = new ol.Geolocation({ projection: Config.mapProjection, trackingOptions: Config.gpsOption });
    service.deltaMean = 500;
    service.previousM = 0;
    service.positions = new ol.geom.LineString([], ('XYZM'));
    var feature2= new ol.Feature();
    feature2.setGeometry(service.positions);
    service.layer2 = new ol.layer.Vector({ source: new ol.source.Vector({wrapX: false}) });
    service.layer2.getSource().addFeature(feature2);

    service.feature = new ol.Feature();
    service.layer = new ol.layer.Vector({ source: new ol.source.Vector({wrapX: false}) });

    service.addPosition = function(position, heading, m, speed) {
        var x = position[0];
        var y = position[1];
        var fCoords = service.positions.getCoordinates();
        var previous = fCoords[fCoords.length - 1];

        var prevHeading = previous && previous[2];
        if (prevHeading) {
            var headingDiff = heading - Util.math.mod(prevHeading);
            if (Math.abs(headingDiff) > Math.PI) {
                var sign = (headingDiff >= 0) ? 1 : -1;
                headingDiff = -sign * (2 * Math.PI - Math.abs(headingDiff));
            }
            heading = prevHeading + headingDiff;
        }
        fCoords.push([x, y, heading, m]);
        service.positions.setCoordinates(fCoords.slice(-20));
    };


    var setMarkerStyle = function(stylename){
        switch(stylename){
            case 'arrow': service.feature.setStyle( OL.getArrowGpsPointStyle() ); break;
            case 'circle': service.feature.setStyle( OL.getGpsPointStyle() ); break;
        }
    };


    service.GPSInit = function() {
        setMarkerStyle('circle');
        service.layer.getSource().addFeature(service.feature);
        service.layer.setZIndex(1);
        State.setGPS(0);
    };

    var timestamp = undefined;
    var watchId = undefined;
    var dupTimestampCount = 0;
    var notAvailableCount = 0;
    service.stopWatchGPS = function() {
        State.setGPS(0);
        service.feature.setGeometry(null);
        if(watchId){
            $window.navigator.geolocation.clearWatch(watchId);
        }
        notAvailableCount=0;
        watchId = undefined;
        State.setNav(false);
    };
    service.watchGPS = function(){
        if($window.navigator){
            //run watch function
            if(!watchId) {
                watchId = $window.navigator.geolocation.watchPosition(function(location) {
                    notAvailableCount=0;
                    //if watch success
                    if(location.coords) {
                        //new location valid
                        var coords = location.coords;
                        var position = [coords.longitude, coords.latitude];
                        position = ol.proj.transform(position, Config.CRS, Config.mapProjection);
                        service.geolocation.set('position', position);
                        service.feature.setGeometry(new ol.geom.Point(position));

                        if(timestamp === location.timestamp){
                            //if retures the same position -> gps is invalid
                            dupTimestampCount++;
                            if(dupTimestampCount>=2){
                                console.log("success but not valid");
                                State.setGPS(2);
                            }
                            //keep watching
                        }else{
                            //if gps is valid
                            dupTimestampCount = 0;
                            timestamp=location.timestamp;
                            var heading = Util.math.degToRad(coords.heading)||0;
                            var altitude = coords.altitude ||0;
                            service.geolocation.set("heading", heading);
                            var speed = coords.speed ||0;
                            if(speed<0) speed = 0;
                            service.geolocation.set("speed", speed);
                            service.geolocation.set("altitude", altitude);
                            var m = Date.now();
                            service.addPosition(position, heading, m, speed);

                            var allcoords = service.positions.getCoordinates();
                            var len = allcoords.length;
                            if (len >= 2) {
                                service.deltaMean = (allcoords[len - 1][3] - allcoords[0][3]) / (len - 1);
                            }
                            State.setGPS(1);
                        }
                    }
                },function(error) {
                    dupTimestampCount = 0;
                    //if watch fail -> go to gps state 2
                    switch(error.code) {
                        case 1: {
                            console.log("error1: not allowed");
                            service.stopWatchGPS();
                        };break;
                        case 2: {
                            notAvailableCount=0;
                            console.log("error2: gps timeout");
                            $timeout(function(){
                                State.setGPS(2);
                                service.watchGPS();
                            }, 1000);
                        };break;
                        case 3: {
                            console.log("error3");
                            notAvailableCount++;
                            if(notAvailableCount>=2){
                                console.log("error3: gps position not available");
                                State.setGPS(2);
                            }
                            service.watchGPS();
                        };break;
                    };
                }, Config.gpsOption);
            }
        }
    };

    service.GPSInit();
    $rootScope.$watch(function(){ return State.getNav(); }, function(){
        if(State.isNav(true)){
            setMarkerStyle('arrow');
            if($window.backgroundGeoLocation) $window.backgroundGeoLocation.start();
        }else {
            setMarkerStyle('circle');
            if($window.backgroundGeoLocation) $window.backgroundGeoLocation.stop();
            service.deltaMean = 500;
            service.previousM = 0;
        }
    });
    return service;
}]);
