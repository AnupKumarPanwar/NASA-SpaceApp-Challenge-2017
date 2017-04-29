app.filter('CoordsFilter', function(){
	return function (item) {
		
		feature = new ol.Feature(new ol.geom.Point(ol.proj.transform([item.lon, item.lat], Config.CRS, Config.mapProjection)));
        feature.setProperties(item);
        
        return layer;
    }
});
