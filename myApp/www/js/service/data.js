app.factory('DataService', function() {
    var service = {};
    var all = {
        id: undefined,
        info: {},
        flightpath: {
            bp: undefined
        },
        fieldtripguides: [],
        fieldtripguidesall: [],
        feature: {
            gd: {
                macro: {},
                ocean: {},
                fieldtripguide: []
            },
            poi: {
                neotoma: [],
                wiki: [],
                pbdb: [],
                lac: [],
                junin: [],
                nepgpx: [],
                neplogger: [],
                nepinreach: []
            },
            marker: []
        },
        article: {
            wikiarticle: undefined
        },
        tile: {

        },
        tiles: [],
        tilenumber: undefined,
        tiletype: []
    };

    service.set = function(str, value) {
        switch (str) {
            case 'id':
                {
                    all.id = value;
                };
                break;
            case 'fieldtripguides': 
                {
                    all.fieldtripguides = value;
                };
                break;
            case 'fieldtripguidesall':{
                    all.fieldtripguidesall = value;
                };
                break;
            case 'info':
                {
                    all.info = value;
                };
                break;
            case 'marker':
                {
                    all.feature.marker = value;
                };
                break;
            case 'fieldtripguide':{
                    all.feature.gd.fieldtripguide = value;
                };
                break;
            case 'macro':
                {
                    all.feature.gd.macro = value;
                };
                break;
            case 'tiletype':
                {
                    if (!value) {
                        all.tiletype = [];
                    } else {
                        all.tiletype = value;
                    }
                };
                break;
            case 'neotoma':
                {
                    if (!value) {
                        all.feature.poi.neotoma = [];
                    } else {
                        all.feature.poi.neotoma = value;
                    }
                };
                break;
            case 'ocean':
                {
                    if (!value) {
                        all.feature.gd.ocean = [];
                    } else {
                        all.feature.gd.ocean = value;
                    }
                };
                break;
            case 'wiki':
                {
                    if (!value) {
                        all.feature.poi.wiki = [];
                    } else {
                        all.feature.poi.wiki = value;
                    }
                };
                break;
            case 'lac':
                {
                    if (!value) {
                        all.feature.poi.lac = [];
                    } else {
                        all.feature.poi.lac = value;
                    }
                };
                break;
            case 'pbdb':
                {
                    if (!value) {
                        all.feature.poi.pbdb = [];
                    } else {
                        all.feature.poi.pbdb = value;
                    }
                };
                break;
            case 'junin':
                {
                    if (!value) {
                        all.feature.poi.junin = [];
                    } else {
                        all.feature.poi.junin = value;
                    }
                };
                break;
            case 'nepgpx':
                {
                    if (!value) {
                        all.feature.poi.nepgpx = [];
                    } else {
                        all.feature.poi.nepgpx = value;
                    }
                };
                break;
            case 'nepinreach':
                {
                    if (!value) {
                        all.feature.poi.nepinreach = [];
                    } else {
                        all.feature.poi.nepinreach = value;
                    }
                };
                break;
            case 'neplogger':
                {
                    if (!value) {
                        all.feature.poi.neplogger = [];
                    } else {
                        all.feature.poi.neplogger = value;
                    }
                };
                break;
            case 'article.wikiarticle':
                {
                    if (!value) {
                        all.article.wikiarticle = undefined;
                    } else {
                        all.article.wikiarticle = value;
                    }
                };
                break;
            case 'tiles':
                {
                    all.tiles = value;
                    all.tilenumber = all.tiles.length;
                };
                break;
            case 'bp':
                {
                    all.flightpath.bp = value;
                };
                break;
        }
    };
    service.get = function(str) {
        switch (str) {
            case 'id':
                {
                    return all.id;
                };
                break;
            case 'fieldtripguides': 
                {
                    return all.fieldtripguides;
                };
                break;
            case 'fieldtripguidesall':{
                    return all.fieldtripguidesall;
                };
                break;
            case 'ocean':
                {
                    return all.feature.gd.ocean;
                };
                break;
            case 'info':
                {
                    return all.info;
                };
                break;
            case 'marker':
                {
                    return all.feature.marker;
                };
                break;
            case 'fieldtripguide':{
                    return all.feature.gd.fieldtripguide;
                };
                break;
            case 'macro':
                {
                    return all.feature.gd.macro;
                };
                break;
            case 'tiletype':
                {
                    return all.tiletype;
                };
                break;
            case 'neotoma':
                {
                    return all.feature.poi.neotoma;
                };
                break;
            case 'wiki':
                {
                    return all.feature.poi.wiki;
                };
                break;
            case 'lac':
                {
                    return all.feature.poi.lac;
                };
                break;
            case 'pbdb':
                {
                    return all.feature.poi.pbdb;
                };
                break;
            case 'junin':
                {
                    return all.feature.poi.junin;
                };
                break;
            case 'nepgpx':
                {
                    return all.feature.poi.nepgpx;
                };
                break;
            case 'nepinreach':
                {
                    return all.feature.poi.nepinreach;
                };
                break;
            case 'neplogger':
                {
                    return all.feature.poi.neplogger;
                };
                break;
            case 'article.wikiarticle':
                {
                    return all.article.wikiarticle;
                };
                break;
            case 'tiles':
                {
                    return all.tiles;
                };
                break;
            case 'tilenumber':
                {
                    return all.tilenumber;
                };
                break;
            case 'bp':
                {
                    return all.flightpath.bp;
                };
                break;
        }
    };
    service.reset = function(str) {
        switch (str) {
            case 'id':
                {
                    all.id = undefined;
                };
                break;
            case 'fieldtripguides': 
                {
                    all.fieldtripguides = [];
                };
                break;
            case 'fieldtripguidesall':{
                    all.fieldtripguidesall = [];
                };
                break;
            case 'info':
                {
                    all.info = {};
                };
                break;
            case 'ocean':
                {
                    all.feature.gd.ocean = [];
                };
                break;
            case 'marker':
                {
                    all.feature.marker = [];
                };
                break;
            case 'fieldtripguide':{
                    all.feature.gd.fieldtripguide = [];
                };
                break;
            case 'macro':
                {
                    all.feature.gd.macro = {};
                };
                break;
            case 'tiletype':
                {
                    all.tiletype = [];
                };
                break;
            case 'neotoma':
                {
                    all.feature.poi.neotoma = [];
                };
                break;
            case 'wiki':
                {
                    all.feature.poi.wiki = [];
                };
                break;
            case 'lac':
                {
                    all.feature.poi.lac = [];
                };
                break;
            case 'pbdb':
                {
                    all.feature.poi.pbdb = [];
                };
                break;
            case 'junin':
                {
                    all.feature.poi.junin = [];
                };
                break;
            case 'nepgpx':
                {
                    all.feature.poi.nepgpx = [];
                };
                break;
            case 'nepinreach':
                {
                    all.feature.poi.nepinreach = [];
                };
                break;
            case 'neplogger':
                {
                    all.feature.poi.nepinreach = [];
                };
                break;
            case 'article.wikiarticle':
                {
                    all.article.wikiarticle = undefined;
                };
                break;
            case 'tiles':
                {
                    all.tiles = [];
                    all.tilenumber = undefined;
                };
                break;
            case 'bp':
                {
                    all.flightpath.bp = undefined;
                };
                break;
        }
    };

    service.resetAll = function() {
        all.id = undefined;
        all.info = {};
        all.tiletype = [];
        all.fieldtripguides = [];
        all.feature.gd.fieldtripguide=[];
        all.feature.gd.macro = {};
        all.feature.poi.neotoma = [];
        all.feature.poi.wiki = [];
        all.feature.poi.pbdb = [];
        all.feature.poi.lac = [];
        all.feature.poi.junin = [];
        all.feature.poi.nepgpx = [];
        all.feature.poi.nepinreach = [];
        all.feature.poi.neplogger = [];
        all.feature.marker = [];
        all.feature.gd.ocean = [];

        all.article.wikiarticle = undefined;
        all.flightpath.bp = undefined;
        all.tiles = [];
        all.tilenumber = undefined;
    };

    return service;
});