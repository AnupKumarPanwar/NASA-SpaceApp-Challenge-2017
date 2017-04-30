app.factory('TileService', ['State', 'DB', function(State, DB) {
    var service = {};
    var currentTile = "sat";
    // var currentTile = "osm";
    var tileNames = ['toner','osm','sat' /*,'terrain'*/];
    var tileDownloadNames = ['toner','osm','sat'/*,'terrain'*/];
    var preloadLevel=[2,3,4];
    var layerArray = [];

    var urlFunction = function(tileCoord, url) {
        return url.replace('{z}', tileCoord[0].toString())
                    .replace('{x}', tileCoord[1].toString())
                    .replace('{y}', (-tileCoord[2] - 1).toString())
                    .replace('{-y}', function() { var y = (1 << tileCoord[0]) + tileCoord[2]; return y.toString(); });
    };
    var buildLayer = function(maxzoom, minzoom, url, attribution, maxResolution, minResolution){
    	return new ol.layer.Tile({

            //extent: textent,
            source: new ol.source.XYZ({
                attributions: [attribution],
            	maxZoom: maxzoom,
            	minZoom: minzoom,
                tileLoadFunction: function(imageTile, src) {
                    var z = imageTile.ma[0];
                    var factor = Math.pow(2,z);
                    var x=imageTile.ma[1];
                    if(x>=0){
                        x=x%factor;
                    }else{
                        while(x<0){
                            x=x+factor;
                        }
                    }
                    var y = (-imageTile.ma[2]-1)%factor;
                    if(preloadLevel.indexOf(z)!=-1){
                        DB.load.preloadtile([x,y,z], currentTile).then(function(data){
                            if(data && data.length>0) {
                                imageTile.getImage().src = data;
                            }else{
                                if(State.isMap(6)){
                                    DB.load.tile([x,y,z], currentTile).then(function(data){
                                        if(data && data.length>0) {
                                            imageTile.getImage().src = data;
                                        }else{
                                            imageTile.getImage().src = src;
                                        }
                                    });
                                }else{
                                    imageTile.getImage().src = src;
                                }
                            }
                        });
                    }else{
                        if(State.isMap(6)){
                            DB.load.tile([x,y,z], currentTile).then(function(data){
                                if(data && data.length>0) {
                                    imageTile.getImage().src = data;
                                }else{
                                    imageTile.getImage().src = src;
                                }
                            });
                        }else{
                            imageTile.getImage().src = src;
                        }
                    }
                },
                tileUrlFunction: function(tileCoord) {
                    return urlFunction(tileCoord, url);
                }
            }),
            visible: false,
            minResolution: minResolution,
            maxResolution: maxResolution
        });
    };
    var setVisibility = function(namearray){
    	for(i = 0; i < tileNames.length; i++){
    		var tilename = tileNames[i];
            if(layerArray[i]){
    		  if( namearray.indexOf(tilename)===-1) layerArray[i].setVisible(false);
    		  else layerArray[i].setVisible(true);
            }
    	}
    };

    service.initLayers = function(){
		for(i = 0; i < tileNames.length; i++){
            var tilename = tileNames[i];
            var tilelayer = buildLayer(
                service.getMaxZoom(tilename),
                service.getMinZoom(tilename),
                service.getUrl(tilename),
                service.getAttribution(tilename),
                service.getMaxResolution(tilename),
                service.getMinResolution(tilename)
            );
            layerArray.push(tilelayer);
        }
		this.setCurrentTile(currentTile);
    };
    service.getLayers = function(){
        return layerArray;
    };
    service.setCurrentTile = function(tilename){
        //change current tile and tile visibility at the same time
        setVisibility(tilename);
        currentTile = tilename;
    };
    service.getCurrentTile = function(){
        return currentTile;
    };
    service.getCurrentUrl = function(){
        return service.getUrl(currentTile);
    };
    service.getAttribution = function(tilename){
        var html = "";
        switch(tilename){
            case tileNames[1]: {
                html = 'Openlayers|Map © <a href="http://www.esri.com/">Esri</a>, HERE, DeLorme, FAO, USGS, EPA, NPS | Esri, HERE, DeLorme, NGA, USGS';
            }; break;
            case tileNames[2]: {
                html = 'Openlayers|Map © <a href="http://www.esri.com/">Esri</a>, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community';
            }; break;
            case tileNames[0]: {
                html = 'Openlayers|Map © <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.';
            }; break;
            /*case tileNames[3]: {
                html = 'Openlayers|Map © <a href="http://www.esri.com/">Esri</a>,  Reference Data: National Geographic, Esri, DeLorme, HERE, INCREMENT P, NRCAN, METI, Land Cover Imagery: NASA Blue Marble, ESA GlobCover 2009 (Copyright notice: © ESA 2010 and UCLouvain), Protected Areas: IUCN and UNEP-WCMC (2011), The World Database on Protected Areas (WDPA) Annual Release. Cambridge, UK: UNEP-WCMC., Ocean Data: GEBCO, NOAA.';
            }; break;*/
        }
        return new ol.Attribution({ html: html  });
    };
    service.getUrl = function(tilename){
    	switch(tilename){
            case tileNames[0]: return 'http://tile.stamen.com/toner/{z}/{x}/{y}.png'; break;
            case tileNames[1]: return 'http://services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}'; break;
    		//case tileNames[1]: return 'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png'; break;
    		case tileNames[2]: return 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'; break;
            //case tileNames[3]: return 'http://services.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}'; break;
    	}
    };
    service.getMaxZoom = function(tilename){
    	switch(tilename){
            case tileNames[0]: return 16; break;
    		case tileNames[1]: return 19; break;
    		case tileNames[2]: return 16; break;
            //case tileNames[3]: return 16; break;
    	}
    };
    service.getMinZoom = function(tilename){
    	switch(tilename){
            case tileNames[0]: return 2; break;
    		case tileNames[1]: return 2; break;
    		case tileNames[2]: return 2; break;
            //case tileNames[3]: return 2; break;
    	}
    };
    service.getMaxResolution = function(tilename){
        switch(tilename){
            case tileNames[0]: return 40000; break;
            case tileNames[1]: return 40000; break;
            case tileNames[2]: return 40000; break;
            //case tileNames[3]: return 40000; break;
        }
    };
    service.getMinResolution = function(tilename){
        switch(tilename){
            case tileNames[0]: return 2; break;
            case tileNames[1]: return 2; break;
            case tileNames[2]: return 2; break;
            //case tileNames[3]: return 2; break;
        }
    };
    service.getNames = function(){
    	return tileNames;
    };
    service.getDownloadNames = function(){
        return tileDownloadNames;
    }
    service.getTileImage = function(tilename){
        switch(tilename){
            case tileNames[0]: return 'img/tileicon/tile1.png'; break;
            case tileNames[1]: return 'img/tileicon/tile2.png'; break;
            case tileNames[2]: return 'img/tileicon/tile3.png'; break;
            //case tileNames[3]: return 'img/tileicon/tile4.png'; break;
        }
    }
    service.getFullName = function(tilename){
    	switch(tilename){
            case tileNames[0]: return 'Simple'; break;
    		case tileNames[1]: return 'Terrain'; break;
    		case tileNames[2]: return 'Satellite'; break;
            //case tileNames[3]: return 'Terrain'; break;
    	}
    };
    return service;
}]);
