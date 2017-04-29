app.factory('DB', ['$q', 'Message', 'DataService', 'Config', function($q, Message, DataService, Config) {
    var service = {};
    service.handler = undefined;

    var str2Obj = function(str) {
        if (!str || str.length === 0) return {};
        return JSON.parse(str);
    };
    var obj2Str = function(obj) {
        if (!obj) return '';
        return JSON.stringify(obj);
    };

    service.start = function(){
        service.handler = window.sqlitePlugin.openDatabase({ name: "foc.db", iosDatabaseLocation: 'default', createFromLocation: 1});
        service.handler.transaction(function(tx) {
            tx.executeSql('CREATE TABLE IF NOT EXISTS Usermarker (u_lng TEXT, u_lat TEXT, u_content TEXT, PRIMARY KEY(u_lng, u_lat) )');
            tx.executeSql('CREATE TABLE IF NOT EXISTS Info      (info_id TEXT PRIMARY KEY, info_content TEXT)');
            tx.executeSql('CREATE TABLE IF NOT EXISTS Macro     (macro_info_id TEXT PRIMARY KEY, macro_content TEXT, FOREIGN KEY (macro_info_id) REFERENCES Info (info_id) ON DELETE CASCADE )');
            tx.executeSql('CREATE TABLE IF NOT EXISTS Ocean     (ocean_info_id TEXT PRIMARY KEY, ocean_content TEXT, FOREIGN KEY (ocean_info_id) REFERENCES Info (info_id) ON DELETE CASCADE )');

            tx.executeSql('CREATE TABLE IF NOT EXISTS Tile      (tile_z INTEGER, tile_x INTEGER, tile_y INTEGER, tile_type_id TEXT, tile_content TEXT, PRIMARY KEY(tile_z, tile_x, tile_y, tile_type_id) )');
            tx.executeSql('CREATE TABLE IF NOT EXISTS Info_tile (it_info_id TEXT, it_tile_z INTEGER, it_tile_x INTEGER, it_tile_y INTEGER, it_tile_type_id TEXT, PRIMARY KEY(it_info_id, it_tile_z, it_tile_x, it_tile_y, it_tile_type_id), FOREIGN KEY (it_info_id) REFERENCES Info(info_id) ON DELETE CASCADE )');
            tx.executeSql('CREATE TABLE IF NOT EXISTS Laccore   (lac_poi_id INTEGER PRIMARY KEY, lac_sample TEXT, FOREIGN KEY (lac_poi_id) REFERENCES Poi (poi_id) ON DELETE CASCADE  )');
            tx.executeSql('CREATE TABLE IF NOT EXISTS Neotoma   (neo_poi_id INTEGER PRIMARY KEY, neo_taxonname TEXT, neo_siteid INTEGER, neo_unitid INTEGER, FOREIGN KEY (neo_poi_id) REFERENCES Poi (poi_id) ON DELETE CASCADE )');
            tx.executeSql('CREATE TABLE IF NOT EXISTS Wikipedia (wiki_poi_id INTEGER PRIMARY KEY, wiki_id TEXT, FOREIGN KEY (wiki_poi_id) REFERENCES Poi (poi_id) ON DELETE CASCADE )');
            tx.executeSql('CREATE TABLE IF NOT EXISTS Pbdb      (pbdb_poi_id INTEGER PRIMARY KEY, pbdb_id TEXT, FOREIGN KEY (pbdb_poi_id) REFERENCES Poi (poi_id) ON DELETE CASCADE )');
            tx.executeSql('CREATE TABLE IF NOT EXISTS Poi       (poi_id INTEGER PRIMARY KEY, poi_type TEXT, poi_content TEXT )');
            tx.executeSql('CREATE TABLE IF NOT EXISTS Wikidata  (wikidata_title TEXT PRIMARY KEY, wikidata_content TEXT )');
            tx.executeSql('CREATE TABLE IF NOT EXISTS Poi_wikidata  (pw_poi_id INTEGER, pw_wikidata_title TEXT, PRIMARY KEY (pw_poi_id, pw_wikidata_title), FOREIGN KEY (pw_poi_id) REFERENCES Poi (poi_id) ON DELETE CASCADE )');
            tx.executeSql('CREATE TABLE IF NOT EXISTS Info_poi  (ip_info_id INTEGER, ip_poi_id INTEGER, PRIMARY KEY(ip_info_id, ip_poi_id), FOREIGN KEY (ip_info_id) REFERENCES Info(info_id) ON DELETE CASCADE )');
            tx.executeSql('CREATE TABLE IF NOT EXISTS Junin  (junin_info_id TEXT PRIMARY KEY, junin_content TEXT, FOREIGN KEY (junin_info_id) REFERENCES Info(info_id) ON DELETE CASCADE )');

            tx.executeSql('CREATE TABLE IF NOT EXISTS Nepgpx  (ng_poi_id INTEGER PRIMARY KEY, ng_id TEXT, FOREIGN KEY (ng_poi_id) REFERENCES Poi (poi_id) ON DELETE CASCADE  )');
            tx.executeSql('CREATE TABLE IF NOT EXISTS Neplogger  (nl_poi_id INTEGER PRIMARY KEY, nl_id TEXT, FOREIGN KEY (nl_poi_id) REFERENCES Poi (poi_id) ON DELETE CASCADE  )');
            tx.executeSql('CREATE TABLE IF NOT EXISTS Nepinreach  (nir_poi_id INTEGER PRIMARY KEY, nir_id TEXT, FOREIGN KEY (nir_poi_id) REFERENCES Poi (poi_id) ON DELETE CASCADE  )');
            tx.executeSql('CREATE TABLE IF NOT EXISTS Fieldtrip  (field_info_id TEXT, field_order INTEGER, field_content TEXT, PRIMARY KEY(field_info_id, field_order), FOREIGN KEY (field_info_id) REFERENCES Info (info_id) ON DELETE CASCADE )');
        });
        service.handler.executeSql("PRAGMA foreign_keys = 1;", []);
        Config.setCurrentDB(1);
    };

    service.checkID = function() {
        var defer = $q.defer();
        var info_id = DataService.get('id');
        service.handler.transaction(function(tx) {
            tx.executeSql('SELECT * FROM Info WHERE info_id=(?)', [info_id], function(tx, res) {
                if (res.rows.length === 0) {
                    defer.resolve();
                } else defer.reject(Message.DB.CHECK.FAIL.GEN.ID);
            });
        });
        return defer.promise;
    };
    service.save = {
        marker: function(coords, obj){
            var defer = $q.defer();
            var u_lng=coords[0];
            var u_lat=coords[1];
            var u_content = obj2Str(obj);
            if(Config.isCurrentDB(1)){
                service.handler.transaction(function(tx){
                    tx.executeSql('SELECT * FROM Usermarker WHERE u_lng=(?) AND u_lat=(?)', [u_lng, u_lat], function(tx, res) {
                        if (res.rows.length === 0) {
                            tx.executeSql("INSERT INTO Usermarker VALUES (?,?,?)", [u_lng, u_lat, u_content], function(tx, res) {
                                if (res.rowsAffected > 0) {
                                    defer.resolve();
                                } else {
                                    defer.reject(null);
                                }
                            });
                        } else defer.reject(null);
                    });
                });
            }else defer.reject(null);
            return defer.promise;
        },
        info: function(tx) {
            //SAVE TO INFO
            var defer = $q.defer();
            var info_id = DataService.get('id');
            var info_content = obj2Str(DataService.get('info'));
            tx.executeSql("INSERT INTO Info VALUES (?,?)", [info_id, info_content], function(tx, res) {
                if (res.rowsAffected > 0) {
                    defer.resolve();
                } else {
                    defer.reject(Message.DB.SAVE.FAIL.GEN.INFO);
                }
            });
            return defer.promise;
        },
        macro: function(tx) {
            var defer = $q.defer();
            var macro_info_id = DataService.get('id');
            var macro_content = obj2Str(DataService.get('macro'));

            tx.executeSql("INSERT INTO Macro VALUES (?,?)", [macro_info_id, macro_content], function(tx, res) {
                if (res.rowsAffected > 0) {
                    defer.resolve();
                } else {
                    defer.reject(Message.DB.SAVE.FAIL.GEN.MACRO);
                }
            });
            return defer.promise;
        },
        ocean: function(tx) {
            var defer = $q.defer();
            var ocean_info_id = DataService.get('id');
            var ocean_content = obj2Str(DataService.get('ocean'));

            tx.executeSql("INSERT INTO Ocean VALUES (?,?)", [ocean_info_id, ocean_content], function(tx, res) {
                if (res.rowsAffected > 0) {
                    defer.resolve();
                } else {
                    defer.reject("Oceandata save fails");
                }
            });
            return defer.promise;
        },
        fieldtrip: function(tx){
            var defer = $q.defer();
            var field_info_id = DataService.get('id');
            var field_order = 0;
            var field_content = obj2Str(DataService.get('fieldtripguide'));

            tx.executeSql("INSERT INTO Fieldtrip VALUES (?,?,?)", [field_info_id, field_order, field_content], function(tx, res) {
                if (res.rowsAffected > 0) {
                    defer.resolve();
                } else {
                    defer.reject(Message.DB.SAVE.FAIL.GEN.INFO);
                }
            });
            /*var loop = function(tx, id, order, content){
                var totallen = content.length;
                var front = content.slice(0, 1000);
                var rear = content.slice(1000, totallen);
                console.log(front)
                if(front.length>0){
                    tx.executeSql("INSERT INTO Fieldtrip VALUES (?,?,?)", [id, order, front], function(tx, res) {
                        if (res.rowsAffected > 0) {
                            loop(tx, id, order+1, rear);
                        } else {
                            defer.reject(Message.DB.SAVE.FAIL.GEN.INFO);
                        }
                    });
                }else{
                    defer.resolve();
                }
            };

            loop(tx, field_info_id, field_order, field_content);*/
            return defer.promise;
        },
        junin: function(tx) {
            var defer = $q.defer();
            var junin_info_id = DataService.get('id');
            var junin_content = obj2Str(DataService.get('junin'));

            tx.executeSql("INSERT INTO Junin VALUES (?,?)", [junin_info_id, junin_content], function(tx, res) {
                if (res.rowsAffected > 0) {
                    defer.resolve();
                } else {
                    defer.reject("Junin data save fails");
                }
            });
            return defer.promise;
        },
        wikiarticle: {
            single: function(array, tx){
                var defer = $q.defer();
                var wikidata_title=array[0];
                var wikidata_content=obj2Str(array[1]);
                tx.executeSql("INSERT INTO Wikidata VALUES (?,?)", [wikidata_title, wikidata_content], function(tx, res) {
                    wikidata_title=undefined;
                    wikidata_content=undefined;
                    array=[];
                    if (res.rowsAffected > 0) {
                        defer.resolve();
                    } else {
                        defer.reject(Message.DB.SAVE.FAIL.GEN.WIKIDATA);
                    }
                });
                return defer.promise;
            },
            queue: function(queue){
                var self= this;
                var defer = $q.defer();
                if (!queue || queue.length === 0){
                    defer.reject(Message.DB.SAVE.FAIL.QUEUE.WIKIDATA);
                }else{
                    service.handler.transaction(function(tx){
                        var promises = [];
                        for (var i=0; i<queue.length; i++) {
                            promises.push(self.single(queue[i], tx));
                        }
                        queue=[];
                        $q.all(promises).then(function() {
                            promises=[];
                            defer.resolve();
                        }, function(e) {
                            promises=[];
                            defer.reject(e);
                        });
                    });
                }
                return defer.promise;
            }
        },
        poi: {
            single: function(object, tx){
                var defer = $q.defer();
                var poi_content = obj2Str(object);
                var poi_type = object.SourceFrom;
                var wikidata_title = object.WikiDataTitle;
                var poi_id = undefined;
                var ip_info_id = DataService.get("id");

                if(poi_type==="Laccore"){
                    var lac_sample = object.sample;
                    tx.executeSql("SELECT * FROM Poi LEFT OUTER JOIN Laccore ON lac_poi_id=poi_id WHERE lac_sample=(?)", [lac_sample], function(tx, res){
                        if (res.rows.length === 0) {
                            tx.executeSql("INSERT INTO Poi (poi_type, poi_content) VALUES (?,?)", [poi_type, poi_content], function(tx, res) {
                                if (res.rowsAffected > 0) {
                                    poi_id = res.insertId;
                                    tx.executeSql("INSERT INTO Laccore (lac_poi_id, lac_sample) VALUES (?,?)", [poi_id, lac_sample], function(tx, res) {
                                        if (res.rowsAffected > 0) {
                                            tx.executeSql("INSERT INTO Info_poi (ip_info_id, ip_poi_id) VALUES (?,?)", [ip_info_id, poi_id], function(tx, res) {
                                                if (res.rowsAffected > 0) {
                                                    defer.resolve();
                                                }else{
                                                    defer.reject(Message.DB.SAVE.FAIL.GEN.INFOPOI);
                                                }
                                            });
                                        }else{
                                            defer.reject(Message.DB.SAVE.FAIL.GEN.LAC);
                                        }
                                    });
                                }else{
                                    defer.reject(Message.DB.SAVE.FAIL.GEN.POI);
                                }
                            });
                        }else{
                            poi_id=res.rows.item(0).poi_id;
                            tx.executeSql("INSERT INTO Info_poi (ip_info_id, ip_poi_id) VALUES (?,?)", [ip_info_id, poi_id], function(tx, res) {
                                if (res.rowsAffected > 0) {
                                    defer.resolve();
                                }else{
                                    defer.reject(Message.DB.SAVE.FAIL.GEN.INFOPOI);
                                }
                            });
                        }
                    });
                } else if(poi_type==="Nepgpx"){
                    var ng_id = object.id;
                    tx.executeSql("SELECT * FROM Poi LEFT OUTER JOIN Nepgpx ON ng_poi_id=poi_id WHERE ng_id=(?)", [ng_id], function(tx, res){
                        if (res.rows.length === 0) {
                            tx.executeSql("INSERT INTO Poi (poi_type, poi_content) VALUES (?,?)", [poi_type, poi_content], function(tx, res) {
                                if (res.rowsAffected > 0) {
                                    poi_id = res.insertId;
                                    tx.executeSql("INSERT INTO Nepgpx (ng_poi_id, ng_id) VALUES (?,?)", [poi_id, ng_id], function(tx, res) {
                                        if (res.rowsAffected > 0) {
                                            tx.executeSql("INSERT INTO Info_poi (ip_info_id, ip_poi_id) VALUES (?,?)", [ip_info_id, poi_id], function(tx, res) {
                                                if (res.rowsAffected > 0) {
                                                    defer.resolve();
                                                }else{
                                                    defer.reject(Message.DB.SAVE.FAIL.GEN.INFOPOI);
                                                }
                                            });
                                        }else{
                                            defer.reject("Nepal data save fails");
                                        }
                                    });
                                }else{
                                    defer.reject(Message.DB.SAVE.FAIL.GEN.POI);
                                }
                            });
                        }else{
                            poi_id=res.rows.item(0).poi_id;
                            tx.executeSql("INSERT INTO Info_poi (ip_info_id, ip_poi_id) VALUES (?,?)", [ip_info_id, poi_id], function(tx, res) {
                                if (res.rowsAffected > 0) {
                                    defer.resolve();
                                }else{
                                    defer.reject(Message.DB.SAVE.FAIL.GEN.INFOPOI);
                                }
                            });
                        }
                    });
                } else if(poi_type==="Neplogger"){
                    var nl_id = object.id;
                    tx.executeSql("SELECT * FROM Poi LEFT OUTER JOIN Neplogger ON nl_poi_id=poi_id WHERE nl_id=(?)", [nl_id], function(tx, res){
                        if (res.rows.length === 0) {
                            tx.executeSql("INSERT INTO Poi (poi_type, poi_content) VALUES (?,?)", [poi_type, poi_content], function(tx, res) {
                                if (res.rowsAffected > 0) {
                                    poi_id = res.insertId;
                                    tx.executeSql("INSERT INTO Neplogger (nl_poi_id, nl_id) VALUES (?,?)", [poi_id, nl_id], function(tx, res) {
                                        if (res.rowsAffected > 0) {
                                            tx.executeSql("INSERT INTO Info_poi (ip_info_id, ip_poi_id) VALUES (?,?)", [ip_info_id, poi_id], function(tx, res) {
                                                if (res.rowsAffected > 0) {
                                                    defer.resolve();
                                                }else{
                                                    defer.reject(Message.DB.SAVE.FAIL.GEN.INFOPOI);
                                                }
                                            });
                                        }else{
                                            defer.reject("Nepal data save fails");
                                        }
                                    });
                                }else{
                                    defer.reject(Message.DB.SAVE.FAIL.GEN.POI);
                                }
                            });
                        }else{
                            poi_id=res.rows.item(0).poi_id;
                            tx.executeSql("INSERT INTO Info_poi (ip_info_id, ip_poi_id) VALUES (?,?)", [ip_info_id, poi_id], function(tx, res) {
                                if (res.rowsAffected > 0) {
                                    defer.resolve();
                                }else{
                                    defer.reject(Message.DB.SAVE.FAIL.GEN.INFOPOI);
                                }
                            });
                        }
                    });
                } else if(poi_type==="Nepinreach"){
                    var nir_id = object.id;
                    tx.executeSql("SELECT * FROM Poi LEFT OUTER JOIN Nepinreach ON nir_poi_id=poi_id WHERE nir_id=(?)", [nir_id], function(tx, res){
                        if (res.rows.length === 0) {
                            tx.executeSql("INSERT INTO Poi (poi_type, poi_content) VALUES (?,?)", [poi_type, poi_content], function(tx, res) {
                                if (res.rowsAffected > 0) {
                                    poi_id = res.insertId;
                                    tx.executeSql("INSERT INTO Nepinreach (nir_poi_id, nir_id) VALUES (?,?)", [poi_id, nir_id], function(tx, res) {
                                        if (res.rowsAffected > 0) {
                                            tx.executeSql("INSERT INTO Info_poi (ip_info_id, ip_poi_id) VALUES (?,?)", [ip_info_id, poi_id], function(tx, res) {
                                                if (res.rowsAffected > 0) {
                                                    defer.resolve();
                                                }else{
                                                    defer.reject(Message.DB.SAVE.FAIL.GEN.INFOPOI);
                                                }
                                            });
                                        }else{
                                            defer.reject("Nepal data save fails");
                                        }
                                    });
                                }else{
                                    defer.reject(Message.DB.SAVE.FAIL.GEN.POI);
                                }
                            });
                        }else{
                            poi_id=res.rows.item(0).poi_id;
                            tx.executeSql("INSERT INTO Info_poi (ip_info_id, ip_poi_id) VALUES (?,?)", [ip_info_id, poi_id], function(tx, res) {
                                if (res.rowsAffected > 0) {
                                    defer.resolve();
                                }else{
                                    defer.reject(Message.DB.SAVE.FAIL.GEN.INFOPOI);
                                }
                            });
                        }
                    });
                } else if(poi_type==="Neotoma"){
                    var neo_taxonname = object.TaxonName;
                    var neo_siteid = object.SiteID;
                    var neo_unitid = object.OccurID;
                    tx.executeSql("SELECT * FROM Poi LEFT OUTER JOIN Neotoma ON poi_id=neo_poi_id WHERE neo_taxonname=(?) AND neo_siteid=(?) AND neo_unitid=(?)", [neo_taxonname, neo_siteid, neo_unitid], function(tx, res){
                        if (res.rows.length === 0) {
                            tx.executeSql("INSERT INTO Poi (poi_type, poi_content) VALUES (?,?)", [poi_type, poi_content], function(tx, res) {
                                if (res.rowsAffected > 0) {
                                    poi_id = res.insertId;
                                    tx.executeSql("INSERT INTO Neotoma (neo_poi_id, neo_taxonname, neo_siteid, neo_unitid) VALUES (?,?,?,?)", [poi_id, neo_taxonname, neo_siteid, neo_unitid], function(tx, res) {
                                        if (res.rowsAffected > 0) {
                                            tx.executeSql("INSERT INTO Poi_wikidata (pw_poi_id, pw_wikidata_title) VALUES (?,?)", [poi_id, wikidata_title], function(tx, res) {
                                                if (res.rowsAffected > 0) {
                                                    tx.executeSql("INSERT INTO Info_poi (ip_info_id, ip_poi_id) VALUES (?,?)", [ip_info_id, poi_id], function(tx, res) {
                                                        if (res.rowsAffected > 0) {
                                                            defer.resolve();
                                                        }else{
                                                            defer.reject(Message.DB.SAVE.FAIL.GEN.INFOPOI);
                                                        }
                                                    });
                                                }else{
                                                    defer.reject(Message.DB.SAVE.FAIL.GEN.POIWIKIDATA);
                                                }
                                            });
                                        }else{
                                            defer.reject(Message.DB.SAVE.FAIL.GEN.NEO);
                                        }
                                    });
                                }else{
                                    defer.reject(Message.DB.SAVE.FAIL.GEN.POI);
                                }
                            });
                        }else{
                            poi_id=res.rows.item(0).poi_id;
                            tx.executeSql("INSERT INTO Info_poi (ip_info_id, ip_poi_id) VALUES (?,?)", [ip_info_id, poi_id], function(tx, res) {
                                if (res.rowsAffected > 0) {
                                    defer.resolve();
                                }else{
                                    defer.reject(Message.DB.SAVE.FAIL.GEN.INFOPOI);
                                }
                            });
                        }
                    });
                }else if(poi_type==="Wikipedia"){
                    var wiki_id = object.id;
                    tx.executeSql("SELECT * FROM Poi LEFT OUTER JOIN Wikipedia ON poi_id=wiki_poi_id WHERE wiki_id=(?)", [wiki_id], function(tx, res){
                        if (res.rows.length === 0) {
                            tx.executeSql("INSERT INTO Poi (poi_type, poi_content) VALUES (?,?)", [poi_type, poi_content], function(tx, res) {
                                if (res.rowsAffected > 0) {
                                    poi_id = res.insertId;
                                    tx.executeSql("INSERT INTO Wikipedia (wiki_poi_id, wiki_id) VALUES (?,?)", [poi_id, wiki_id], function(tx, res) {
                                        if (res.rowsAffected > 0) {
                                            tx.executeSql("INSERT INTO Poi_wikidata (pw_poi_id, pw_wikidata_title) VALUES (?,?)", [poi_id, wikidata_title], function(tx, res) {
                                                if (res.rowsAffected > 0) {
                                                    tx.executeSql("INSERT INTO Info_poi (ip_info_id, ip_poi_id) VALUES (?,?)", [ip_info_id, poi_id], function(tx, res) {
                                                        if (res.rowsAffected > 0) {
                                                            defer.resolve();
                                                        }else{
                                                            defer.reject(Message.DB.SAVE.FAIL.GEN.INFOPOI);
                                                        }
                                                    });
                                                }else{
                                                    defer.reject(Message.DB.SAVE.FAIL.GEN.POIWIKIDATA);
                                                }
                                            });
                                        }else{
                                            defer.reject(Message.DB.SAVE.FAIL.GEN.WIKI);
                                        }
                                    });
                                }else{
                                    defer.reject(Message.DB.SAVE.FAIL.GEN.POI);
                                }
                            });
                        }else{
                            poi_id=res.rows.item(0).poi_id;
                            tx.executeSql("INSERT INTO Info_poi (ip_info_id, ip_poi_id) VALUES (?,?)", [ip_info_id, poi_id], function(tx, res) {
                                if (res.rowsAffected > 0) {
                                    defer.resolve();
                                }else{
                                    defer.reject(Message.DB.SAVE.FAIL.GEN.INFOPOI);
                                }
                            });
                        }
                    });
                }else if(poi_type==="PBDB"){
                    var pbdb_id = object.oid;
                    tx.executeSql("SELECT * FROM Poi LEFT OUTER JOIN Pbdb ON poi_id=pbdb_poi_id WHERE pbdb_id=(?)", [pbdb_id], function(tx, res){
                        if (res.rows.length === 0) {
                            tx.executeSql("INSERT INTO Poi (poi_type, poi_content) VALUES (?,?)", [poi_type, poi_content], function(tx, res) {
                                if (res.rowsAffected > 0) {
                                    poi_id = res.insertId;
                                    tx.executeSql("INSERT INTO Pbdb (pbdb_poi_id, pbdb_id) VALUES (?,?)", [poi_id, pbdb_id], function(tx, res) {
                                        if (res.rowsAffected > 0) {
                                            tx.executeSql("INSERT INTO Poi_wikidata (pw_poi_id, pw_wikidata_title) VALUES (?,?)", [poi_id, wikidata_title], function(tx, res) {
                                                if (res.rowsAffected > 0) {
                                                    tx.executeSql("INSERT INTO Info_poi (ip_info_id, ip_poi_id) VALUES (?,?)", [ip_info_id, poi_id], function(tx, res) {
                                                        if (res.rowsAffected > 0) {
                                                            defer.resolve();
                                                        }else{
                                                            defer.reject(Message.DB.SAVE.FAIL.GEN.INFOPOI);
                                                        }
                                                    });
                                                }else{
                                                    defer.reject(Message.DB.SAVE.FAIL.GEN.POIWIKIDATA);
                                                }
                                            });
                                        }else{
                                            defer.reject(Message.DB.SAVE.FAIL.GEN.PBDB);
                                        }
                                    });
                                }else{
                                    defer.reject(Message.DB.SAVE.FAIL.GEN.POI);
                                }
                            });
                        }else{
                            poi_id=res.rows.item(0).poi_id;
                            tx.executeSql("INSERT INTO Info_poi (ip_info_id, ip_poi_id) VALUES (?,?)", [ip_info_id, poi_id], function(tx, res) {
                                if (res.rowsAffected > 0) {
                                    defer.resolve();
                                }else{
                                    defer.reject(Message.DB.SAVE.FAIL.GEN.INFOPOI);
                                }
                            });
                        }
                    });
                }else if(poi_type==="Fieldtripguide"){
                    var field_id = object.id;
                    tx.executeSql("SELECT * FROM Poi LEFT OUTER JOIN Nepinreach ON nir_poi_id=poi_id WHERE nir_id=(?)", [nir_id], function(tx, res){
                        if (res.rows.length === 0) {
                            tx.executeSql("INSERT INTO Poi (poi_type, poi_content) VALUES (?,?)", [poi_type, poi_content], function(tx, res) {
                                if (res.rowsAffected > 0) {
                                    poi_id = res.insertId;
                                    tx.executeSql("INSERT INTO Nepinreach (nir_poi_id, nir_id) VALUES (?,?)", [poi_id, nir_id], function(tx, res) {
                                        if (res.rowsAffected > 0) {
                                            tx.executeSql("INSERT INTO Info_poi (ip_info_id, ip_poi_id) VALUES (?,?)", [ip_info_id, poi_id], function(tx, res) {
                                                if (res.rowsAffected > 0) {
                                                    defer.resolve();
                                                }else{
                                                    defer.reject(Message.DB.SAVE.FAIL.GEN.INFOPOI);
                                                }
                                            });
                                        }else{
                                            defer.reject("Nepal data save fails");
                                        }
                                    });
                                }else{
                                    defer.reject(Message.DB.SAVE.FAIL.GEN.POI);
                                }
                            });
                        }else{
                            poi_id=res.rows.item(0).poi_id;
                            tx.executeSql("INSERT INTO Info_poi (ip_info_id, ip_poi_id) VALUES (?,?)", [ip_info_id, poi_id], function(tx, res) {
                                if (res.rowsAffected > 0) {
                                    defer.resolve();
                                }else{
                                    defer.reject(Message.DB.SAVE.FAIL.GEN.INFOPOI);
                                }
                            });
                        }
                    });
                }

                return defer.promise;
            },
            queue: function(queue){
                var self= this;
                var defer = $q.defer();
                if (!queue || queue.length === 0){
                    defer.reject(Message.DB.SAVE.FAIL.QUEUE.POI);
                }else{
                    service.handler.transaction(function(tx){
                        var promises = [];
                        for (var i=0; i<queue.length; i++) {
                            promises.push(self.single(queue[i], tx));
                        }
                        $q.all(promises).then(function() {
                            defer.resolve();
                        }, function(e) {
                            defer.reject(e);
                        });
                    });
                }
                return defer.promise;
            }
        },
        infotile: {
            single: function(tileindexes, type, tx){
                var defer= $q.defer();
                var tile_z = tileindexes[2];
                var tile_x = tileindexes[0];
                var tile_y = tileindexes[1];
                var tile_type_id = type;
                var it_info_id = DataService.get("id");

                tx.executeSql("INSERT INTO Info_tile (it_info_id, it_tile_z, it_tile_x, it_tile_y, it_tile_type_id) VALUES (?,?,?,?,?)", [it_info_id, tile_z, tile_x, tile_y, tile_type_id], function(tx, res) {
                    if (res.rowsAffected > 0) {
                        defer.resolve();
                    } else {
                        defer.reject(Message.DB.SAVE.FAIL.GEN.INFOTILE);
                    }
                });
                return defer.promise;
            },
            queue: function(queue){
                var self= this;
                var types= DataService.get('tiletype');
                var defer = $q.defer();
                if (!queue || queue.length === 0) {
                    defer.reject(Message.DB.SAVE.FAIL.QUEUE.INFOTILE);
                }else{
                    service.handler.transaction(function(tx){
                        var promises = [];
                        for (var i = 0; i < queue.length; i++){
                            for(var j=0; j< types.length; j++){
                                promises.push(self.single(queue[i], types[j], tx));
                            }
                        }
                        queue=[];
                        $q.all(promises).then(function() {
                            promises=[];
                            defer.resolve();
                        }, function(e) {
                            promises=[];
                            defer.reject(e);
                        });
                    });
                }
                return defer.promise;
            }
        },
        tile: {
            single: function(array, tx){
                var defer = $q.defer();
                var tileindexes = array[0];
                var tile_z = tileindexes[2];
                var tile_x = tileindexes[0];
                var tile_y = tileindexes[1];
                var tile_type_id = tileindexes[3];
                var tile_content = array[1];

                tx.executeSql("INSERT INTO Tile (tile_z, tile_x, tile_y, tile_type_id, tile_content) VALUES (?,?,?,?,?)", [tile_z, tile_x, tile_y, tile_type_id, tile_content], function(tx, res) {
                    array=[];
                    tileindexes=undefined;
                    tile_content=undefined;
                    if (res.rowsAffected > 0) {
                        defer.resolve();
                    } else {
                        defer.reject(Message.DB.SAVE.FAIL.GEN.TILE);
                    }
                });
                return defer.promise;
            },
            queue: function(queue){
                var self= this;
                var defer = $q.defer();
                if (!queue || queue.length === 0){
                    defer.reject(Message.DB.SAVE.FAIL.QUEUE.TILE);
                }else{
                    service.handler.transaction(function(tx){
                        var promises = [];
                        for (var i=0; i<queue.length; i++) {
                            promises.push(self.single(queue[i], tx));
                        }
                        queue=[];
                        $q.all(promises).then(function() {
                            promises=[];
                            defer.resolve();
                        }, function(e) {
                            promises=[];
                            defer.reject(e);
                        });
                    });
                }
                return defer.promise;
            }
        }
    };

    service.load = {
        marker: function(){
            var defer = $q.defer();
            if(Config.isCurrentDB(1)){
                service.handler.transaction(function(tx){
                    tx.executeSql("SELECT * FROM Usermarker", [], function(tx, res) {
                        if (res.rows.length > 0) {
                            var retarray = [];
                            var retlen = res.rows.length;
                            for(var i=0; i<retlen; i++){
                                var value = str2Obj(res.rows.item(i).u_content);
                                retarray.push(value);
                            }
                            defer.resolve(retarray);
                        }else{
                            defer.resolve([]);
                        }
                    });
                });
            } else defer.resolve([]);
            return defer.promise;
        },
        infocontent: function(id){
            var defer = $q.defer();
            var promises = [];
            service.handler.transaction(function(tx) {
                promises.push(service.load.macro(id, tx));
                promises.push(service.load.ocean(id, tx));
                promises.push(service.load.junin(id, tx));
                promises.push(service.load.poi(id, "Neotoma" ,tx));
                promises.push(service.load.poi(id, "Wikipedia" ,tx));
                promises.push(service.load.poi(id, "PBDB" ,tx));
                promises.push(service.load.poi(id, "Laccore" ,tx));
                promises.push(service.load.poi(id, "Nepgpx" ,tx));
                promises.push(service.load.poi(id, "Neplogger" ,tx));
                promises.push(service.load.poi(id, "Nepinreach" ,tx));
                promises.push(service.load.fieldtrip(id, tx));
                $q.all(promises).then(function(data){
                    defer.resolve(data);
                });
            });
            return defer.promise;
        },
        infolist: function(){
            var defer = $q.defer();
            service.handler.transaction(function(tx) {
                tx.executeSql("SELECT * FROM Info", [], function(tx, res) {
                    if (res.rows.length > 0) {
                        var retarray = [];
                        var retlen = res.rows.length;
                        for(var i=0; i<retlen; i++){
                            var value = str2Obj(res.rows.item(i).info_content);
                            retarray.push(value);
                        }
                        defer.resolve(retarray);
                    } else {
                        defer.resolve([]);
                    }
                });
            });
            return defer.promise;
        },
        macro: function(id, tx){
            var defer= $q.defer();
            tx.executeSql("SELECT * FROM Macro WHERE macro_info_id=(?)", [id], function(tx, res) {
                if (res.rows.length > 0) {
                    var macro_content = str2Obj(res.rows.item(0).macro_content);
                    defer.resolve(macro_content);
                } else {
                    defer.resolve({});
                }
            });
            return defer.promise;
        },
        ocean: function(id, tx){
            var defer= $q.defer();
            tx.executeSql("SELECT * FROM Ocean WHERE ocean_info_id=(?)", [id], function(tx, res) {
                if (res.rows.length > 0) {
                    var ocean_content = str2Obj(res.rows.item(0).ocean_content);
                    defer.resolve(ocean_content);
                } else {
                    defer.resolve({});
                }
            });
            return defer.promise;
        },
        fieldtrip: function(id, tx){
            var defer= $q.defer();
            tx.executeSql("SELECT * FROM Fieldtrip WHERE field_info_id=(?)", [id], function(tx, res) {
                if (res.rows.length > 0) {
                    var field_content = str2Obj(res.rows.item(0).field_content);
                    defer.resolve(field_content);
                } else {
                    defer.resolve({});
                }
            });
            return defer.promise;
        },
        junin: function(id, tx){
            var defer= $q.defer();
            tx.executeSql("SELECT * FROM Junin WHERE junin_info_id=(?)", [id], function(tx, res) {
                if (res.rows.length > 0) {
                    var junin_content = str2Obj(res.rows.item(0).junin_content);
                    defer.resolve(junin_content);
                } else {
                    defer.resolve({});
                }
            });
            return defer.promise;
        },
        poi: function(id, type, tx){
            var defer= $q.defer();
            tx.executeSql("SELECT * FROM Info_poi LEFT OUTER JOIN Poi ON ip_poi_id=poi_id WHERE ip_info_id=(?) AND poi_type=(?)", [id, type], function(tx, res) {
                if (res.rows.length > 0) {
                    var retarray = [];
                    var retlen = res.rows.length;
                    for(var i=0; i<retlen; i++){
                        var value = str2Obj(res.rows.item(i).poi_content);
                        retarray.push(value);
                    }
                    defer.resolve(retarray);
                } else {
                    defer.resolve([]);
                }
            });
            return defer.promise;
        },
        preloadtile: function(indexarray, tiletype){
            var defer = $q.defer();
            if(Config.isCurrentDB(1)){
                var tile_z = indexarray[2];
                var tile_x = indexarray[0];
                var tile_y = indexarray[1];
                var tile_type_id = tiletype;

                service.handler.transaction(function(tx) {
                    tx.executeSql("SELECT * FROM sqlite_master WHERE type=(?) AND name=(?)", ['table','Preloadtile'], function(tx, res) {
                        if(res.rows.length === 0 ){
                            defer.resolve(null);
                        }else{
                            tx.executeSql("SELECT * FROM Preloadtile WHERE tile_type_id=(?) AND tile_z=(?) AND tile_x=(?) AND tile_y=(?)", [tile_type_id, tile_z, tile_x, tile_y], function(tx, res) {
                                if (res.rows.length > 0) {
                                    var tile_content = res.rows.item(0).tile_content;
                                    defer.resolve(tile_content);
                                } else {
                                    defer.resolve(null);
                                }
                            });
                        }
                    });
                });
            } else {
                defer.resolve(null);
            }
            return defer.promise;
        },
        tile: function(indexarray, tiletype){
            var defer = $q.defer();

            var it_info_id = DataService.get("id");
            var tile_z = indexarray[2];
            var tile_x = indexarray[0];
            var tile_y = indexarray[1];
            var tile_type_id = tiletype;

            service.handler.transaction(function(tx) {
                tx.executeSql("SELECT * FROM Info_tile LEFT OUTER JOIN Tile ON it_tile_z=tile_z AND it_tile_x=tile_x AND it_tile_y=tile_y AND it_tile_type_id=tile_type_id WHERE it_info_id=(?) AND tile_type_id=(?) AND tile_z=(?) AND tile_x=(?) AND tile_y=(?)", [it_info_id, tile_type_id, tile_z, tile_x, tile_y], function(tx, res) {
                    if (res.rows.length > 0) {
                        var tile_content = res.rows.item(0).tile_content;
                        defer.resolve(tile_content);
                    } else {
                        defer.resolve(null);
                    }
                });
            });
            return defer.promise;
        },
        wikiarticle: function(title){
            var defer= $q.defer();
            if(Config.isCurrentDB(1)){
                service.handler.transaction(function(tx) {
                    tx.executeSql("SELECT * FROM Wikidata WHERE wikidata_title=(?)", [title], function(tx, res){
                        if (res.rows.length > 0) {
                            var wikidata_content = str2Obj(res.rows.item(0).wikidata_content);
                            defer.resolve(wikidata_content);
                        }else{
                            defer.resolve(undefined);
                        }
                    });
                });
            }else defer.resolve(undefined);
            return defer.promise;
        },
        prewikiarticle: function(title){
            var defer= $q.defer();
            if(Config.isCurrentDB(1)){
                service.handler.transaction(function(tx) {
                    tx.executeSql("SELECT * FROM sqlite_master WHERE type=(?) AND name=(?)", ['table','Prewikidata'], function(tx, res) {
                        if(res.rows.length === 0 ){
                            defer.resolve(undefined);
                        }else{
                            tx.executeSql("SELECT * FROM Prewikidata WHERE wikidata_title=(?)", [title], function(tx, res){
                                if (res.rows.length > 0) {
                                    var wikidata_content = str2Obj(res.rows.item(0).wikidata_content);
                                    defer.resolve(wikidata_content);
                                }else{
                                    defer.resolve(undefined);
                                }
                            });
                        }
                    });
                });
            }else defer.resolve(undefined);
            return defer.promise;
        },
        infotile: function(){
            var defer = $q.defer();
            var info_id = DataService.get("id");
            service.handler.transaction(function(tx) {
                tx.executeSql("SELECT * FROM Info_tile WHERE it_info_id=(?) AND NOT EXISTS (SELECT * FROM Tile WHERE tile_z=it_tile_z AND tile_x=it_tile_x AND tile_y=it_tile_y AND tile_type_id=it_tile_type_id)", [info_id], function(tx, res) {
                    if (res.rows.length > 0) {
                        var retarray = [];
                        var retlen = res.rows.length;
                        for(var i=0; i<retlen; i++){
                            var tile_z = res.rows.item(i).it_tile_z;
                            var tile_x = res.rows.item(i).it_tile_x;
                            var tile_y = res.rows.item(i).it_tile_y;
                            var tile_type_id = res.rows.item(i).it_tile_type_id;
                            retarray.push([tile_x, tile_y, tile_z, tile_type_id]);
                        }
                        defer.resolve(retarray);
                    } else {
                        defer.resolve(null);
                    }
                });
            });
            return defer.promise;
        },
        poiwikiarticle: function(){
            var defer = $q.defer();
            var info_id = DataService.get("id");
            service.handler.transaction(function(tx) {
                tx.executeSql("SELECT DISTINCT pw_wikidata_title FROM Info_poi INNER JOIN Poi_wikidata ON ip_poi_id=pw_poi_id WHERE ip_info_id=(?) AND pw_wikidata_title NOT IN (SELECT wikidata_title FROM Wikidata)", [info_id], function(tx, res) {
                    if (res.rows.length > 0) {
                        var retarray = [];
                        var retlen = res.rows.length;

                        for(var i=0; i<retlen; i++){
                            var title = res.rows.item(i).pw_wikidata_title;
                            retarray.push(title);
                        }
                        defer.resolve(retarray);
                    } else {
                        defer.resolve(null);
                    }
                });
            });
            return defer.promise;
        }
    };

    service.remove ={
        marker: function(coords){
            var defer = $q.defer();
            var u_lng=coords[0];
            var u_lat=coords[1];
            if(Config.isCurrentDB(1)){
                service.handler.transaction(function(tx){
                    tx.executeSql("DELETE FROM Usermarker WHERE u_lng=(?) AND u_lat=(?)", [u_lng, u_lat], function(tx, res) {
                        tx.executeSql("SELECT * FROM Usermarker WHERE u_lng=(?) AND u_lat=(?)", [u_lng, u_lat], function(tx, res) {
                            if (res.rows.length == 0) {
                                defer.resolve();
                            }else{
                                defer.reject();
                            }
                        });
                    });
                });
            }else defer.reject();
            return defer.promise;
        },
        infocontent: function(id){
            var defer = $q.defer();
            service.handler.transaction(function(tx) {
                tx.executeSql("DELETE FROM Wikidata WHERE wikidata_title IN (SELECT pw_wikidata_title FROM Info_poi INNER JOIN Poi_wikidata ON ip_poi_id=pw_poi_id WHERE ip_info_id=(?) EXCEPT SELECT pw_wikidata_title FROM Info_poi INNER JOIN Poi_wikidata ON ip_poi_id=pw_poi_id WHERE ip_info_id!=(?) )", [id, id], function(tx, res) {
                    tx.executeSql("DELETE FROM Poi WHERE poi_id IN (SELECT ip_poi_id FROM Info_poi WHERE ip_poi_id=poi_id AND ip_info_id=(?) EXCEPT SELECT ip_poi_id FROM Info_poi WHERE ip_poi_id=poi_id AND ip_info_id!=(?) )", [id, id], function(tx, res) {
                        tx.executeSql("DELETE FROM Tile WHERE EXISTS (SELECT * FROM Info_tile WHERE it_tile_z=tile_z AND it_tile_x=tile_x AND it_tile_y=tile_y AND it_tile_type_id=tile_type_id AND it_info_id=(?) ) AND NOT EXISTS (SELECT * FROM Info_tile WHERE it_tile_z=tile_z AND it_tile_x=tile_x AND it_tile_y=tile_y AND it_tile_type_id=tile_type_id AND it_info_id!=(?) )", [id, id], function(tx, res) {
                            tx.executeSql("DELETE FROM Info WHERE info_id=(?)", [id], function(tx, res) {
                                if (res.rowsAffected > 0){
                                    service.handler.executeSql("VACUUM", []);
                                    defer.resolve();
                                } else {
                                    defer.reject(Message.DB.DELETE.FAIL.GEN.INFO);
                                }
                            });
                        });
                    });
                });
            });
            return defer.promise;
        },
        all: function(){
            var defer = $q.defer();
            service.handler.transaction(function(tx) {
                tx.executeSql("DELETE FROM Wikidata", [], function(tx, res) {
                    tx.executeSql("DELETE FROM Poi", [], function(tx, res) {
                        tx.executeSql("DELETE FROM Tile", [], function(tx, res) {
                            tx.executeSql("DELETE FROM Info", [], function(tx, res) {
                                tx.executeSql("SELECT * FROM Info", [], function(tx, res) {
                                    if (res.rows.length == 0) {
                                        tx.executeSql("SELECT * FROM Poi", [], function(tx, res) {
                                            if (res.rows.length == 0) {
                                                tx.executeSql("SELECT * FROM Tile", [], function(tx, res) {
                                                    if (res.rows.length == 0) {
                                                        tx.executeSql("SELECT * FROM Wikidata", [], function(tx, res) {
                                                            if (res.rows.length == 0) {
                                                                service.handler.executeSql("VACUUM", []);
                                                                defer.resolve();
                                                            } else defer.reject(Message.DB.DELETE.FAIL.ALL);
                                                        });
                                                    } else defer.reject(Message.DB.DELETE.FAIL.ALL);
                                                });
                                            } else defer.reject(Message.DB.DELETE.FAIL.ALL);
                                        });
                                    } else defer.reject(Message.DB.DELETE.FAIL.ALL);
                                });
                            });
                        });
                    });
                });
            });
            return defer.promise;
        }
    };

    return service;
}]);
