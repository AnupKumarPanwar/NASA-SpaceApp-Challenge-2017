app.factory('RequestService', function($http, $filter, $timeout, $q, TileService, Config, Message, $rootScope, State ) {
    var service = {};
    var timeout = 60000;
    var fieldtriptimeoutObj = {
        'all': undefined
    };
    var timeoutObj = {
        'macro': undefined,
        'lac': undefined,
        'wiki': undefined,
        'neotoma': undefined,
        'pbdb': undefined,
        'junin': undefined,
        'nepgpx': undefined,
        'nepinreach': undefined,
        'neplogger': undefined,
        'ocean': undefined,
        'fieldtripinpath': undefined,
        'fieldtripguide': undefined
    };
    var imgConfig = { responseType: 'arraybuffer', timeout: 8000 };
    var articleConfig = { timeout: 8000};

    service.cancel = function(){
        for(var key in timeoutObj) {
            if(timeoutObj[key])timeoutObj[key].resolve();
        }
        for(var key in fieldtriptimeoutObj) {
            if(fieldtriptimeoutObj[key])fieldtriptimeoutObj[key].resolve();
        }
    };

    $rootScope.$on("event:button", function(evt, value){
        if(value.name=="spinner"){
            service.cancel();
        }
    });


    service.queryAll = function(name, wktarray){
        var defer = $q.defer();
        if(!wktarray||wktarray.length==0) {
            defer.reject("Request Error");
        }
        var promises=[];
        for(var i=0; i<wktarray.length; i++){
            promises.push( service[name].apply(this, [wktarray[i]] ) );
        }
        $q.all(promises).then(function(d){
            var array=[];
            for(var i=0; i<d.length; i++){
                array=array.concat(d[i]);
                d[i]=undefined;
            }
            defer.resolve(array);
        },function(e){
            defer.reject(e);
        })
        return defer.promise;
    };

    service.fieldtripguide= function(id){
        var defer = $q.defer();
        timeoutObj['fieldtripguide']= $q.defer();
        var timeout = timeoutObj['fieldtripguide'];
        var url = "https://api.flyover.umn.edu/guide/fetch";
        var data = {
            ids: [id]
        };
        $http.post(url, data, {timeout: timeout.promise}).success(function(ret) {
            if(!ret){
                defer.reject("Field Trip Guide: invalid return data");
            }else{
                if(ret.length>0) {
                    var obj = ret[0];
                    obj = $filter('DataFormater')("Fieldtripguide", obj, null, null );
                    defer.resolve(obj);
                } else defer.reject("Field Trip Guide: request error");
            }
        }).error(function() {
            defer.reject("Field Trip Guide: request error");
        });
        return defer.promise;
    };

    service.fieldtripguides = function(wkt){
        var defer = $q.defer();
        timeoutObj['fieldtripinpath']= $q.defer();
        var timeout = timeoutObj['fieldtripinpath'];
        var url = "https://api.flyover.umn.edu/guide/find";
        var data = { "shape": wkt };
        $http.post(url, data, {timeout: timeout.promise}).success(function(ret) {
            if(!ret){
                defer.resolve([]);
            }else{
                defer.resolve(ret);
            }
        }).error(function() {
            defer.resolve([]);
        });
        return defer.promise;
    };
    service.fieldtripguideall = function(){
        var defer = $q.defer();
        fieldtriptimeoutObj["all"]= $q.defer();
        var timeout = fieldtriptimeoutObj["all"];
        var url = "https://api.flyover.umn.edu/guide/all";
        $http.get(url, {timeout: timeout.promise}).success(function(ret) {
             if(!ret){
                defer.resolve([]);
            }else{
                defer.resolve(ret);
            }
        }).error(function() {
            defer.reject("Field Trip Guide: request error");
        });
        return defer.promise;
    };
    service.nepgpx= function(wkt) {
        var defer = $q.defer();
        timeoutObj['nepgpx']= $q.defer();
        var timeout = timeoutObj['nepgpx'];
        if(!wkt) {
            defer.reject("nepgpx fails");
        }
        var url = "https://api.flyover.umn.edu/gpx";
        var data = {
            "shape": wkt
        };
        $http.post(url, data, {timeout: timeout.promise}).success(function(gpx) {
            if(!gpx){
                defer.reject("Nepgpx: invalid return data");
            }
            if (gpx.success === true) {
                var len = gpx.data.length;

                for (var i = 0; i < len; i++) {
                    var obj = gpx.data[i];
                    obj = $filter('DataFormater')("Nepgpx", obj, null, null );
                }
                defer.resolve(gpx.data);
            }else{
                defer.reject("Nepgpx: Invalid return data");
            }
        }).error(function() {
            defer.reject("Nepgpx: Request error");
        });
        return defer.promise;
    };
    service.nepinreach= function(wkt) {
        var defer = $q.defer();
        timeoutObj['nepinreach']= $q.defer();
        var timeout = timeoutObj['nepinreach'];
        if(!wkt) {
            defer.reject("nepinreach fails");
        }
        var url = "https://api.flyover.umn.edu/inReach";
        var data = {
            "shape": wkt
        };
        $http.post(url, data, {timeout: timeout.promise}).success(function(inreach) {
            if(!inreach){
                defer.reject("nepinreach: invalid return data");
            }
            if (inreach.success === true) {
                var len = inreach.data.length;

                for (var i = 0; i < len; i++) {
                    var obj = inreach.data[i];
                    obj = $filter('DataFormater')("Nepinreach", obj, null, null );
                }
                defer.resolve(inreach.data);
            }else{
                defer.reject("nepinreach: invalid return data");
            }
        }).error(function() {
            defer.reject("nepinreach: invalid return data");
        });
        return defer.promise;
    };
    service.neplogger= function(wkt) {
        var defer = $q.defer();
        timeoutObj['neplogger']= $q.defer();
        var timeout = timeoutObj['neplogger'];
        if(!wkt) {
            defer.reject("neplogger fails");
        }
        var url = "https://api.flyover.umn.edu/gpsLogger";
        var data = {
            "shape": wkt
        };
        $http.post(url, data, {timeout: timeout.promise}).success(function(logger) {
            if(!logger){
                defer.reject("neplogger: invalid return data");
            }
            if (logger.success === true) {
                var len = logger.data.length;

                for (var i = 0; i < len; i++) {
                    var obj = logger.data[i];
                    obj = $filter('DataFormater')("Neplogger", obj, null, null );
                }
                defer.resolve(logger.data);
            }else{
                defer.reject("neplogger: invalid return data");
            }
        }).error(function() {
            defer.reject("neplogger: invalid return data");
        });
        return defer.promise;
    };

    service.ocean= function(wkt) {
        var defer = $q.defer();
        timeoutObj['ocean']= $q.defer();
        var timeout = timeoutObj['ocean'];
        if(!wkt) {
            defer.resolve([]);
        }
        var url = ["http://opencoredata.org/api/v1/spatial/search/jrso?abstracts=true&geowithin=", wkt].join('');
        $http.get(url, {timeout: timeout.promise}).success(function(ret) {
            if (ret && ret.features) {
                defer.resolve(ret.features);
            }else{
                defer.resolve([]);
            }
        }).error(function() {
            defer.resolve([]);
        });
        return defer.promise;
    };
    service.junin = function(wkt) {
        var defer = $q.defer();
        timeoutObj['junin']= $q.defer();
        var timeout = timeoutObj['junin'];
        if(!wkt) {
            defer.reject("Invalid parameter");
        }
        var url = 'https://api.flyover.umn.edu/junin/data';
        var data = {
            "shape": wkt
        };
        $http.post(url, data, {timeout: timeout.promise}).success(function(juninret) {
            if(juninret.success && juninret.data){
                if (juninret.data.length>0) {
                    var geojson = JSON.parse(juninret.data[0].geojson);
                    defer.resolve(geojson.features);
                }else {
                    defer.resolve([]);
                }
            }else{
                defer.reject("Junin request fails" + " Not valid");
            }
        }).error(function() {
            defer.reject("Junin request fails"+" Request error");
        });
        return defer.promise;
    };

    service.macro = function(wkt) {
        var defer = $q.defer();
        timeoutObj['macro']= $q.defer();
        var timeout = timeoutObj['macro'];
        if(!wkt) {
            defer.reject("Invalid parameter");
        }

        var url = ['https://macrostrat.org/api/v2/', Config.macroMode,'?format=topojson_bare&shape=', wkt].join('');
        $http.get(url, {timeout: timeout.promise}).success(function(macroret) {
            if(!macroret || !macroret.type){
                defer.reject(Message.REQ.FAIL.GEN.MACRO + "Invalid return data");
            } else {
                if (macroret.type === "FeatureCollection") {
                    if(macroret.features && (macroret.features instanceof Array)){
                        defer.resolve(macroret.features);
                    }else{
                        defer.reject(Message.REQ.FAIL.GEN.MACRO + " Not Geojson");
                    }
                } else if (macroret.type === "Topology"){
                    var geojson = topojson.feature(macroret, macroret.objects.output);
                    if(geojson.features && (geojson.features instanceof Array)){
                        if(geojson.features.length==0){
                            if(State.isTrip(false)){
                                State.setTrip(true);
                                url = ['https://macrostrat.org/api/v2/', Config.macroMode,'?format=topojson_bare&shape=', wkt].join('');
                                $http.get(url, {timeout: timeout.promise}).success(function(macroret) {
                                    if (macroret.type === "Topology"){
                                        var geojson = topojson.feature(macroret, macroret.objects.output);
                                        if(geojson.features && (geojson.features instanceof Array)){
                                            defer.resolve(geojson.features);
                                        }else{
                                            defer.reject(Message.REQ.FAIL.GEN.MACRO + " Not valid");
                                        }
                                    }else{
                                        defer.reject(Message.REQ.FAIL.GEN.MACRO + " Not Topojson");
                                    }
                                });
                            }else{
                                defer.resolve(geojson.features);
                            }
                        }else{
                            defer.resolve(geojson.features);
                        }
                    }else{
                        defer.reject(Message.REQ.FAIL.GEN.MACRO + " Not Topojson");
                    }
                } else {
                    defer.reject(Message.REQ.FAIL.GEN.MACRO + " Not valid");
                }
            }
        }).error(function() {
            defer.reject(Message.REQ.FAIL.GEN.MACRO+" Request error");
        });
        return defer.promise;
    };

    service.lac = function(wkt){
        var defer = $q.defer();
        timeoutObj['lac']= $q.defer();
        var timeout = timeoutObj['lac'];
        if(!wkt) {
            defer.reject(Message.REQ.FAIL.PARAM.LAC);
        }
        var url = "https://api.flyover.umn.edu/laccoreSample";
        var data = {
            "shape": wkt,
            "facilities": Config.lacFacilities
        };
        $http.post(url, data, {timeout: timeout.promise}).success(function(lacret) {
            if(!lacret){
                defer.reject(Message.REQ.FAIL.GEN.LAC+ "Invalid return data");
            }
            if (lacret.success === true) {
                var len = lacret.data.length;

                for (var i = 0; i < len; i++) {
                    var obj = lacret.data[i];
                    obj = $filter('DataFormater')("Laccore", obj, null, null );
                }
                defer.resolve(lacret.data);
            }else{
                defer.reject(Message.REQ.FAIL.GEN.LAC+" Invalid return data");
            }
        }).error(function() {
            defer.reject(Message.REQ.FAIL.GEN.LAC+" Request error");
        });
        return defer.promise;
    };
    service.wiki = function(wkt) {
        var defer = $q.defer();
        timeoutObj['wiki']= $q.defer();
        var timeout = timeoutObj['wiki'];
        if(!wkt) {
            defer.reject(Message.REQ.FAIL.PARAM.WIKI);
        }
        var url = "https://api.flyover.umn.edu/wiki";
        var data = {
            "shape": wkt,
            "types": Config.wikiTypeArray,
            "dim": [100, 100000]
        };
        $http.post(url, data, {timeout: timeout.promise}).success(function(wikiret) {
            if(!wikiret){
                defer.reject(Message.REQ.FAIL.GEN.WIKI+ "Invalid return data");
            }
            if (wikiret.success === true) {
                var len = wikiret.data.length;
                for (var i = 0; i < len; i++) {
                    var obj = wikiret.data[i];
                    var name = obj.pageTitle.replace(/_/g," ");
                    var title = obj.pageTitle;
                    obj = $filter('DataFormater')("Wikipedia", obj, name, title );
                }
                defer.resolve(wikiret.data);
            }else{
                defer.reject(Message.REQ.FAIL.GEN.WIKI+" Invalid return data");
            }
        }).error(function() {
            defer.reject(Message.REQ.FAIL.GEN.WIKI+" Request error");
        });
        return defer.promise;
    };

    service.neotoma= function(wkt){
        var defer = $q.defer();
        timeoutObj['neotoma'] = $q.defer();
        var timeout = timeoutObj['neotoma'];
        var taxonIDs = Config.newNeoTaxonIDs.join(",");

        var url = ['http://api.neotomadb.org/v1/data/occurrences?taxonids=',taxonIDs,'&wkt=', wkt, '&callback=JSON_CALLBACK'].join('');
        $http.jsonp(url, {timeout: timeout.promise}).success(function(neoret) {
            if(!neoret){
                defer.reject(Message.REQ.FAIL.GEN.NEOTOMA+ "Invalid return data");
            }
            if (neoret.success === 1) {
                var len = neoret.data.length;
                for (var i = 0; i < len; i++) {
                    var obj = neoret.data[i];
                    var id = obj.TaxonID;
                    var taxonName = Config.newNeoTaxons[id].name;
                    var taxonImg = Config.newNeoTaxons[id].img;
                    obj = $filter('DataFormater')("Neotoma", obj, taxonName, taxonName, taxonImg);
                }
                defer.resolve(neoret.data);
            }else{
                defer.reject(Message.REQ.FAIL.GEN.NEOTOMA+" Invalid return data");
            }
        }).error(function() {
            defer.reject(Message.REQ.FAIL.GEN.NEOTOMA+" Request error");
        });

        return defer.promise;
    };

    service.getImage = function(index, url){
        var defer= $q.defer();
        $http.get(url, imgConfig).success(function(ret) {
            var value = $filter("Base64Filter")(ret);
            defer.resolve( {index: index, value: value} );
        }).error(function(e) {
            defer.resolve(undefined);
        });
        return defer.promise;
    };
    service.pbdb = function(wkt) {
        var defer = $q.defer();
        timeoutObj['pbdb']= $q.defer();
        var timeout = timeoutObj['pbdb'];
        if(!wkt) {
            defer.reject(Message.REQ.FAIL.PARAM.PBDB);
        }

        var url = ["https://paleobiodb.org/data1.2/occs/list.json?base_name=",Config.pbdbBaseName,"&show=lag,eag,oid,tna,img,coords&loc=",wkt].join('');
        $http.get(url, {timeout: timeout.promise}).success(function(pbdbret) {
            if(!pbdbret){
                defer.reject(Message.REQ.FAIL.GEN.PBDB+ "Invalid return data");
            }
            if(pbdbret.errors){
                defer.reject(Message.REQ.FAIL.GEN.PBDB);
            }else{
                if(pbdbret.records){
                    var len = pbdbret.records.length;
                    for(var i = 0; i < len; i++){
                        var obj = pbdbret.records[i];
                        var name = obj.tna;
                        var title = obj.tna.replace(/\s+/g, "_");
                        var img = obj.img;
                        obj = $filter('DataFormater')("PBDB", obj, name, title, img);
                    }
                    defer.resolve(pbdbret.records);
                }else{
                    defer.reject(Message.REQ.FAIL.GEN.PBDB+" Invalid return data");
                }
            }
        }).error(function() {
            defer.reject(Message.REQ.FAIL.GEN.PBDB+" Request error");
        });
        return defer.promise;
    };

    //---------------------for download--------------
    service.tile = function(tileindexes) {
        var defer = $q.defer();
        var url = TileService.getUrl(tileindexes[3]);
        url = url.replace('{z}', tileindexes[2].toString())
            .replace('{x}', tileindexes[0].toString())
            .replace('{y}', tileindexes[1].toString());

        $http.get(url, imgConfig).success(function(tileret) {
            var value = $filter("Base64Filter")(tileret);
            if(value==null) {
                defer.resolve( {success: false, key:tileindexes} );
            } else {
                defer.resolve( {success:true, key:tileindexes, value:value } );
            }
        }).error(function(e) {
            defer.resolve( {success:false, key:tileindexes} );
        });
        return defer.promise;
    };
    service.wikiarticle = function(title) {
        var defer = $q.defer();
        //if wikidata doesn't exist, then download
        var url = ["https://en.m.wikipedia.org/w/api.php?action=query&titles=",title,"&prop=extracts&redirects=1&format=json&callback=JSON_CALLBACK"].join('');
        $http.jsonp(url, articleConfig ).success(function(data) {
            var theHTML = "Cannot query this page";
            var htmlTitle = "Error";
            if(data.query){
                if(data.query.pages){
                    for(var key in data.query.pages){
                        if(data.query.pages[key].extract){
                            if(data.query.pages[key].title){
                                htmlTitle = data.query.pages[key].title;
                            }else{
                                htmlTitle = title;
                            }
                            theHTML=data.query.pages[key].extract;
                            theHTML = $filter('HyperlinkFilter')(theHTML);
                            defer.resolve({ success:true, key:title, value:{title:htmlTitle, html:theHTML} });
                        }
                    }
                }
            }
            defer.resolve({ success:true, key:title, value:{title: htmlTitle, html:["<p>",theHTML,"</p>"].join('')} });
        }).error(function(e) {
            defer.resolve( { success:false, key:title } );
        });
        return defer.promise;
    };

    return service;
});
