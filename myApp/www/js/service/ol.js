app.factory('OL', function() {
    var service = {};

    var getOpacity = function(color, opacity){
        var colorfill = new ol.color.asArray(color);
        colorfill.slice();
        colorfill[3] = opacity;
        return colorfill;
    };
    var gpsPointStyle = new ol.style.Style({
        image: new ol.style.Icon({
            anchor: [0.5, 0.5],
            anchorXUnits: 'fraction',
            anchorYUnits: 'fraction',
            src: 'img/geolocation_marker_static.png'
        })
    });
    var gpsArrowPointStyle = new ol.style.Style({
        image: new ol.style.Icon({
            anchor: [0.5, 0.5],
            anchorXUnits: 'fraction',
            anchorYUnits: 'fraction',
            src: 'img/navmarker.png'
        })
    });

    var flightPointStyle = new ol.style.Style({
        image: new ol.style.Icon({
            anchor: [0.5, 1],
            anchorXUnits: 'fraction',
            anchorYUnits: 'fraction',
            src: 'img/marker.png'
        })
    });
    var userMarkerStyle = new ol.style.Style({
        image: new ol.style.Icon({
            anchor: [0.5, 0.5],
            anchorXUnits: 'fraction',
            anchorYUnits: 'fraction',
            src: 'img/star.png'
        })
    });
    var userPopoverButtonStyle = new ol.style.Style({
        image: new ol.style.Icon({
            anchor: [0.5, 1],
            anchorXUnits: 'fraction',
            anchorYUnits: 'fraction',
            src: 'img/star-marker.png'
        })
    });
    var arcPathBufferStyle = new ol.style.Style({
        stroke: new ol.style.Stroke({
            width:1,
            color: "#005ead"
        }),
        fill: new ol.style.Fill({
            color: getOpacity("#005ead", 0)
        })
    });
    var arcPathStyle = new ol.style.Style({
        stroke: new ol.style.Stroke({
            width:1,
            color: "#005ead"
        })
    });

    service.getArrowGpsPointStyle = function(){
        return gpsArrowPointStyle;
    };
    service.getInteractionStyle = function(type, color){
        if(!color){
            color="#005ead";
        }
        var styles = {
            'Polygon': new ol.style.Style({
                stroke: new ol.style.Stroke({
                    width:1,
                    color: "#005ead"
                }),
                fill: new ol.style.Fill({
                    color: getOpacity(color, 0.3)
                })
            }),
            'MultiPolygon': new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: '#005ead',
                    width: 1
                }),
                fill: new ol.style.Fill({
                    color: getOpacity(color, 0.3)
                })
            }),
            'MultiPoint': new ol.style.Style({
                image:new ol.style.Circle({
                    radius: 8,
                    stroke: new ol.style.Stroke({
                        color: '#005ead',
                        width: 1
                    })
                })
            }),
            'Point': new ol.style.Style({
                image:new ol.style.Circle({
                    radius: 8,
                    stroke: new ol.style.Stroke({
                        color: '#005ead',
                        width: 1
                    })
                })
            })
        };
        return styles[type];
    };
    service.getGpsPointStyle = function(){
        return gpsPointStyle;
    };
    service.getFlightPointStyle = function(){
        return flightPointStyle;
    };
    service.getUserMarkerStyle = function(){
        return userMarkerStyle;
    };
    service.getUserPopoverButtonStyle = function(){
        return userPopoverButtonStyle;
    };
    service.getArcPathBufferStyle = function(){
        return arcPathBufferStyle;
    };
    service.getArcPathStyle = function(){
        return arcPathStyle;
    };


    service.featureToGeoJson = function(feature, projectionfrom, projectionto) {
        return JSON.parse(new ol.format.GeoJSON().writeFeature(feature, {
            featureProjection: projectionfrom,
            dataProjection: projectionto
        }));
    };
    service.featuresToGeoJson = function(features, projectionfrom, projectionto) {
        return JSON.parse(new ol.format.GeoJSON().writeFeatures(features, {
            featureProjection: projectionfrom,
            dataProjection: projectionto
        }));
    };
    service.featureToWKT = function(feature, projectionfrom, projectionto) {
        return new ol.format.WKT().writeFeature(feature);
    };

    service.markerFeatureStyle = function(){
        var style = null;
        if (!style) {
            style = [new ol.style.Style({
                image: new ol.style.Icon({
                    anchor: [0.5, 0.5],
                    anchorXUnits: 'fraction',
                    anchorYUnits: 'fraction',
                    src: 'img/star.png'
                })
            })];
        };
        return style;
    };
    service.poiFeatureStyle = function(size, styleCache, color, text){
        var style = styleCache[size];
        if (!style) {
            var color = colorStyle(size, color);
            var radius = radiusStyle(size);
            var text = textStyle(size, text);

            style = [new ol.style.Style({
                image: new ol.style.Circle({
                    radius: radius,
                    stroke: new ol.style.Stroke({
                        color: color
                    }),
                    fill: new ol.style.Fill({
                        color: color
                    })
                }),
                text: new ol.style.Text({
                    text: text,
                    font: "15px sans-serif",
                    fill: new ol.style.Fill({color: "white"}),
                    stroke: new ol.style.Stroke({color: color, width: 1})
                })
            })];
            styleCache[size] = style;
        };
        return style;
    };
    var colorStyle=function(size, color){
        if( size ===1 ){
            return getOpacity(color, 0.8);
        }else{
            return getOpacity(color, 0.6);
        }
    };
    var radiusStyle=function(size){
        var radius = 12;
        if(size ===1 ){
            radius = 12;
        }else if(size <= 50 ){
            radius = 14;
        }else if(size <= 100){
            radius = 16;
        }else{
            radius = 18;
        }
        return radius;
    };
    var textStyle=function(size, text){
        if(size === 1 ){
            return text;
        }else {
            return size.toString();
        }
    };

    service.gdFeatureStyle = function(color) {
        var style = null;
        var colorfill = getOpacity(color, 0.3);
        style = [new ol.style.Style({
            fill: new ol.style.Fill({
                color: colorfill
            }),
            stroke: new ol.style.Stroke({
                color: color
            })
        })];
        return style;
    };
    service.ftFeatureStyle = function() {
        return new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: '#ffffff',
                lineDash: [10],
                width: 1
            }),
            fill: new ol.style.Fill({
                color: 'rgba(0, 0, 0, 0)'
            })
        });
    }
    service.ftstopFeatureStyle = function(type) {
        var color = "rgb(88, 44, 131)";
        var colorTransparent ="rgba(88, 44, 131, 0.8)";

        var styles = {
        'LineString': new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: colorTransparent,
                width: 20
            }),
            text: new ol.style.Text({
                text: "G",
                font: "15px sans-serif",
                fill: new ol.style.Fill({color: "white"}),
                stroke: new ol.style.Stroke({color: color, width: 1})
            })
        }),
        'Polygon': new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: colorTransparent,
                width: 20}),
            fill: new ol.style.Fill({
                color: colorTransparent
            }),
            text: new ol.style.Text({
                text: "G",
                font: "15px sans-serif",
                fill: new ol.style.Fill({color: "white"})
            })
        }),
        'Point': new ol.style.Style({
            image: new ol.style.Icon({
                anchor: [0.5, 0.5],
                anchorXUnits: 'fraction',
                anchorYUnits: 'fraction',
                src: 'img/stop-empty.png',
                scale: 0.5
            }),
            text: new ol.style.Text({
                text: "G",
                font: "15px sans-serif",
                fill: new ol.style.Fill({color: "white"}),
                stroke: new ol.style.Stroke({color: color, width: 1})
            })
        })
      };
      return styles[type];
    };
    service.juninPoiFeatureStyle = function(color, text){
        var style = [new ol.style.Style({
            image: new ol.style.Circle({
                radius: 12,
                stroke: new ol.style.Stroke({
                    color: color
                }),
                fill: new ol.style.Fill({
                    color: color
                })
            }),
            text: new ol.style.Text({
                text: text,
                font: "15px sans-serif",
                fill: new ol.style.Fill({color: "white"}),
                stroke: new ol.style.Stroke({color: color, width: 1})
            })
        })];
        return style;
    };
    service.barPoiFeatureStyle = function(img){
        var style = [new ol.style.Style({
            image: new ol.style.Icon({
                anchor: [0.5, 0.5],
                anchorXUnits: 'fraction',
                anchorYUnits: 'fraction',
                src: 'img/poi-beer.png',
                scale: 0.25
            })
        })];
        return style;
    };
    service.nepalPoiFeatureStyle = function(color){
        var style = null;
        style = [new ol.style.Style({
            image: new ol.style.Circle({
                radius: 5,
                stroke: new ol.style.Stroke({
                    color: color
                }),
                fill: new ol.style.Fill({
                    color: color
                })
            }),
            text: new ol.style.Text({
                fill: new ol.style.Fill({
                    color: '#fff'
                })
            })
        })];
        return style;
    };
    service.geoJsonToFeature = function(geojson, projectionfrom, projectionto) {
        var feature = new ol.format.GeoJSON().readFeature(geojson, {
            featureProjection: projectionto,
            dataProjection: projectionfrom
        });
        return feature;
    };
    service.calculateTiles = function(geometry, zooms) {
        var zoomArray = zooms;
        var limits = {
            min_zoom: undefined,
            max_zoom: undefined
        };
        var array = [];
        var zoomArrayLen = zoomArray.length;
        for (var i = 0; i < zoomArrayLen; i++) {
            limits.max_zoom = zoomArray[i];
            limits.min_zoom = limits.max_zoom;
            array = array.concat(tilecover.tiles(geometry, limits));
        }
        return array;
    };
    return service;
});
