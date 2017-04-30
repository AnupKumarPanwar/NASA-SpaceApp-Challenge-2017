app.controller('MapCtrl', function($scope, $ionicPlatform, $window, $rootScope, $ionicHistory, $ionicGesture, $ionicSideMenuDelegate, $state, $q, Popover, $timeout, Config, OL, GPS, State, Util, TileService, Modal, IonicUtilService, RequestService, DataService, DB, Message, $http) {
    


 


    var map = undefined;
    var MapFeatureCollection = function() {
        this.collection = {};
    };
    MapFeatureCollection.prototype.getFeature = function(name) {
        return this.collection[name];
    };
    MapFeatureCollection.prototype.getFeatures = function() {
        var features = [];
        for (var key in this.collection) {
            features.push(this.collection[key]);
        }
        return features;
    };
    MapFeatureCollection.prototype.resetFeatures = function() {
        for (var key in this.collection) {
            this.collection[key].reset();
        }
    };
    MapFeatureCollection.prototype.addFeature = function(name, mapfeature) {
        if (!this.collection.hasOwnProperty(name)) {
            this.collection[name] = mapfeature;
        }
    };
    /********* feature ***********/
    var MapFeature = function(name, config) {
        this.layer = undefined;
        this.name = name;
        if (config) {
            this.layerbox = config.layerbox;
            this.popup = config.popup;
            this.req = config.request;
            this.download = config.download;
            this.red = config.render;
        }
    };
    MapFeature.prototype.setlayerSwitchOn = function(bool) {
        if(this.layerbox){
            if (bool) {
                this.layerbox.checked = true;
                this.layerbox.disabled = false;
            } else {
                this.layerbox.checked = false;
                this.layerbox.disabled = true;
            }
        }
    };
    MapFeature.prototype.setDownloadDisable = function(bool) {
        if (!this.download) return;
        this.download.disabled = bool;
    };
    MapFeature.prototype.reset = function() {
        if (!this.layer) return;
        map.removeLayer(this.layer);
        delete this.layer;
        this.layer = undefined;
        this.setlayerSwitchOn(false);
        this.setDownloadDisable(true);
    };
    MapFeature.prototype.visible = function(bool) {
        if (this.layer) this.layer.setVisible(bool);
    };
    /********* gd-feature ***********/
    var MapGd = function(name, config) {
        MapFeature.call(this, name, config);
    };
    MapGd.prototype = new MapFeature();
    MapGd.prototype.constructor = MapGd;
    MapGd.prototype.setLayerSource = function(source, style) {
        var vectorSource = source;
        var vectorStyle = style;
        this.layer = new ol.layer.Image({
            source: new ol.source.ImageVector({
                source: vectorSource,
                style: vectorStyle
            })
        });
    };
    /********* poi-feature ***********/
    var MapPoi = function(name, config) {
        MapFeature.call(this, name, config);
    };
    MapPoi.prototype = new MapFeature();
    MapPoi.prototype.constructor = MapPoi;
    MapPoi.prototype.setLayerSource = function(source, style) {
        var vectorSource = source;
        var vectorStyle = style;
        this.layer = new ol.layer.AnimatedCluster({
            name: 'Cluster',
            source: vectorSource,
            animationDuration: 500,
            style: vectorStyle
        });
    };
    var MapJuninPoi = function(name, config) {
        MapFeature.call(this, name, config);
    };
    MapJuninPoi.prototype = new MapFeature();
    MapJuninPoi.prototype.constructor = MapJuninPoi;
    MapJuninPoi.prototype.setLayerSource = function(source, style) {
        var vectorSource = source;
        var vectorStyle = style;
        this.layer = new ol.layer.Vector({
            source: vectorSource,
            style: vectorStyle
        });
    };
    var MapFtGd = function(name, config) {
        MapFeature.call(this, name, config);
    };
    MapFtGd.prototype = new MapFeature();
    MapFtGd.prototype.constructor = MapFtGd;
    MapFtGd.prototype.setLayerSource = function(source) {
        this.layer = new ol.layer.Vector({
            source: source
        });
        this.layer.setZIndex(3);
    };
    var MapNepalPoi = function(name, config) {
        MapFeature.call(this, name, config);
        this.lastestfeature = undefined;
    };
    MapNepalPoi.prototype = new MapFeature();
    MapNepalPoi.prototype.constructor = MapNepalPoi;
    MapNepalPoi.prototype.setLayerSource = function(source, style) {
        var vectorSource = source;
        var self = this;
        var vectorStyle = style;
        if (this.name == "neplogger") {
            this.lastestfeature.setStyle(new ol.style.Style({
                image: new ol.style.Circle({
                    radius: 12,
                    stroke: new ol.style.Stroke({
                        color: this.red.color
                    }),
                    fill: new ol.style.Fill({
                        color: this.red.color
                    })
                }),
                text: new ol.style.Text({
                    text: self.red.text,
                    fill: new ol.style.Fill({
                        color: '#fff'
                    })
                })
            }));
        } else if (this.name == "nepgpx") {
            this.lastestfeature.setStyle(new ol.style.Style({
                image: new ol.style.Circle({
                    radius: 12,
                    stroke: new ol.style.Stroke({
                        color: this.red.color
                    }),
                    fill: new ol.style.Fill({
                        color: this.red.color
                    })
                }),
                text: new ol.style.Text({
                    text: self.red.text,
                    fill: new ol.style.Fill({
                        color: '#fff'
                    })
                })
            }));
        }
        this.layer = new ol.layer.Vector({
            source: vectorSource,
            style: vectorStyle
        });
    };
    /********* marker-feature ***********/
    var MapMarker = function(name, config) {
        MapFeature.call(this, name, config);
        this.layer = new ol.layer.Vector({
            source: new ol.source.Vector({
                wrapX: false
            })
        });
        this.currentFeature = undefined;
        var popoverfeature = new ol.Feature({
            geometry: undefined
        });
        popoverfeature.setStyle(OL.getUserPopoverButtonStyle());
        this.popoverbutton = new ol.layer.Vector({
            source: new ol.source.Vector({
                wrapX: false
            })
        });
        this.popoverbutton.setZIndex(3);
        this.popoverbutton.getSource().addFeatures([popoverfeature]);
        this.popon = false;
    };
    MapMarker.prototype = new MapFeature();
    MapMarker.prototype.constructor = MapMarker;
    MapMarker.prototype.setLayerSource = function(source, style) {
        var vectorSource = source;
        var vectorStyle = style;
        this.layer = new ol.layer.Vector({
            source: vectorSource,
            style: vectorStyle
        });
    };
    MapMarker.prototype.getPopoverButton = function() {
        return this.popoverbutton;
    };
    MapMarker.prototype.dropPopoverButton = function(coordinate) {
        this.popoverbutton.getSource().getFeatures()[0].setGeometry(new ol.geom.Point(coordinate));
        this.popon = true;
    };
    MapMarker.prototype.setCurrentFeature = function(feature) {
        this.currentFeature = feature;
    };
    MapMarker.prototype.getCurrentFeature = function() {
        return this.currentFeature;
    };
    MapMarker.prototype.removePopoverButton = function() {
        this.popoverbutton.getSource().getFeatures()[0].setGeometry(undefined);
        this.popon = false;
    };
    /********* maprequest ***********/
    var MapRequest = function() {};
    MapRequest.prototype.start = function(mapfeature, param) {
        var defer = $q.defer();
        DataService.reset(mapfeature.name);
        var requestfunction = undefined;
        if (mapfeature instanceof MapMarker) {
            requestfunction = DB.load.marker;
        } else requestfunction = RequestService.queryAll;
        if (requestfunction) {
            var parameter = undefined;
            parameter = [mapfeature.name, param];
            requestfunction.apply(this, parameter).then(function(data) {
                DataService.set(mapfeature.name, data);
                defer.resolve({
                    name: mapfeature.name,
                    success: 1
                });
            }, function(e) {
                defer.resolve({
                    name: mapfeature.name,
                    success: 0,
                    message: e
                });
            });
        } else {
            defer.resolve({
                name: mapfeature.name,
                success: 0,
                message: "request function is invalid"
            });
        }
        return defer.promise;
    };
    /********* maprender ***********/
    var MapRender = function() {};
    MapRender.prototype.renderFeature = function(mapfeature, wkt, properties) {
        var feature = new ol.format.WKT().readFeature(wkt, {
            dataProjection: Config.CRS,
            featureProjection: Config.mapProjection
        });
        feature.setProperties(properties);
    };
    MapRender.prototype.start = function(mapfeature) {
        var data = DataService.get(mapfeature.name);
        mapfeature.reset();
        var defer = $q.defer();
        try {
            var features = [];
            var len = data.length;
            var source = undefined;
            var style = undefined;
            if (len === 0) {
                defer.resolve({
                    name: mapfeature.name,
                    success: 2,
                    message: Message.fails.render(mapfeature.name, 2)
                });
            }
            if (mapfeature instanceof MapPoi) {
                if(mapfeature.name=="ocean"){
                    for (var i = 0; i < len; i++) {
                        var feature = OL.geoJsonToFeature(data[i], Config.CRS, Config.mapProjection);
                        features.push(feature);
                    }
                }else{
                    for (var i = 0; i < len; i++) {
                        var item = data[i];
                        var coords = mapfeature.red.coords(item);
                        if (mapfeature.red.properties) var properties = mapfeature.red.properties(item);
                        else properties = item;
                        var feature = new ol.Feature(new ol.geom.Point(ol.proj.transform(coords, Config.CRS, Config.mapProjection)));
                        feature.setProperties(properties);
                        features.push(feature);
                    }
                }

                var styleCache = {};
                source = new ol.source.Cluster({
                    distance: 40,
                    source: new ol.source.Vector({
                        features: features,
                        wrapX: false
                    })
                });
                style = function(feature, resolution) {
                    return OL.poiFeatureStyle(feature.get('features').length, styleCache, mapfeature.red.color, mapfeature.red.text);
                };
            } else if (mapfeature instanceof MapJuninPoi) {
                for (var i = 0; i < len; i++) {
                    var feature = OL.geoJsonToFeature(data[i], Config.CRS, Config.mapProjection);
                    features.push(feature);
                }
                var styleCache = {};
                source = new ol.source.Vector({
                    features: features,
                    wrapX: false
                });
                style = function(feature, resolution) {
                    if (mapfeature.red.img) {
                        return OL.barPoiFeatureStyle(mapfeature.red.img);
                    } else {
                        return OL.juninPoiFeatureStyle(mapfeature.red.color, mapfeature.red.text);
                    }
                };
            } else if (mapfeature instanceof MapNepalPoi) {
                var maxtime = "";
                mapfeature.lastestfeature = undefined;
                for (var i = 0; i < len; i++) {
                    var item = data[i];
                    var coords = mapfeature.red.coords(item);
                    var time = item.utcDateTime;
                    var feature = new ol.Feature(new ol.geom.Point(ol.proj.transform(coords, Config.CRS, Config.mapProjection)));
                    feature.setProperties(item);
                    features.push(feature);
                    //maxtime<time
                    if (maxtime.localeCompare(time) < 0) {
                        maxtime = time;
                        mapfeature.lastestfeature = feature;
                    }
                }
                source = new ol.source.Vector({
                    features: features,
                    wrapX: true
                });
                style = function(feature, resolution) {
                    return OL.nepalPoiFeatureStyle(mapfeature.red.color);
                };
            } else if (mapfeature instanceof MapGd) {
                //geojson
                for (var i = 0; i < len; i++) {
                    var feature = OL.geoJsonToFeature(data[i], Config.CRS, Config.mapProjection);
                    features.push(feature);
                }
                source = new ol.source.Vector({
                    features: features,
                    wrapX: false
                });
                style = function(feature, resolution) {
                    if (feature.getProperties().color) return OL.gdFeatureStyle(feature.getProperties().color);
                    else {
                        return OL.gdFeatureStyle("#005ead");
                    }
                };
            } else if (mapfeature instanceof MapFtGd) {
                var stops = data.stops;
                if (stops) {
                    for (var i = 0; i < stops.length; i++) {
                        if (stops[i].shape) {
                            var feature = new ol.format.WKT().readFeature(stops[i].shape, {
                                dataProjection: Config.CRS,
                                featureProjection: Config.mapProjection
                            });
                            feature.setProperties(stops[i]);
                            feature.setStyle(OL.ftstopFeatureStyle(feature.getGeometry().getType()));
                            features.push(feature);
                        }
                    }
                }
                var source = new ol.source.Vector({
                    features: features,
                    wrapX: false
                });
            } else {
                for (var i = 0; i < len; i++) {
                    var feature = OL.geoJsonToFeature(data[i], Config.mapProjection, Config.mapProjection);
                    features.push(feature);
                }
                source = new ol.source.Vector({
                    features: features,
                    wrapX: false
                });
                style = function(feature, resolution) {
                    return OL.markerFeatureStyle();
                };
            }
            mapfeature.setLayerSource(source, style);
            delete features;
            defer.resolve({
                name: mapfeature.name,
                success: 1
            });
        } catch (error) {
            defer.resolve({
                name: mapfeature.name,
                success: 0,
                message: Message.fails.render(mapfeature.name, 1)
            });
        }
        return defer.promise;
    };
    /********* flightpath ***********/
    var MapFlightPath = function() {
        this.time = 1;
        this.startPoint = new ol.Feature({
            geometry: undefined
        });
        this.startPoint.setStyle(OL.getFlightPointStyle());
        this.endPoint = new ol.Feature({
            geometry: undefined
        });
        this.endPoint.setStyle(OL.getFlightPointStyle());
        this.pointLayer = new ol.layer.Vector({
            source: new ol.source.Vector({
                wrapX: true
            })
        });
        this.pointLayer.getSource().addFeatures([this.startPoint, this.endPoint]);
        this.path = new ol.Feature({
            geometry: undefined
        });
        this.multileft = [];
        this.multiright = [];
        this.currentside = true;
        this.arcPathGeo = undefined;
        this.arcPathLayer = new ol.layer.Vector({
            source: new ol.source.Vector({
                wrapX: true
            })
        });
        this.arcPathLayer.setStyle(OL.getArcPathStyle());
        this.arcPathBufferGeo = undefined;
        this.arcPathBufferLayer = new ol.layer.Vector({
            source: new ol.source.Vector({
                wrapX: true
            })
        });
        this.arcPathBufferLayer.setStyle(OL.getArcPathBufferStyle());
    };
    MapFlightPath.prototype.setVisible = function(layer, bool) {
        if (layer) layer.setVisible(bool);
    };
    MapFlightPath.prototype.getPathInfo = function(type) {
        try {
            switch (type) {
                case 'p':
                    {
                        return new ol.format.WKT().writeFeature(this.path, {
                            dataProjection: Config.CRS,
                            featureProjection: Config.mapProjection
                        });
                    };
                    break;
                case 'b':
                    {
                        var fapCoords = [];
                        for (var i = 0; i < this.arcPathGeo.features.length; i++) {
                            fapCoords = fapCoords.concat(this.arcPathGeo.features[i].geometry.coordinates);
                        }
                        return RouteBoxer.box(fapCoords, Config.bufferSize / 2);
                    };
                    break;
                case 'bp':
                    {
                        var array = [];
                        for (var i = 0; i < this.arcPathBufferGeo.length; i++) {
                            if (this.arcPathBufferGeo[i]) array.push(OL.featureToWKT(OL.geoJsonToFeature(this.arcPathBufferGeo[i])));
                        }
                        return array;
                    };
                    break;
                case 'tc':
                    {
                        var array = [];
                        for (var i = 0; i < this.arcPathBufferGeo.length; i++) {
                            if (this.arcPathBufferGeo[i]) array = array.concat(OL.calculateTiles(this.arcPathBufferGeo[i].geometry, Config.downloadZooms));
                        }
                        return array;
                    };
                    break;
                default:
                    return undefined;
            }
        } catch (e) {
            console.log(e);
            return undefined;
        }
    };
    MapFlightPath.prototype.setArcPathBuffer = function(geojsons) {
        if (geojsons) {
            this.arcPathBufferGeo = geojsons;
            this.arcPathBufferLayer.getSource().clear();
            for (var i = 0; i < geojsons.length; i++) {
                if (geojsons[i]) this.arcPathBufferLayer.getSource().addFeature(OL.geoJsonToFeature(geojsons[i], Config.CRS, Config.mapProjection));
            }
        }
    };
    MapFlightPath.prototype.reset = function() {
        this.startPoint.setGeometry(undefined);
        this.endPoint.setGeometry(undefined);
        this.path.setGeometry(undefined);
        this.pointLayer.setVisible(true);
        this.time = 1;
        this.multileft = [];
        this.multiright = [];
        this.currentside = true;
        this.arcPathGeo = undefined;
        this.arcPathLayer.setVisible(true);
        this.arcPathLayer.setSource(new ol.source.Vector({
            wrapX: true
        }));
        this.arcPathBufferGeo = undefined;
        this.arcPathBufferLayer.setVisible(true);
        this.arcPathBufferLayer.setSource(new ol.source.Vector({
            wrapX: true
        }));
    };
    /********* MapProcess ***********/
    var MapProcess = function(featurecollection) {
        this.featureCollection = featurecollection;
        this.mapRender = new MapRender();
        this.flightPath = new MapFlightPath();
    };
    MapProcess.prototype.renderAll = function(names, maxlen) {
        var promises = [];
        var self = this;
        for (var i = 0; i < names.length; i++) {
            promises.push(this.mapRender.start(mapFeatureCollection.getFeature(names[i])));
        }
        IonicUtilService.spinner.start();
        $q.all(promises).then(function(data) {
            IonicUtilService.spinner.stop();
            for (var i = 0; i < data.length; i++) {
                if (data[i]) {
                    self.featureCollection.getFeature(data[i].name).setDownloadDisable(true);
                    self.featureCollection.getFeature(data[i].name).setlayerSwitchOn(false);
                    if (data[i].success === 1) {
                        if (self.featureCollection.getFeature(data[i].name) instanceof MapGd) {
                            self.flightPath.setVisible(self.flightPath.arcPathBufferLayer, false);
                        }
                        self.featureCollection.getFeature(data[i].name).setDownloadDisable(false);
                        self.featureCollection.getFeature(data[i].name).setlayerSwitchOn(true);
                        map.addLayer(self.featureCollection.getFeature(data[i].name).layer);
                    } else if (data[i].success === 2) {
                        //self.successMessageArray.push(data[i].message);
                    } else {
                        self.errorMessageArray.push(data[i].message);
                    }
                }
            }
            if ((self.errorMessageArray.length) === 0) {
                if (self.successMessageArray.length > 0) IonicUtilService.toast.start(self.successMessageArray);
            } else if ((self.errorMessageArray.length) < maxlen) {
                IonicUtilService.errorAlert.start("Error", self.errorMessageArray, "", function(){
                    if(self.successMessageArray.length > 0) IonicUtilService.toast.start(self.successMessageArray);
                });
                /*IonicUtilService.confirm.start("Error", self.errorMessageArray, "Do you want to skip all failed processes?", function() {
                    if (self.successMessageArray.length > 0) IonicUtilService.toast.start(self.successMessageArray);
                }, function() {
                    State.setMap(0);
                    State.setButton(0);
                    State.setSaveStatus(false);
                    self.featureCollection.resetFeatures();
                    self.flightPath.reset();
                    DataService.resetAll();
                    $rootScope.$broadcast("event:popupoff", null);
                });*/
            } else {
                IonicUtilService.toast.start(["Failure loading data!"]);
                State.setMap(0);
                State.setButton(0);
                State.setSaveStatus(false);
                self.featureCollection.resetFeatures();
                self.flightPath.reset();
                DataService.resetAll();
                $rootScope.$broadcast("event:popupoff", null);
            }
        });
    };
    var MapLoadProcess = function(marker, features) {
        this.status = undefined;
        this.marker = marker;
        this.featureCollection = features;
        this.flightPath = new MapFlightPath();
        this.mapRender = new MapRender();
        this.mapRequest = new MapRequest();
        this.errorMessageArray = [];
        this.successMessageArray = [];
    };
    MapLoadProcess.prototype = new MapProcess();
    MapLoadProcess.prototype.getMarker = function() {
        if (this.marker) return this.marker;
    };
    MapLoadProcess.prototype.render = function(mpfeature) {
        var defer = $q.defer();
        var promises = [];
        var self = this;
        self.mapRequest.start(mpfeature, null).then(function(reqdata) {
            if (reqdata.success === 1) {
                self.mapRender.start(mpfeature).then(function(reddata) {
                    defer.resolve(reddata);
                });
            } else {
                defer.resolve(reqdata);
            }
        });
        return defer.promise;
    };
    MapLoadProcess.prototype.startObject = function() {
        var promises = [];
        var self = this;
        for (var key in this.featureCollection.collection) {
            var mpfeature = self.featureCollection.collection[key];
            promises.push(self.render(mpfeature));
        }
        $q.all(promises).then(function(data) {
            for (var i = 0; i < data.length; i++) {
                if (data[i].success != 0) {
                    self.featureCollection.collection[data[i].name].setlayerSwitchOn(true);
                    var layer = self.featureCollection.collection[data[i].name].layer;
                    layer.setZIndex(2);
                    map.addLayer(layer);
                }
            }
        });
    };
    MapLoadProcess.prototype.start = function() {
        var promises = [];
        var self = this;
        for (var key in this.featureCollection.collection) {
            var mpfeature = self.featureCollection.collection[key];
            promises.push(self.render(mpfeature));
        }
        if (promises.length > 0) {
            $q.all(promises).then(function(data) {
                for (var i = 0; i < data.length; i++) {
                    if (data[i].success != 0) {
                        self.featureCollection.collection[data[i].name].setlayerSwitchOn(true);
                        var layer = self.featureCollection.collection[data[i].name].layer;
                        layer.setZIndex(2);
                        map.addLayer(layer);
                    }
                }
            });
        }
    };
    /********* map path request ***********/
    var MapRunProcess = function(feature, featurecollection) {
        this.status = undefined;
        this.popupfeature = feature;
        this.featureCollection = featurecollection;
        this.flightPath = new MapFlightPath();
        this.errorMessageArray = [];
        this.successMessageArray = [];
        this.mapRequest = new MapRequest();
        this.mapRender = new MapRender();
        this.mapLocal = new MapLocal();
    };
    MapRunProcess.prototype = new MapProcess();
    MapRunProcess.prototype.setStatus = function(value) {
        this.status = value;
    };
    MapRunProcess.prototype.resetMessage = function() {
        this.errorMessageArray = [];
        this.successMessageArray = [];
    };
    MapRunProcess.prototype.hasGuide = function() {
        var defer = $q.defer();
        if (this.flightPath.getPathInfo("bp") && this.flightPath.getPathInfo("bp").length > 0) {
            var param = this.flightPath.getPathInfo("bp")[0];
            RequestService.fieldtripguides(param).then(function(ret) {
                if (ret && ret.length > 0) {
                    DataService.set("fieldtripguides", ret);
                    defer.resolve({
                        name: "fieldtripguides",
                        success: 1
                    });
                } else {
                    defer.resolve({
                        name: "fieldtripguides",
                        success: 0
                    });
                }
            });
        } else {
            console.log("no valid fp");
            defer.resolve({
                name: "fieldtripguides",
                success: 0
            });
        }
        return defer.promise;
    };
    MapRunProcess.prototype.requestPartial = function() {
        var promises = [];
        var self = this;
        for (var key in this.featureCollection.collection) {
            if (key != "fieldtripguide") {
                var paramtype = this.featureCollection.collection[key].req.paramtype;
                var param = this.flightPath.getPathInfo(paramtype);
                promises.push(this.mapRequest.start(this.featureCollection.collection[key], param));
            }
        }
        promises.push(self.hasGuide());
        IonicUtilService.spinnerWithCancel.start();
        $q.all(promises).then(function(reqdata) {
            IonicUtilService.spinnerWithCancel.stop();
            var maxlen = reqdata.length;
            self.flightPath.setVisible(self.flightPath.arcPathLayer, false);
            self.flightPath.setVisible(self.flightPath.pointLayer, false);
            var names = [];
            for (var i = 0; i < reqdata.length; i++) {
                if (reqdata[i].name != "fieldtripguides") {
                    if (reqdata[i].success === 1) {
                        names.push(reqdata[i].name);
                    } else {
                        mapFeatureCollection.getFeature(reqdata[i].name).setDownloadDisable(true);
                        mapFeatureCollection.getFeature(reqdata[i].name).setlayerSwitchOn(false);
                        self.errorMessageArray.push(reqdata[i].message);
                    }
                } else {
                    if (reqdata[i].success === 1) {
                        self.successMessageArray.push("There are field trip guides along your path. Find them in the side menu.");
                    }
                }
            }
            if (names.length === 0) {
                State.setMap(0);
                State.setButton(0);
                State.setSaveStatus(false);
                self.flightPath.reset();
                IonicUtilService.spinner.stop();
                IonicUtilService.toast.start(["All requests failed, please check internet connection."]);
            } else {
                State.setMap(3);
                State.setButton(2);
                self.renderAll(names, maxlen);
            }
        });
    };
    MapRunProcess.prototype.requestAll = function() {
        //requestFieldtripguide
        var promises = [];
        var self = this;
        IonicUtilService.spinnerWithCancel.start();
        for (var key in this.featureCollection.collection) {
            if (key != "fieldtripguide") {
                var paramtype = this.featureCollection.collection[key].req.paramtype;
                var param = this.flightPath.getPathInfo(paramtype);
                promises.push(this.mapRequest.start(this.featureCollection.collection[key], param));
            }
        }
        $q.all(promises).then(function(reqdata) {
            IonicUtilService.spinnerWithCancel.stop();
            var maxlen = reqdata.length;
            self.flightPath.setVisible(self.flightPath.arcPathLayer, false);
            self.flightPath.setVisible(self.flightPath.pointLayer, false);
            var names = ['fieldtripguide'];
            for (var i = 0; i < reqdata.length; i++) {
                if (reqdata[i].success === 1) {
                    names.push(reqdata[i].name);
                } else {
                    mapFeatureCollection.getFeature(reqdata[i].name).setDownloadDisable(true);
                    mapFeatureCollection.getFeature(reqdata[i].name).setlayerSwitchOn(false);
                    self.errorMessageArray.push(reqdata[i].message);
                }
            }
            if (names.length === 0) {
                State.setMap(0);
                State.setButton(0);
                State.setSaveStatus(false);
                self.flightPath.reset();
                IonicUtilService.spinner.stop();
                IonicUtilService.toast.start(["All requests failed, please check internet connection."]);
            } else {
                State.setMap(3);
                State.setButton(2);
                self.renderAll(names, maxlen);
            }
        });
    };
    /********* local ***********/
    var MapLocal = function() {
        this.tileindexes = [];
        this.poiarray = [];
        this.tileUnsaved = [];
        this.poiUnsaved = [];
        this.tryTimes = 3;
        this.failedSize = 0;
        this.remainSize = undefined;
        this.step = undefined;
        this.State = 1;
    };
    MapLocal.prototype.setStep = function(step) {
        this.step = step;
        var phase = $rootScope.$root.$$phase;
        if (phase == '$apply' || phase == '$digest') return;
        $rootScope.$apply();
    };
    MapLocal.prototype.nextStep = function() {
        this.step++;
        var phase = $rootScope.$root.$$phase;
        if (phase == '$apply' || phase == '$digest') return;
        $rootScope.$apply();
    };
    MapLocal.prototype.getStep = function() {
        return this.step;
    };
    MapLocal.prototype.success = function() {
        this.State = 1;
        scopes.downloadModalScope.progressBar.addFull();
        $timeout(function() {
            State.setMap(6);
            State.setButton(0);
            scopes.downloadModalScope.stop();
            IonicUtilService.alert.start("Saved", "");
        }, 500);
        if ($window.ga) {
          $window.ga.trackEvent('Path','Saved Succeeded');
        }
    };
    MapLocal.prototype.resetTime = function() {
        self.tryTimes = 3;
        self.remainSize = undefined;
    };
    MapLocal.prototype.fail = function(e) {
        State.setMap(4);
        this.State = 1;
        scopes.downloadModalScope.progressBar.reset();
        scopes.downloadModalScope.databox.reset();
        IonicUtilService.spinner.start();
        DB.remove.infocontent(DataService.get('id')).then(function() {
            IonicUtilService.spinner.stop();
            console.log("rollback success");
        }, function(e) {
            IonicUtilService.spinner.stop();
            console.log("rollback fail");
        });
        if ($window.ga) {
          $window.ga.trackEvent('Path','Saved Failed');
        }
        if (e) IonicUtilService.alert.start("Save failed", e);
    };
    MapLocal.prototype.noQuerySave = function(name, queue, queuesize) {
        var defer = $q.defer();
        var self = this;
        if (!queue || queue.length === 0) {
            defer.resolve();
        } else {
            var array = queue.splice(0, queuesize);
            self.waitBar(DB.save[name].queue(array), array.length).then(function() {
                defer.resolve();
            }, function(e) {
                defer.reject(e);
            });
        }
        return defer.promise;
    };
    MapLocal.prototype.getQueue = function(name, queue, queuesize) {
        var promiseQueue = [];
        var array = queue.splice(0, queuesize);
        var cur = 0;
        while (cur < array.length) {
            var value = array[cur];
            promiseQueue.push(RequestService[name](value));
            cur++;
        }
        return $q.all(promiseQueue);
    };
    MapLocal.prototype.queueSave = function(name, queue, queuesize) {
        var defer = $q.defer();
        var self = this;
        var errorqueue = [];
        var solvedqueue = [];
        if (!queue || queue.length === 0) {
            defer.resolve();
        } else {
            if (name == "tile") scopes.downloadModalScope.progressBar.setText("Base map tiles left to download: " + (queue.length * 20 / 1024).toFixed(1) + " MB");
            else if (name == "wikiarticle") scopes.downloadModalScope.progressBar.setText("POI and articles left to save: " + queue.length);

            if (self.remainSize === queue.length) {
                self.tryTimes--;
            } else {
                self.resetTime();
                self.remainSize = queue.length;
            }
            if (self.tryTimes === 0) {
                if(self.failedSize < self.remainSize){
                    console.log("remain "+self.remainSize+">"+self.failedSize);
                    defer.reject("Save failed, please check your connection and try again.");
                }else{
                    console.log("remain "+self.remainSize+"<"+self.failedSize);
                    console.log("Some requests fail ----", self.failedSize, self.remainSize);
                    defer.resolve();
                }
            } else {
                self.getQueue(name, queue, queuesize).then(function(data) {
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].success) {
                            solvedqueue.push([data[i].key, data[i].value]);
                        } else {
                            errorqueue.push(data[i].key);
                        }
                    }
                    if (solvedqueue.length != 0) {

                        self.waitBar(DB.save[name].queue(solvedqueue), solvedqueue.length).then(function() {
                            for (var i = 0; i < errorqueue.length; i++) {
                                queue.push(errorqueue[i]);
                            }
                            errorqueue = [];
                            solvedqueue = [];
                            defer.resolve();
                        }, function(e) {
                            errorqueue = [];
                            solvedqueue = [];
                            defer.reject(e);
                        });
                    } else {
                        for (var i = 0; i < errorqueue.length; i++) {
                            queue.push(errorqueue[i]);
                        }
                        errorqueue = [];
                        defer.resolve();
                    }
                });
            }
        }
        return defer.promise;
    };
    MapLocal.prototype.startSaveInfo = function() {
        //step 1;
        var self = this;
        DB.handler.transaction(function(tx) {
            scopes.downloadModalScope.progressBar.setText("Saving path information...");
            var infoPromises = [];
            infoPromises.push(self.waitBar(DB.save.info(tx), 10));
            if (scopes.downloadModalScope.featurebox.checkbox.macro) {
                infoPromises.push(self.waitBar(DB.save.macro(tx), 20));
            }
            if(scopes.downloadModalScope.featurebox.checkbox.ocean) {
                infoPromises.push(self.waitBar(DB.save.ocean(tx), 20));
            }
            if (scopes.downloadModalScope.featurebox.checkbox.junin) {
                infoPromises.push(self.waitBar(DB.save.junin(tx), 20));
            }
            if (State.isSaveStatus(true)) {
                infoPromises.push(self.waitBar(DB.save.fieldtrip(tx), 20));
            }
            $q.all(infoPromises).then(function() {
                self.setStep(2);
                self.sendEvent(self.getStep());
            }, function(e) {
                self.fail(e);
            });
        });
    };
    MapLocal.prototype.startSaveTileIndex = function() {
        //step 2;
        var self = this;
        scopes.downloadModalScope.progressBar.setText("Saving base " + (DataService.get('tiletype').length == 1 ? "map" : "maps") + "...");
        self.noQuerySave('infotile', self.tileindexes, 20000).then(function() {
            if (self.tileindexes.length != 0) {
                self.sendEvent(self.getStep());
            } else {
                self.resetTime();
                self.tileindexes = [];
                //step- 3
                self.setStep(3);
                //self.nextStep();
                self.sendEvent(self.getStep());
            }
        }, function(e) {
            self.fail(e);
        });
    };
    MapLocal.prototype.getUnsavedTile = function() {
        //step 3
        var self = this;
        DB.load.infotile().then(function(data) {
            if (!data) self.tileUnsaved = [];
            else self.tileUnsaved = data;
            //step- 4
            //self.nextStep();
            self.resetTime();
            self.setStep(4);
            self.failedSize = self.tileUnsaved.length/5;
            self.sendEvent(self.getStep());
        }, function(e) {
            self.fail(e);
        });
    };
    MapLocal.prototype.startSaveTile = function() {
        //step 4
        var self = this;
        self.queueSave('tile', self.tileUnsaved, 200).then(function() {
            if (self.tileUnsaved.length != 0) {
                self.sendEvent(self.getStep());
            } else {
                self.resetTime();
                self.tileUnsaved = [];
                //step- 5
                //self.nextStep();
                self.setStep(5);
                self.sendEvent(self.getStep());
            }
        }, function(e) {
            self.fail(e);
        });
    };
    MapLocal.prototype.startSavePoiArray = function() {
        //step 5
        var self = this;
        scopes.downloadModalScope.progressBar.setText("Saving points of interest...");
        self.noQuerySave('poi', self.poiarray, 20000).then(function() {
            if (self.poiarray.length != 0) {
                self.sendEvent(self.getStep());
            } else {
                self.poiarray = [];
                //step- 6
                //self.nextStep();
                self.setStep(6);
                self.failedSize = 10;
                self.sendEvent(self.getStep());
            }
        }, function(e) {
            self.fail(e);
        });
    };
    MapLocal.prototype.getUnsavedPoi = function() {
        //step 6
        var self = this;
        DB.load.poiwikiarticle().then(function(data) {
            if (!data) self.poiUnsaved = [];
            else self.poiUnsaved = data;
            //step- 7
            //self.nextStep();
            self.resetTime();
            self.setStep(7);
            self.sendEvent(self.getStep());
        }, function(e) {
            self.fail(e);
        });
    };
    MapLocal.prototype.startSavePoi = function() {
        //step 7
        var self = this;
        self.queueSave('wikiarticle', self.poiUnsaved, 200).then(function() {
            if (self.poiUnsaved.length != 0) {
                self.sendEvent(self.getStep());
            } else {
                self.poiUnsaved = [];
                //self.nextStep();
                self.setStep(8);
                self.sendEvent(self.getStep());
            }
        }, function(e) {
            self.fail(e);
        });
    };
    MapLocal.prototype.sendEvent = function(step) {
        $timeout(function() {
            $rootScope.$broadcast("event:save", {
                step: step
            });
        }, 500);
    };
    MapLocal.prototype.start = function(tileindexes, poiarray, guide) {
        var self = this;
        self.State = 2;
        self.guide = guide;
        self.tileindexes = tileindexes;
        self.tileUnsaved = [];
        self.poiarray = poiarray;
        self.poiUnsaved = [];
        self.remainSize = undefined;
        self.tryTimes = 3;
        self.setStep(1);
        self.sendEvent(self.getStep());
    };
    MapLocal.prototype.createNonQuerySave = function(name, queue, size) {
        return new this.nonQuerySave(name, queue, size, this);
    };
    MapLocal.prototype.createQuerySave = function(name, queue, size) {
        return new this.querySave(name, queue, size, this);
    };
    MapLocal.prototype.waitBar = function(promise, increase) {
        var defer = $q.defer();
        promise.then(function(data) {
            scopes.downloadModalScope.progressBar.addValue(increase);
            $timeout(function() {
                defer.resolve(data);
            }, 200);
        }, function(e) {
            defer.reject(e);
        })
        return defer.promise;
    };
    $rootScope.$on("event:save", function(evt, value) {
        if (mapRunProcess.mapLocal.State == 2) {
            switch (value.step) {
                case 1:
                    mapRunProcess.mapLocal.startSaveInfo();
                    break;
                case 2:
                    mapRunProcess.mapLocal.startSaveTileIndex();
                    break;
                case 3:
                    mapRunProcess.mapLocal.getUnsavedTile();
                    break;
                case 4:
                    mapRunProcess.mapLocal.startSaveTile();
                    break;
                case 5:
                    mapRunProcess.mapLocal.startSavePoiArray();
                    break;
                case 6:
                    mapRunProcess.mapLocal.getUnsavedPoi();
                    break;
                case 7:
                    mapRunProcess.mapLocal.startSavePoi();
                    break;
                case 8:
                    mapRunProcess.mapLocal.success();
                    break;
            }
        }
    });
    /*************** classes end ***************************************/
    //ionic elements:
    var scopes = {
        downloadModalScope: undefined,
        popoverModalScope: $scope.$new(),
        layerModalScope: undefined,
        stopsImageModalScope: undefined,
        fieldtripModalScope: undefined
    };
    $scope.getScopes = function() {
        return scopes.layerModalScope;
    }
    var interactions = undefined;
    var dragPanInteraction = undefined;
    var mapFeatureCollection = undefined;
    var mapRunFeatures = undefined;
    var mapLoadFeatures = undefined;
    var mapLoadMarker = undefined;
    var mapPopupFeature = undefined;
    var mapRunProcess = undefined;
    var mapLoadProcess = undefined;
    var mapElement = angular.element(document.querySelector('#map'));
    var mapFeatureSelecter = {
        interaction: undefined,
        reset: function() {
            if (this.interaction) {
                map.removeInteraction(this.interaction);
                delete this.interaction;
                this.interaction = undefined;
            }
        }
    };
    var initMapFeature = function() {
        mapFeatureCollection = new MapFeatureCollection();
        mapRunFeatures = new MapFeatureCollection();
        mapLoadFeatures = new MapFeatureCollection();
        //initfeature
        for (var i = 0; i < Config.infoNames.length; i++) {
            var item = Config.infoNames[i];
            var name = item.name;
            var type = item.type;
            var request = item.request;
            var mpfeature = undefined;
            if (type === 0) {
                mpfeature = new MapMarker(name, item);
                mapLoadMarker = mpfeature;
            } else if (type === 1) {
                mpfeature = new MapGd(name, item);
            } else if (type === 2) {
                mpfeature = new MapPoi(name, item);
            } else if (type === 3) {
                mpfeature = new MapJuninPoi(name, item);
            } else if (type === 4) {
                mpfeature = new MapNepalPoi(name, item);
            } else if (type === 5) {
                mpfeature = new MapFtGd(name, item);
                mapPopupFeature = mpfeature;
            }
            if (request.type === 1) {
                if (mpfeature) mapRunFeatures.addFeature(name, mpfeature);
            } else if (request.type === 2) {
                if (mpfeature) mapLoadFeatures.addFeature(name, mpfeature);
            }
            if (mpfeature) mapFeatureCollection.addFeature(name, mpfeature);
        }
    };
    var initMapControl = function() {
        mapRunProcess = new MapRunProcess(mapPopupFeature, mapRunFeatures);
        mapLoadProcess = new MapLoadProcess(mapLoadMarker, mapLoadFeatures);
        map.addLayer(mapLoadMarker.getPopoverButton());
        if (Config.isCurrentDB(1)) mapLoadProcess.start();
        map.addLayer(mapRunProcess.flightPath.arcPathBufferLayer);
        map.addLayer(mapRunProcess.flightPath.arcPathLayer);
        map.addLayer(mapRunProcess.flightPath.pointLayer);
    };
    var initMapTileLayer = function() {
        TileService.initLayers();
        var tileLayers = TileService.getLayers();
        for (var i = 0; i < tileLayers.length; i++) {
            map.addLayer(tileLayers[i]);
        }
    };
    var initMapGpsLayer = function() {
        //GPS.GPSInit();
        map.addLayer(GPS.layer);
        map.addLayer(GPS.layer2);
    };
    var scaleLineControl = new ol.control.ScaleLine({
        className: 'fcol-scale-line',
        target: "control-scale"
    });
    $rootScope.$watch(function() {
        return State.getUnit();
    }, function() {
        if (State.isUnit(0)) {
            scaleLineControl.setUnits('metric');
        } else if (State.isUnit(1)) {
            scaleLineControl.setUnits('us');
        } else {}
    });
    var initMap = function() {
        var min = ol.proj.transform([-130, 20], Config.CRS, Config.mapProjection);
        var max = ol.proj.transform([-40, 50], Config.CRS, Config.mapProjection);
        var rotateNorthControl = new ol.control.Rotate({
            className: 'fcol-rotate',
            target: "control-rotate"
        });
        var attributionControl = new ol.control.Attribution({
            collapseLabel: "«",
            label: "»",
            className: 'fcol-attribution',
            target: "control-attribution"
        });
        map = new ol.Map({
            interactions: ol.interaction.defaults({
                MouseWheelZoom: false,
                keyboard: false,
                shiftDragZoom: false,
                doubleClickZoom: false
            }),
            controls: ol.control.defaults({
                rotate: false,
                attribution: false
            }).extend([
                scaleLineControl,
                rotateNorthControl,
                attributionControl
            ]),
            loadTilesWhileAnimating: true,
            target: 'map',
            view: new ol.View({
                projection: Config.mapProjection,
                center: Config.mapCenter,
                zoom: Config.curZoom,
                minZoom: Config.minZoom,
                maxZoom: Config.maxZoom,
            })
        });
        map.beforeRender(function(map, frameState) {
            if (State.isNav(true)) {
                if (frameState !== null) {
                    var m = frameState.time - GPS.deltaMean * 1.5;
                    m = Math.max(m, GPS.previousM);
                    GPS.previousM = m;
                    var c = GPS.positions.getCoordinateAtM(m, true);
                    var view = frameState.viewState;
                    if (c) {
                        view.center = Util.getCenterWithHeading(map.getSize(), c, -c[2], view.resolution, Config.navPercentage);
                        view.rotation = -c[2];
                    }
                }
            }
            return true;
        });
    };
    //-------------run function------------------
    var run = function() {
        Modal.download().then(function(data) {
            scopes.downloadModalScope = data;
        });
        Modal.layer().then(function(data) {
            scopes.layerModalScope = data;
        });
        Modal.stopsImage().then(function(data) {
            scopes.stopsImageModalScope = data;
        });
        Modal.fieldtrip().then(function(data) {
            Config.fieldModal = data;
        });
        initMap();
        initMapTileLayer();
        initMapFeature();
        initMapGpsLayer();
        initMapControl();
        interactions = map.getInteractions().getArray();
        dragPanInteraction = interactions.filter(function(interaction) {
            return interaction instanceof ol.interaction.DragPan;
        })[0];
        $ionicPlatform.registerBackButtonAction(function() {
            if (scopes.downloadModalScope && scopes.downloadModalScope.isShown()) {
                scopes.downloadModalScope.cancel();
            } else if (scopes.stopsImageModalScope && scopes.stopsImageModalScope.isShown()) {
                scopes.stopsImageModalScope.stop();
            } else if ($state.current && $state.current.name == 'app.map' && !Config.fieldModal.isShown()) {
                IonicUtilService.confirm.start(Message.MODAL.CONFIRM.EXITAPP.TITLE, [], Message.MODAL.CONFIRM.EXITAPP.MESSAGE, function() {
                    ionic.Platform.exitApp();
                }, null, "Exit", "Cancel");
            } else {
                if ($ionicHistory.backView()) {
                    $ionicHistory.goBack(-1);
                } else {
                    $ionicHistory.nextViewOptions({
                        disableBack: true
                    });
                    $state.go('app.map');
                }
            }
        }, 201);
    };
    run();
    $rootScope.$on('event:loadmap', function() {
        var names = [];
        var pathBuffer = undefined;
        if (DataService.get('info') && DataService.get('info').config) {
            State.setTrip(DataService.get('info').config.tripstatus);
            names = DataService.get('info').config.features; // List of all the data services that have been saved
            if (DataService.get('info').config.flightpath) {
                if (DataService.get('info').config.flightpath.bp) pathBuffer = DataService.get('info').config.flightpath.bp;
            }
        }
        State.setMap(6);
        State.setButton(0);
        mapRunProcess.flightPath.reset();
        mapFeatureSelecter.reset();
        mapRunProcess.flightPath.setArcPathBuffer(pathBuffer);
        mapRunFeatures.resetFeatures();
        mapRunProcess.resetMessage();
        mapRunProcess.renderAll(names, names.length);
        var pathBufferFeatureCollection = {
            "type": "FeatureCollection",
            "features": pathBuffer
        };
        var olPathBufferFeature = new ol.format.GeoJSON().readFeatures(pathBufferFeatureCollection, {
            dataProjection: Config.CRS,
            featureProjection: Config.mapProjection
        });
        //console.log(olPathBufferFeature[0].getGeometry().getExtent());
        map.getView().fit(olPathBufferFeature[0].getGeometry().getExtent(), map.getSize());
        $window.ga.trackEvent('Map','Saved map loaded');
    });
    $rootScope.$on("event:featurelayer", function(evt, value) {
        if (mapFeatureCollection) mapFeatureCollection.getFeature(value.name).visible(value.layerbox.checked);
    });
    //detect panning in navigation mode, exit nav smoothly
    $ionicGesture.on("dragstart", function(event) {
        if (State.isNav(true)) {
            State.setNav(false);
            $rootScope.$broadcast("event:button", {name: "navigation", state: false});
            $rootScope.$broadcast("event:navoff", null);
        }
    }, mapElement);
    $ionicGesture.on("hold", function(event) {
        if (!State.isMap(0) && !State.isMap(1)) {
            var pixel = [event.gesture.center.pageX, event.gesture.center.pageY];
            var coordinate = map.getCoordinateFromPixel(pixel);
            if (map.hasFeatureAtPixel(pixel)) {
                map.forEachFeatureAtPixel(pixel, function(feature, layer) {
                    var featurelayers = mapFeatureCollection.getFeatures();
                    var selectedfeaturelayer = null;
                    for (var i = 0; i < featurelayers.length; i++) {
                        if (featurelayers[i].layer === layer) selectedfeaturelayer = featurelayers[i];
                    }
                    if (selectedfeaturelayer instanceof MapMarker) {
                        return true;
                    } else {
                        mapLoadProcess.getMarker().dropPopoverButton(coordinate);
                    }
                    return true;
                });
            } else {
                mapLoadProcess.getMarker().dropPopoverButton(coordinate);
            }
        }
    }, mapElement);

    var counter=0;
    var loc1;
    var loc2;

    $scope.searching=true;

    $scope.startCurr=function(fltNo)
    {
        // alert(fltNo);

       // startApp.set({ /* params */
       //  "action": "ACTION_SEND",
       //  "package": "com.instagram.android",
       //  "type": "text/plain"
       // }, {
       //  "android.intent.extra.TEXT":"Text..."
       // }).start();


       $http.get('http://192.168.43.118:8080/coord/'+fltNo)
       .then (function(data)
       {
           // alert('done');
           var dd=data.data;
           console.log(dd.coords[0]);
           console.log(dd.coords[dd.coords.length-1]);
         loc1=[dd.coords[0].lng, dd.coords[0].lat];  
         loc2=[dd.coords[dd.coords.length-1].lng, dd.coords[dd.coords.length-1].lat];
        $scope.searching=false;

       }); 
    }

   

    var drawPath = function(coordinate) {
        var latestcoords = ol.proj.transform(coordinate, Config.mapProjection, Config.CRS);
        if (latestcoords[1] > 85) {
            latestcoords[1] = 85;
        } else if (latestcoords[1] < -85) {
            latestcoords[1] = -85;
        }


        if (counter==0) {
            // latestcoords=[76.64062499999997, 30.24957724046766];
            latestcoords=loc2;
            counter++;
        }
        else
        {
            // latestcoords=[33.9249, 18.4241];
            latestcoords=loc1;
        }

        // console.log(latestcoords);

        var factor = Math.floor((latestcoords[0] + 180) / 360);
        latestcoords[0] -= factor * 360;
        if (!mapRunProcess.flightPath.startPoint.getGeometry()) {
            //set start point & create linestring;
            latestcoords = ol.proj.transform(latestcoords, Config.CRS, Config.mapProjection);
            mapRunProcess.flightPath.startPoint.setGeometry(new ol.geom.Point(latestcoords));
            mapRunProcess.flightPath.path.setGeometry(new ol.geom.LineString([latestcoords]));
        } else {
            var lastcoords = ol.proj.transform(mapRunProcess.flightPath.path.getGeometry().getLastCoordinate(), Config.mapProjection, Config.CRS);
            //set end point & add coords to linestring & set map status & create arclinestring;
            if (Util.isSameCoords(latestcoords, lastcoords)) {
                // IonicUtilService.toast.start([Message.DRAW.FAIL.SAMECOORDS]);
                return;
            }
            var geofeature = Util.lingstring2Arc(lastcoords, latestcoords);
            var firstcoords, secondcoords;
            if (geofeature.geometry.coordinates[0][0] instanceof Array) {
                if (mapRunProcess.flightPath.time == 0) {
                    IonicUtilService.toast.start(["Cannot cross dateline twice."]);
                    return;
                }
                firstcoords = geofeature.geometry.coordinates[0];
                secondcoords = geofeature.geometry.coordinates[1];
                mapRunProcess.flightPath.time--;
            } else {
                firstcoords = geofeature.geometry.coordinates;
                secondcoords = null;
            }
            if (firstcoords) {
                if (mapRunProcess.flightPath.currentside) {
                    var lastmultileft;
                    if (mapRunProcess.flightPath.multileft.length == 0) {
                        lastmultileft = new ol.geom.LineString();
                        mapRunProcess.flightPath.multileft.push(lastmultileft);
                    } else lastmultileft = mapRunProcess.flightPath.multileft[mapRunProcess.flightPath.multileft.length - 1];
                    for (var i = 0; i < firstcoords.length; i++) {
                        lastmultileft.appendCoordinate(ol.proj.transform(firstcoords[i], Config.CRS, Config.mapProjection));
                    }
                } else {
                    var lastmultiright;
                    if (mapRunProcess.flightPath.multiright.length == 0) {
                        lastmultiright = new ol.geom.LineString();
                        mapRunProcess.flightPath.multiright.push(lastmultiright);
                    } else lastmultiright = mapRunProcess.flightPath.multiright[mapRunProcess.flightPath.multiright.length - 1];
                    for (var i = 0; i < firstcoords.length; i++) {
                        lastmultiright.appendCoordinate(ol.proj.transform(firstcoords[i], Config.CRS, Config.mapProjection));
                    }
                }
            }
            if (secondcoords) {
                mapRunProcess.flightPath.currentside = !mapRunProcess.flightPath.currentside;
                var newlinestring = new ol.geom.LineString();
                for (var i = 0; i < secondcoords.length; i++) {
                    newlinestring.appendCoordinate(ol.proj.transform(secondcoords[i], Config.CRS, Config.mapProjection));
                }
                if (this.currentside) {
                    mapRunProcess.flightPath.multileft.push(newlinestring);
                } else {
                    mapRunProcess.flightPath.multiright.push(newlinestring);
                }
            }
            var world1 = {
                type: "Feature",
                geometry: {
                    type: "Polygon",
                    coordinates: [
                        [
                            [-179.9, 85],
                            [179.9, 85],
                            [179.9, -85],
                            [-179.9, -85],
                            [-179.9, 85]
                        ]
                    ]
                }
            };
            var bufferpathgeo = [];
            for (var i = 0; i < mapRunProcess.flightPath.multileft.length; i++) {
                var feature = new ol.Feature({
                    geometry: mapRunProcess.flightPath.multileft[i]
                });
                var geo = OL.featureToGeoJson(feature, Config.mapProjection, Config.CRS);
                var buffergeo = turf.buffer(geo, Config.bufferSize, 'kilometers').features[0];
                buffergeo = turf.simplify(buffergeo, 0.1, false);
                buffergeo = turf.intersect(world1, buffergeo);
                if (buffergeo.geometry.type == "MultiPolygon") {
                    for (var i = 0; i < buffergeo.geometry.coordinates.length; i++) {
                        var polygon = turf.polygon(buffergeo.geometry.coordinates[i]);
                        Util.cutPointDigitsInPolygon(polygon);
                        bufferpathgeo.push(polygon);
                    }
                } else {
                    Util.cutPointDigitsInPolygon(buffergeo);
                    bufferpathgeo.push(buffergeo);
                }
                mapRunProcess.flightPath.arcPathLayer.getSource().addFeature(feature);
            }
            for (var i = 0; i < mapRunProcess.flightPath.multiright.length; i++) {
                var feature = new ol.Feature({
                    geometry: mapRunProcess.flightPath.multiright[i]
                });
                var geo = OL.featureToGeoJson(feature, Config.mapProjection, Config.CRS);
                var buffergeo = turf.buffer(geo, Config.bufferSize, 'kilometers').features[0];
                buffergeo = turf.simplify(buffergeo, 0.1, false);
                buffergeo = turf.intersect(world1, buffergeo);
                if (buffergeo.geometry.type == "MultiPolygon") {
                    for (var i = 0; i < buffergeo.geometry.coordinates.length; i++) {
                        var polygon = turf.polygon(buffergeo.geometry.coordinates[i]);
                        Util.cutPointDigitsInPolygon(polygon);
                        bufferpathgeo.push(polygon);
                    }
                } else {
                    Util.cutPointDigitsInPolygon(buffergeo);
                    bufferpathgeo.push(buffergeo);
                }
                mapRunProcess.flightPath.arcPathLayer.getSource().addFeature(feature);
            }
            //console.log("drawpath", bufferpathgeo)
            mapRunProcess.flightPath.setArcPathBuffer(bufferpathgeo);
            latestcoords = ol.proj.transform(latestcoords, Config.CRS, Config.mapProjection);
            if (!mapRunProcess.flightPath.endPoint.getGeometry()) {
                mapRunProcess.flightPath.endPoint.setGeometry(new ol.geom.Point(latestcoords));
                State.setMap(1);
                State.setButton(1);
            } else {
                mapRunProcess.flightPath.endPoint.getGeometry().setCoordinates(latestcoords);
            }
            mapRunProcess.flightPath.path.getGeometry().appendCoordinate(latestcoords);
        }
    };


    var createPath = function(polygonarray) {
        //console.log("path is set")
        mapRunProcess.flightPath.setArcPathBuffer(polygonarray);
    };
    $ionicGesture.on("tap", function(event) {

        var pixel = [event.gesture.center.pageX, event.gesture.center.pageY];
        // drawPath("311239.61, 5818103.50");
        var coordinate = map.getCoordinateFromPixel(pixel);
        if (State.isMap(0) || State.isMap(1)) {
            if (map.hasFeatureAtPixel(pixel)) {
                map.forEachFeatureAtPixel(pixel, function(feature, layer) {
                    var featurelayers = mapFeatureCollection.getFeatures();
                    var selectedfeaturelayer = null;
                    for (var i = 0; i < featurelayers.length; i++) {
                        if (featurelayers[i].layer === layer) selectedfeaturelayer = featurelayers[i];
                    }
                    if (selectedfeaturelayer && selectedfeaturelayer instanceof MapMarker) {
                        mapLoadProcess.getMarker().setCurrentFeature(feature);
                        $rootScope.$broadcast("event:popupon", {
                            type: selectedfeaturelayer.name,
                            content: {
                                name: feature.getProperties().name,
                                description: feature.getProperties().description,
                                coordinates: ol.proj.transform(feature.getGeometry().getCoordinates(), Config.mapProjection, Config.CRS)
                            }
                        });
                    } else {
                        mapLoadProcess.getMarker().removePopoverButton();
                        $rootScope.$broadcast("event:popupoff", null);
                        drawPath(coordinate);
                    }
                    return true;
                });
            } else {
                mapLoadProcess.getMarker().removePopoverButton();
                $rootScope.$broadcast("event:popupoff", null);
                drawPath(coordinate);
            }
        } else {
            if (map.hasFeatureAtPixel(pixel)) {
                map.forEachFeatureAtPixel(pixel, function(feature, layer) {
                    mapFeatureSelecter.reset();
                    if (layer === mapLoadProcess.getMarker().getPopoverButton()) {
                        $rootScope.$broadcast('event:button', {
                            name: 'popoverbutton'
                        });
                        return true;
                    }
                    if (mapLoadProcess.getMarker().popon) {
                        mapLoadProcess.getMarker().removePopoverButton();
                        return true;
                    }
                    // click star
                    var featurelayers = mapFeatureCollection.getFeatures();
                    var selectedfeaturelayer = undefined;
                    for (var i = 0; i < featurelayers.length; i++) {
                        var mpfeature = featurelayers[i];
                        if (mpfeature.layer === layer) selectedfeaturelayer = mpfeature;
                    }
                    if (selectedfeaturelayer && selectedfeaturelayer instanceof MapMarker) {
                        mapLoadProcess.getMarker().setCurrentFeature(feature);
                        $rootScope.$broadcast("event:popupon", {
                            type: selectedfeaturelayer.name,
                            content: {
                                name: feature.getProperties().name,
                                description: feature.getProperties().description,
                                coordinates: ol.proj.transform(feature.getGeometry().getCoordinates(), Config.mapProjection, Config.CRS)
                            }
                        });
                    } else if (selectedfeaturelayer && selectedfeaturelayer instanceof MapGd) {
                        mapFeatureSelecter.interaction = new ol.interaction.Select({
                            layers: [selectedfeaturelayer.layer],
                            style: function(feature, resolution) {
                                return OL.getInteractionStyle(feature.getGeometry().getType(), feature.getProperties().color);
                            }
                        });
                        $rootScope.$broadcast("event:popupon", {
                            scroll: false,
                            type: selectedfeaturelayer.name,
                            content: feature.getProperties()
                        });
                        map.addInteraction(mapFeatureSelecter.interaction);
                    } else if (selectedfeaturelayer && selectedfeaturelayer instanceof MapPoi) {
                        var fs = feature.getProperties().features;
                        var len = fs.length;
                        var properties = [];
                        for (var i = 0; i < len; i++) {
                            properties.push(fs[i].getProperties());
                        }
                        $rootScope.$broadcast("event:popupon", {
                            scroll: true,
                            type: selectedfeaturelayer.name,
                            content: properties
                        });
                    } else if (selectedfeaturelayer && selectedfeaturelayer instanceof MapJuninPoi) {
                        $rootScope.$broadcast("event:popupon", {
                            scroll: true,
                            type: selectedfeaturelayer.name,
                            content: feature.getProperties()
                        });
                    } else if (selectedfeaturelayer && selectedfeaturelayer instanceof MapNepalPoi) {
                        $rootScope.$broadcast("event:popupon", {
                            scroll: true,
                            type: selectedfeaturelayer.name,
                            content: feature.getProperties()
                        });
                    } else if (selectedfeaturelayer instanceof MapFtGd) {
                        //console.log(feature.getProperties().title);
                        if (State.isSaveStatus(true)) {
                            $rootScope.$broadcast("event:popupon", {
                                scroll: false,
                                type: selectedfeaturelayer.name,
                                content: DataService.get('fieldtripguide'),
                                anchor: feature.getProperties().id,
                                modal: scopes.stopsImageModalScope,
                                back: true
                            });
                        } else {
                            $rootScope.$broadcast("event:popupon", {
                                scroll: false,
                                type: selectedfeaturelayer.name,
                                content: DataService.get('fieldtripguide'),
                                anchor: feature.getProperties().id,
                                modal: scopes.stopsImageModalScope
                            });
                        }
                    } else {
                        mapFeatureSelecter.reset();
                        $rootScope.$broadcast("event:popupoff", null);
                    }
                    return true;
                });
            } else {
                mapFeatureSelecter.reset();
                mapLoadProcess.getMarker().removePopoverButton();
                $rootScope.$broadcast("event:popupoff", null);
            }
        }
    }, mapElement);
    $rootScope.$on("event:loadwiki", function(evt, title) {
        DataService.reset('article.wikiarticle');
        IonicUtilService.spinner.start();
        DB.load.wikiarticle(title).then(function(content) {
            if (!content) {
                //alert("from remote");
                RequestService.wikiarticle(title).then(function(retobj) {
                    if (retobj.success) {
                        DataService.set('article.wikiarticle', retobj.value);
                    } else {
                        DataService.set('article.wikiarticle', undefined);
                    }
                    IonicUtilService.spinner.stop();
                    $state.go("app.wiki");
                });
            } else {
                //alert("from db");
                IonicUtilService.spinner.stop();
                DataService.set('article.wikiarticle', content);
                $state.go("app.wiki");
            }
        });
    });
    $rootScope.$on("event:feature", function(event, value) {
        try {
            var feature;
            for (var i = 0; i < mapRunProcess.popupfeature.layer.getSource().getFeatures().length; i++) {
                var property = mapRunProcess.popupfeature.layer.getSource().getFeatures()[i].getProperties();
                if (value === property.id) feature = mapRunProcess.popupfeature.layer.getSource().getFeatures()[i];
            }
            var extent = feature.getGeometry().getExtent();
            if (extent) map.getView().fit(extent, map.getSize());
        } catch (error) {
            IonicUtilService.toast.start(["Cannot find feature on map, something is not right."]);
        }
    });
    $rootScope.$on("event:button", function(event, value) {
        switch (value.name) {
            case 'popoverdelete':
                {
                    var feature = mapLoadProcess.getMarker().getCurrentFeature();
                    var coords = feature.getGeometry().getCoordinates();
                    DB.remove.marker(coords).then(function() {
                        mapLoadProcess.getMarker().layer.getSource().removeFeature(feature);
                        $rootScope.$broadcast("event:popupoff", null);
                        IonicUtilService.toast.start(["Deleted"]);
                    }, function() {
                        IonicUtilService.alert.start("Error", "Cannot delete marker");
                    });
                };
                break;
            case 'popoverbutton':
                {
                    var coords = mapLoadProcess.getMarker().popoverbutton.getSource().getFeatures()[0].getGeometry().getCoordinates();
                    Popover.start(scopes.popoverModalScope, function(ret) {
                        $window.ga.trackEvent('Marker','Created');
                        var feature = new ol.Feature({
                            geometry: new ol.geom.Point(coords)
                        });
                        feature.setProperties(ret);
                        feature.setStyle(OL.getUserMarkerStyle());
                        var featureGeojson = OL.featureToGeoJson(feature);
                        IonicUtilService.spinner.start();
                        DB.save.marker(coords, featureGeojson).then(function() {
                            IonicUtilService.spinner.stop();
                            mapLoadProcess.getMarker().layer.getSource().addFeature(feature);
                            mapLoadProcess.getMarker().removePopoverButton();
                        }, function() {
                            IonicUtilService.spinner.stop();
                            IonicUtilService.alert.start("Error", "Cannot add marker");
                        });
                    }, function() {
                        IonicUtilService.spinner.stop();
                        mapLoadProcess.getMarker().removePopoverButton();
                    });
                };
                break;
            case 'fieldtripmore':
                {
                    State.setMap(2);
                    State.setButton(0);
                    if (value.content) {
                        var id = value.content.id;
                        mapRunProcess.flightPath.reset();
                        mapRunFeatures.resetFeatures();
                        RequestService.fieldtripguide(id).then(function(ret) {
							var fieldTripEventLabel = 'id=' + value.content.id + ',group_name=\'' + (value.content.hasOwnProperty('group_name') ? value.content.group_name : 'NOT_RETURNED') + '\',title=\'' + value.content.title + '\'';
							if ($window.ga) {
								$window.ga.trackEvent('Field Trip','Loaded',fieldTripEventLabel);
							}
                            try {
                                State.setSaveStatus(true);
                                Config.fieldtripName = ret.title;
                                DataService.set('fieldtripguide', ret);
                                mapRunProcess.popupfeature.fieldtrip = ret;
                                var shape = ret.geologicData.shape;
                                var feature = new ol.format.WKT().readFeature(shape, {
                                    dataProjection: Config.CRS,
                                    featureProjection: Config.mapProjection
                                });
                                var extent = feature.getGeometry().getExtent();
                                if (extent) map.getView().fit(extent, map.getSize());
                                $rootScope.$broadcast("event:popupon", {
                                    scroll: false,
                                    type: "fieldtripguide",
                                    content: DataService.get('fieldtripguide'),
                                    modal: scopes.stopsImageModalScope,
                                    back: true
                                });
                                var projfeature = new ol.format.WKT().readFeature(shape);
                                var geojson = OL.featureToGeoJson(projfeature);
                                createPath([geojson]);
                                State.setTrip(false);
                                DataService.set("bp", mapRunProcess.flightPath.arcPathBufferGeo);
                                DataService.set("tiles", mapRunProcess.flightPath.getPathInfo('tc'));
                                IonicUtilService.spinner.stop();
                                mapRunProcess.resetMessage();
                                mapRunProcess.requestAll();
                            } catch (error) {
                                IonicUtilService.spinner.stop();
                                IonicUtilService.toast.start(["Server side error. Please try again later."]);
                                State.setSaveStatus(false);
                                mapRunFeatures.resetFeatures();
                                mapRunProcess.flightPath.reset();
                                DataService.resetAll();
                                $rootScope.$broadcast("event:popupoff", null);
                                State.setMap(0);
                                State.setButton(0);
                            }
                        }, function(error) {
                            IonicUtilService.spinner.stop();
                            IonicUtilService.toast.start(["Failure loading data! Please try it again."]);
							var fieldTripEventLabel = 'id=' + value.content.id + ',group_name=\'' + (value.content.hasOwnProperty('group_name') ? value.content.group_name : 'NOT_RETURNED') + '\',title=\'' + value.content.title + '\'';
							if ($window.ga) {
								$window.ga.trackEvent('Field Trip','Failed',fieldTripEventLabel);
							}
                            State.setSaveStatus(false);
                            mapRunFeatures.resetFeatures();
                            mapRunProcess.flightPath.reset();
                            $rootScope.$broadcast("event:popupoff", null);
                            DataService.resetAll();
                            State.setMap(0);
                            State.setButton(0);
                        });
                    } else {
                        IonicUtilService.toast.start(["Loading error! Please try it again."]);
                        mapRunFeatures.resetFeatures();
                        mapRunProcess.flightPath.reset();
                        DataService.resetAll();
                        $rootScope.$broadcast("event:popupoff", null);
                        State.setMap(0);
                        State.setButton(0);
                    }
                };
                break;
            case 'navigation':
                {
                    if (value.state) {
                        State.setNav(true);
                        //IonicUtilService.toast.start([Message.GPS.NAVIGATION.ON]);
                        if ($window.ga) {
                            $window.ga.trackEvent('GPS','Nav mode enabled');
                        }
                    } else {
                        State.setNav(false);
                        if (GPS.geolocation.getPosition()) map.getView().setCenter(GPS.geolocation.getPosition());
                        //IonicUtilService.toast.start([Message.GPS.NAVIGATION.OFF]);
                        if ($window.ga) {
                            $window.ga.trackEvent('GPS','Nav mode disabled');
                        }
                    }
                };
                break;
            case 'center':
                {
                    var pan = ol.animation.pan({
                        duration: 1000,
                        source: (map.getView().getCenter())
                    });
                    map.beforeRender(pan);
                    if (GPS.geolocation.getPosition()) map.getView().setCenter(GPS.geolocation.getPosition());
                    if ($window.ga) {
                      $window.ga.trackEvent('GPS','Centered');
                    }
                };
                break;
            case 'yes':
                {
                    State.setMap(2);
                    State.setButton(0);
                    DataService.set("bp", mapRunProcess.flightPath.arcPathBufferGeo);
                    DataService.set("tiles", mapRunProcess.flightPath.getPathInfo('tc'));
                    mapRunProcess.resetMessage();
                    mapRunProcess.requestPartial();
                    var status = State.getTrip()?"plane":"car/foot";
                    if ($window.ga) {
                      $window.ga.trackEvent('Path', 'Loaded', status);
                    }
                };
                break;
            case 'download':
                {
                    if ($window.ga) {
                      $window.ga.trackEvent('Path', 'Download Started');
                    }
                    State.setMap(4);
                    scopes.downloadModalScope.start();
                };
                break;
            case 'clear':
                {
                    mapRunFeatures.resetFeatures();
                    mapRunProcess.flightPath.reset();
                    DataService.resetAll();
                    State.setMap(0);
                    State.setButton(0);
                    State.setSaveStatus(false);
                    mapFeatureSelecter.reset();
                    $rootScope.$broadcast("event:popupoff", null);
                };
                break;
            case 'downloadback':
                {
                    mapRunProcess.mapLocal.State = 1;
                    if (State.isMap(5)) {
                        IonicUtilService.confirm.start("Cancel downloading", [], "Do you want to stop the downloading process?", function() {
                            IonicUtilService.spinner.start();
                            DB.remove.infocontent(DataService.get('id')).then(function() {
                                IonicUtilService.spinner.stop();
                                console.log("rollback success");
                                scopes.downloadModalScope.stop();
                                State.setMap(3);
                            }, function(e) {
                                IonicUtilService.spinner.stop();
                                console.log("rollback fail");
                                scopes.downloadModalScope.stop();
                                State.setMap(3);
                            });
                        }, function() {
                            State.setMap(5);
                            mapRunProcess.mapLocal.State = 2;
                            mapRunProcess.mapLocal.sendEvent(mapRunProcess.mapLocal.getStep());
                        }, "Yes", "No");
                    } else {
                        scopes.downloadModalScope.stop();
                        State.setMap(3);
                    }
                };
                break;
            case 'save':
                {
                    var self = this;
                    DataService.set("id", scopes.downloadModalScope.databox.name);
                    DataService.set("tiletype", scopes.downloadModalScope.tilebox.getSelectedTile());
                    IonicUtilService.spinner.start();
                    DB.checkID().then(function() {
                        IonicUtilService.spinner.stop();
                        State.setMap(5);
                        var tileindexes = [],
                            poiarray = [],
                            featurearray = [],
                            guide, value = 0,
                            infotype = "path";
                        var bp = DataService.get("bp");
                        tileindexes = tileindexes.concat(DataService.get("tiles"));
                        if (tileindexes.length === 0) {
                            IonicUtilService.alert.start("Error", "no tiles to download");
                            return;
                        }
                        for (var i = 0; i < Config.infoNames.length; i++) {
                            var item = Config.infoNames[i];
                            var key = item.name;
                            var type = item.type;
                            if (scopes.downloadModalScope.featurebox.checkbox[key]) {
                                featurearray.push(key);
                                if(key!="ocean"){
                                    if (type === 2 || type === 4) {
                                        poiarray = poiarray.concat(DataService.get(key));
                                    } else {
                                        value += 20;
                                    }
                                }
                            }
                        }
                        if (State.isSaveStatus(true)) {
                            if (featurearray.indexOf('fieldtripguide') != -1) {
                                guide = DataService.get('fieldtripguide');
                                infotype = "guide";
                                if (!guide) {
                                    IonicUtilService.alert.start("Error", "Field trip guide is not ready.");
                                    return;
                                }
                            }
                        }
                        DataService.set("info", {
                            name: scopes.downloadModalScope.databox.name,
                            description: scopes.downloadModalScope.databox.description,
                            type: infotype,
                            config: {
                                tripstatus: State.getTrip(),
                                features: featurearray,
                                flightpath: {
                                    bp: bp
                                }
                            }
                        });
                        value += tileindexes.length + tileindexes.length * DataService.get('tiletype').length + poiarray.length * 2;
                        scopes.downloadModalScope.progressBar.calculateMaxvalue(value);
                        scopes.downloadModalScope.progressBar.setVisible(true);
                        mapRunProcess.mapLocal.start(tileindexes, poiarray, guide);
                    }, function(e) {
                        IonicUtilService.spinner.stop();
                        IonicUtilService.alert.start("Error", Message.DOWNLOAD.FAIL.DUPNAME);
                    });
                };
                break;
        }
    });
});
