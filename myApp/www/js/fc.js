var app = angular.module('flyover', ['ionic']);
app.run(function(DB, Modal, $location, $ionicPlatform, $rootScope, $window, GPS, State, Config, Util) {
    ionic.Platform.ready(function() {
        var accessgps;
        /*$ionicPlatform.on("pause", function(){
            accessgps = State.getGPSAccess();
            State.setGPSAccess(false);
        });
        $ionicPlatform.on("resume", function(){
            State.setGPSAccess(accessgps);
        });*/


        

        $rootScope.$watch(function(){
            return State.getGPSAccess();
        },function(){
            if(State.getGPSAccess()){
                console.log("gps access watch");
                GPS.watchGPS();
            }else{
                console.log("gps access stop watch");
                GPS.stopWatchGPS();
            }
        });

        if ($window.cordova && $window.cordova.plugins && $window.cordova.plugins.Keyboard) {
            $window.cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
            $window.cordova.plugins.Keyboard.disableScroll(true);
        }

        if ($window.sqlitePlugin) {
            if(!localStorage.getItem("foc_loaded2")) {
                localStorage.setItem("foc_loaded2", true);
                DB.start();
                $location.path('/app/tut');
            }else{
                console.log("not first time");
                DB.start();
                $location.path('/app/map');
            }
            console.log("sqlite ok");
        }else{
            console.log("sqlite fails");
            $location.path('/app/map');
        }

        if(localStorage.getItem("foc_unit")){
            State.setUnit(parseInt(localStorage.getItem("foc_unit")));
        }

        if($window.backgroundGeolocation){
            var callbackFn = function(location) {
                var position = [location.longitude, location.latitude];
                position =  ol.proj.transform(position, Config.CRS, Config.mapProjection);
                var heading = Util.math.degToRad(location.bearing) ||0;
                var altitude = location.altitude ||0;
                var speed = location.speed ||0;
                var time = location.time ||0;
                if(speed<0) speed=0;
                var m = Date.now();
                if (m - time < 8000) {
                    GPS.geolocation.set('position', position);
                    GPS.geolocation.set('heading', heading);
                    GPS.geolocation.set('speed', speed);
                    GPS.geolocation.set('altitude', altitude);
                    GPS.addPosition(position, heading, m, speed);
                };
                $window.backgroundGeolocation.finish();
            };

            var failureFn = function(error) {
                console.log('$window.BackgroundGeoLocation error');
            };

            $window.backgroundGeolocation.configure(callbackFn, failureFn, {
                debug: false,
                stopOnTerminate: true,
                notificationTitle: "Flyover Country navigation mode enabled",
                notificationText: "Maintaining GPS signal",
                notificationIconColor: "#005EAD",
                locationTimeout: 1,
                desiredAccuracy: 0,
                stationaryRadius: 5,
                distanceFilter: 5,
                activityType: 'OtherNavigation'
            });
        }

        if($window.ga) {
          $window.ga.startTrackerWithId('UA-88319233-1');
					$window.ga.setAnonymizeIp(true);
					$window.ga.trackEvent('App', 'Started');
        } else {
          console.log("Google Analytics Unavailable");
        }
    });
});

// --------http config-----------------
app.config(function($httpProvider, $ionicConfigProvider) {
    $ionicConfigProvider.views.swipeBackEnabled(false);
    // $ionicConfigProvider.backButton.previousTitleText(false).text(' ');
    $httpProvider.defaults.useXDomain = true;
    //$httpProvider.defaults.headers.common['X-Requested-With'] = 'FlyoverCountry';
});
// --------route config-----------------
app.config(['$stateProvider', '$urlRouterProvider',function($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('app', {
            url: "/app",
            cache: false,
            abstract: true,
            templateUrl: "templates/menu.html",
            controller: 'MenuCtrl'
        })
        .state('app.saved', {
            url: "/saved",
            cache: false,
            views: {
                'menuContent': {
                    templateUrl: "templates/saved.html",
                    controller: 'SavedCtrl'
                }
            }
        })
        /*.state('app.fieldtrip', {
            url: "/fieldtrip",
            cache: false,
            views: {
                'menuContent': {
                    templateUrl: "templates/fieldtrip.html",
                    controller: 'FieldCtrl'
                }
            }
        })*/
        .state('app.about', {
            url: "/about",
            cache: true,
            views: {
                'menuContent': {
                    templateUrl: "templates/about.html",
                    controller: 'AboutCtrl'
                }
            }
        })
        .state('app.map', {
            url: "/map",
            cache: true,
            views: {
                'menuContent': {
                    templateUrl: "templates/map.html",
                    controller: 'MapCtrl'
                }
            }
        })
        .state('app.wiki', {
            url: "/wiki",
            cache: false,
            views: {
                'menuContent': {
                    templateUrl: "templates/wiki.html",
                    controller: 'WikiCtrl'
                }
            }
        })
        .state('app.cloudLand', {
            url: "/cloudLand",
            cache: true,
            views: {
                'menuContent': {
                    templateUrl: "templates/cloudLand.html",
                    controller: 'CloudLandCtrl'
                }
            }
        })
        .state('app.wth', {
            url: "/wth",
            cache: true,
            views: {
                'menuContent': {
                    templateUrl: "templates/wth.html",
                    controller: 'WthCtrl'
                }
            }
        })
        .state('app.wthcontent', {
            url: "/wthcontent/:id",
            cache: true,
            views: {
                'menuContent': {
                    templateUrl: "templates/wthContent.html",
                    controller: 'WthContentCtrl'
                }
            }
        })
        .state('app.clouds', {
            url: "/cloud",
            cache: true,
            views: {
                'menuContent': {
                    templateUrl: "templates/clouds.html",
                    controller: 'CloudsCtrl'
                }
            }
        })
        .state('app.cloudscontent', {
            url: "/cloudscontent/:id",
            cache: true,
            views: {
                'menuContent': {
                    templateUrl: "templates/cloudsContent.html",
                    controller: 'CloudsContentCtrl'
                }
            }
        })
        .state('app.faq', {
            url: "/faq",
            cache: true,
            views: {
                'menuContent': {
                    templateUrl: "templates/faq.html",
                    controller: 'FaqCtrl'
                }
            }
        })
        .state('app.tut', {
            url: "/tut",
            cache: false,
            views: {
                'menuContent': {
                    templateUrl: "templates/util/modal/instruction.html",
                    controller: 'InstructionCtrl',
                }
            }
        })
    //$urlRouterProvider.otherwise('/app/map');
}]);
