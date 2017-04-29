app.factory('Config', function() {
    var service = {};

    var CENTER = [-93.248177, 44.887012];
    var FLIGHTBUFFER = 200;
    var CARBUFFER = 20;
    var FLIGHTCODE = "carto/small";
    var CARCODE = "geologic_units/gmus";
    var FLIGHTZOOMS = [2,3,4,5,6,7,8,9,10];
    var CARZOOMS = [2,3,4,5,6,7,8,9,10,11,12,13];

    service.TileLevel={
        preload: [2,3,4]
    }
    service.CRS = 'EPSG:4326';
    service.WMS = 'EPSG:3857';

    service.mapProjection = service.WMS;
    service.mapCenter = ol.proj.transform(CENTER, service.CRS, service.mapProjection);
    service.minZoom = 2;
    service.maxZoom = 16;
    service.curZoom = 3;
    service.navValue = 0;

    //request settings:
    service.neoTaxons = [
        { name: 'Mammoth', id:[6172, 6847, 7495, 7682, 7680, 7681, 6174, 6180, 6176, 6177, 6178, 6179], img: 1672},
        { name: 'Castoroides', id:[5932], img: 1247},
        { name: 'American_lion', id:[6746], img: 951},
        { name: 'Dire_wolf', id: [5912], img: 1305},
        { name: 'Smilodon', id: [6509], img: 182},
        { name: 'Euceratherium', id:[7430], img: 2096},
        { name: 'Stag-moose', id:[5933], img: 396},
        { name: 'Nothrotheriops', id:[6309], img: 1619},
        { name: 'Dasypus_bellus', id:[5966], img: 1234},
        { name: 'Mastodon', id:[6172], img: 1187}
    ];
    service.newNeoTaxonIDs=[6172, 6847, 7495, 7682, 7680, 7681, 6174, 6180, 6176, 6177, 6178, 6179, 5932, 6746, 5912, 6509, 7430, 5933, 6309, 5966];
    service.newNeoTaxons = {
        "6172": {name: 'Mammoth', img: 1672 },
        "6847": {name: 'Mammoth', img: 1672 },
        "7495": {name: 'Mammoth', img: 1672 },
        "7682": {name: 'Mammoth', img: 1672 },
        "7680": {name: 'Mammoth', img: 1672 },
        "7681": {name: 'Mammoth', img: 1672 },
        "6174": {name: 'Mammoth', img: 1672 },
        "6180": {name: 'Mammoth', img: 1672 },
        "6176": {name: 'Mammoth', img: 1672 },
        "6177": {name: 'Mammoth', img: 1672 },
        "6178": {name: 'Mammoth', img: 1672 },
        "6179": {name: 'Mammoth', img: 1672 },
        "5932": {name: 'Castoroides', img: 1247},
        "6746": {name: 'American_lion', img: 951},
        "5912": {name: 'Dire_wolf', img: 1305},
        "6509": {name: 'Smilodon', img: 182},
        "7430": {name: 'Euceratherium', img: 2096},
        "5933": {name: 'Stag-moose', img: 396},
        "6309": {name: 'Nothrotheriops', img: 1619},
        "5966": {name: 'Dasypus_bellus', img: 1234},
        "6172": {name: 'Mastodon', img: 1187}
    };

    service.fieldModal = undefined;
    service.fieldtripName = undefined;
    //gps settings:
    service.gpsOption = { maximumAge: 0, enableHighAccuracy: true, timeout: 6000 };
    service.layerOrder = [];
    service.infoNames = [
        {   name: "marker",
            type:0,  //type 0 = marker
            fullname: "My POI",
            request: { type: 2},
            popup: {title: "My Points of Interest", disabled: true},
            layerbox: {icon:'img/star.png', checked: false, disabled: true}
        },
        {   name: "macro",
            type:1, //type 1 = gd data
            fullname:"Geologic maps",
            popup: {title: "Geologic Data (Macrostrat.org)", disabled: true},
            request: {paramtype: 'bp', type:1 },
            layerbox: {icon:'img/gd-macro.png', checked: false, disabled: true},
            download: {disabled: true, title: "Geologic Maps" }
        },
        {   name: "ocean",
            type:2,
            fullname: "Ocean core samples",
            popup: {title: "Ocean Core Samples (OpenCoreData.org)", disabled: true},
            request: { paramtype: 'bp', type:1 },
            render: {
                coords: function(item){ return [item.lon, item.lat]; },
                color: "#a6cc80",
                text: "O"
            },
            layerbox: {icon:"img/poi-ocean.png", checked: false, disabled: true},
            download: {disabled: true, title: "Ocean Core Samples" }
        },
        {   name: "lac",
            type:2, //poi
            fullname: "Lake core samples",
            popup: {title: "Lake Core Samples (LacCore.org)", disabled: true},
            request: { paramtype: 'bp', type:1 },
            render: {
                coords: function(item){ return [item.longitude, item.latitude]; },
                color: "#0281e2",
                text: "L"
            },
            layerbox: {icon:"img/poi-lac.png", checked: false, disabled: true},
            download: {disabled: true, title: "Lake Core Samples" }
        },
        {   name: "neotoma",
            type:2, //type 2 = poi data
            fullname: "Mammal fossils",
            popup: {title: "Mammal Fossils (NeotomaDB.org)", disabled: true},
            request: { paramtype: 'bp', type:1 },
            render: {

                coords: function(item){ return [item.LongitudeEast, item.LatitudeNorth]; },
                color: "#89806a",
                text: "N"
            },
            layerbox: { icon:"img/poi-neo.png", checked: false, disabled: true},
            download: { disabled: true, title: "Mammal Fossils" }
        },
        {   name: "pbdb",
            type:2,
            fullname:"Dinosaur fossils",
            popup: {title: "Dinosaur Fossils (PaleoBioDB.org)", disabled: true},
            request: { paramtype: 'bp', type:1 },
            render: {
                coords: function(item){ return [item.lng, item.lat]; },
                color: "#00a0a0",
                text: "P"
            },
            layerbox: {icon:"img/poi-pbdb.png", checked: false, disabled: true },
            download: { disabled: true, title: "Dinosaur Fossils" }
        },
        {   name: "wiki",
            type:2,
            fullname:"Landscape features",
            popup: {title: "Landscape Features (Wikipedia.org)", disabled: true},
            request: { paramtype: 'bp', type:1 },
            render: {
                coords: function(item){ return [item.lon, item.lat]; },
                color: "#000000",
                text: "W"
            },
            layerbox: { icon:"img/poi-wiki.png", checked: false, disabled: true },
            download: { disabled: true, title: "Wikipedia articles" }
        },
        {   name: "junin",
            type:3,
            fullname: "Junín",
            popup: {title: "Proyecto Lago Junín", disabled: true},
            request: { paramtype: 'bp', type:1 },
            render: {
                color: "#ff0000",
                text: "J"
            },
            layerbox: { icon:"img/poi-junin.png", checked: false, disabled: true },
            download: { disabled: true, title: "Proyecto Lago Junín Tour" }
        },
        {   name: "nepgpx",
            type:4,
            fullname: "Ulyana's path",
            popup: {title: "Ulyana's Location", disabled: true},
            request: { paramtype: 'bp', type:1 },
            render: {
                coords: function(item){
                 return [item.longitude, item.latitude]; },
                color: "#0000ff",
                text: "Ulyana"
            },
            layerbox: {icon: "img/poi-nepgpx.png", checked: false, disabled: true},
            download: { disabled: true, title: "Nepal GPX data" }
        },
        {   name: "neplogger",
            type:4,
            fullname: "Patrick's path",
            popup: {title: "Patrick's Location", disabled: true},
            request: { paramtype: 'bp', type:1 },
            render: {
                coords: function(item){ return [item.longitude, item.latitude]; },
                color: "#00ff00",
                text: "Patrick"
            },
            layerbox: {icon: "img/poi-neplogger.png", checked: false, disabled: true},
            download: { disabled: true, title: "Nepal Logger data" }
        },
        {   name: "nepinreach",
            type:4,
            fullname: "Ulyana's messages",
            popup: {title: "Ulyana's Messages", disabled: true},
            request: { paramtype: 'bp', type:1 },
            render: {
                coords: function(item){ return [item.longitude, item.latitude]; },
                color: "#ff0000",
                text: ""
            },
            layerbox: {icon: "img/poi-nepinreach.png", checked: false, disabled: true},
            download: { disabled: true, title: "Sherpa Science data" }
        },
        {
            name: "fieldtripguide",
            type:5, //type 1 = gd data
            fullname:"Field trip guide",
            popup: {title: "Field Trip Guide", disabled: true},
            request: {paramtype: 'bp', type:1 },
            layerbox: {icon:'img/stop.png', checked: false, disabled: true},
            download: {disabled: true, title: "Field Trip Guide"}
        }
    ];
    service.isLoad = false;
    service.lacFacilities = ['laccore'];
    //request settings:
    service.neoTaxonNames = [
        {name: 'Mammoth', param: '*mammuthus*', img: 1672},
        {name: 'Castoroides', param: '*castoroides*', img: 1247},
        {name: 'American_lion', param: '*panthera*leo*', img: 951},
        {name: 'Dire_wolf', param: '*canis*dirus*', img: 1305},
        {name: 'Smilodon', param: '*smilodon*', img: 182},
        {name: 'Euceratherium', param: '*eucera*', img: 2096},
        {name: 'Stag-moose', param: '*cervalces*scotti*', img: 396},
        {name: 'Nothrotheriops', param: '*nothrotheriops*shastensis*', img: 1619},
        {name: 'Dasypus_bellus', param: '*dasypus*bellus*', img: 1234},
        {name: 'Mastodon', param: 'Mammut americanum', img: 1187}
    ];
    service.wikiTypeArray = ['waterbody', 'mountain', 'earthquake', 'isle', 'river', 'glacier', 'forest', 'pass', 'park', 'bay', 'monument', 'reserve', 'mine', 'lava', 'cave'];
    service.pbdbBaseName = "dinosauria^aves";

    service.macroMode = undefined;
    service.bufferSize = undefined;
    service.downloadZooms = undefined;
    service.navPercentage = 0;

    service.setTripMode = function(mode){
        if(mode===false){
            service.macroMode = CARCODE;
            service.bufferSize = CARBUFFER;
            service.downloadZooms = CARZOOMS;
        }else{
            service.macroMode = FLIGHTCODE;
            service.bufferSize = FLIGHTBUFFER;
            service.downloadZooms = FLIGHTZOOMS;
        }
    };

    service.currentDB = undefined;
    service.setCurrentDB = function(value){
        service.currentDB=value;
    };
    service.isCurrentDB = function(value) {
        if (service.currentDB === value) return true;
        else return false;
    };
    return service;
});
