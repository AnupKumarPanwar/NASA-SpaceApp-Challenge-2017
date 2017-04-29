app.factory('Message', function() {
    var service = {};
    service.MODAL= {
        CONFIRM: {
            EXITAPP: {
                TITLE: "Exit Flyover Country?",
                MESSAGE: "Use your phone's home button instead of the back button if you want to keep your path loaded and location tracking on."
            },
            DELETEALL: {
                TITLE: "Delete all saved paths?",
                MESSAGE: "Are you sure?"
            }

        }
    };
    service.FAIL = {
    	TRANS:"transaction failure",
    	SAVEDATA: "save failure",
        DUPID: "duplicate id",
    	CHECKID: "check id failure",
        CHECKTILE: "check tile failure",
        NO_CHECKTILE: "no tile to check",
    	NO_SAVEDATA: "no data to save",
    	DELETEDATA: "delete failure",
    	LOADDATA: "load failure",
        REQUEST_PARAMETER: "request parameter error",
        RENDER_PARAMETER: "render parameter error",
        RENDER_NODATA: "no data to render",
        RENDER: "render error"
    };
    service.DB = {
        DELETE:{
            FAIL:{
                GEN:{
                    INFO: "delete info failed",
                    TILE: "delete tile failed",
                    POI: "delete poi failed"
                },
                ALL: "delete all failed"
            }
        },
        SAVE:{
            FAIL:{
                QUEUE: {
                    TILE: "no data in tile queue",
                    POI: "no data in poi queue",
                    INFOTILE: "no data in infotile queue",
                    INFOPOI: "no data in infopoi queue",
                    WIKIDATA: "no data in wikidata queue"
                },
                GEN: {
                    INFO: "failed to save path info",
                    MACRO: "failed to save geologic maps",
                    TILE: "failed to save basemaps",
                    INFOTILE: "failed to save basemaps",
                    INFOPOI: "failed to save info POI table",
                    POI: "failed to save POI table",
                    NEO: "failed to save Neotoma table",
                    LAC: "failed to save LacCore table",
                    WIKI: "failed to save Wikipedia table",
                    PBDB: "failed to save Paleobiology table",
                    POIDATA: "failed to save POI Data",
                    WIKIDATA: "sava wikidata fails",
                    POIWIKIDATA: "save poiwikidata fails"
                }
            }
        },
        CHECK:{
            FAIL:{
                GEN: {
                    ID: "ID check failure"
                }
            }
        },
        LOAD:{
            FAIL:{
                GEN: {
                    TILE: "map tile load failure"
                }
            }
        }
    };
    service.REQ = {
        FAIL:{
            GEN: {
                NEOTOMA: "Neotoma fossil request failure: ",
                WIKI: "Wikipedia request failure: ",
                MACRO: "Macrostrat geologic map request failure: ",
                PBDB: "Paleobiology fossil request failure: ",
                LAC: "LacCore core sample request failure:"
            },
            PARAM: {
                NEOTOMA: "Neotoma: invalid request",
                WIKI: "Wikipedia: invalid request",
                MACRO: "Macrostrat: invalid request",
                PBDB: "Paleobiology: invalid request",
                LAC: "LacCore: invalid request"
            }
        }
    };
    service.fails={
        render: function(name, errorcode){
            if(errorcode===1) return name+" render failure";
            else if(errorcode===2) return "no "+name+" data";
            else return "";
        },
        request: function(name, errorcode){
            if(errorcode===1) return name+" request failure: ";
            else if(errorcode===2) return name+": invalid request";
            else return "";
        }
    };

    service.GPS = {
        NAVIGATION:{
            ON: "Tracking enabled.",
            OFF: "Tracking disabled."
        }
    };
    service.DRAW={
        FAIL:{
            SAMECOORDS: "duplicate coordinates"
        }
    }
    service.DOWNLOAD={
        FAIL:{
            NOTILE: "Choose at least one type of tile to download.",
            INVALIDNAME: "Please enter a map name.",
            DUPNAME: "A path with this name already exists."
        }
    }
    return service;
});
