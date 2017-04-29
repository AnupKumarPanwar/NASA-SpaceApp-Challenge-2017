app.factory('Modal', function($ionicModal, $timeout, $ionicPlatform, $ionicBackdrop, $ionicSlideBoxDelegate, $ionicPopover, $q, $rootScope, $window, State, TileService, Config, Message, DataService, RequestService,IonicUtilService) {
    var service = {};
    service.download = function(){
        var defer = $q.defer();
        var modalScope = $rootScope.$new();
        $ionicModal.fromTemplateUrl('templates/util/modal/download.html', {
            scope: modalScope,
            backdropClickToClose: false
        }).then(function(modal) {
            modalScope.databox = {
                name: undefined,
                description: undefined,
                reset: function() {
                    this.name = undefined;
                    this.description = undefined;
                }
            };
            modalScope.tilebox = {
                tilenames: TileService.getDownloadNames(),
                base: 0,
                number: 0,
                checkbox: {},
                imagebox: {},
                getImgClass: function(bool){
                    if(bool) return "fc-tileimg-box active";
                    else return "fc-tileimg-box";
                },
                getTextClass: function(bool){
                    if(bool) return "fc-tiletext-box active";
                    else return "fc-tiletext-box";
                },
                getTileNames: function() {
                    return this.tilenames;
                },
                getFullName: function(tilename) {
                    return TileService.getFullName(tilename);
                },
                getTileNumber: function(){
                    return this.number*this.base;
                },
                getTileSize: function(){
                    return (this.getTileNumber()*20/1024).toFixed(1);
                },
                getSelectedTile: function(){
                    var array=[];
                    for(var i=0; i<this.tilenames.length; i++){
                        if(this.checkbox[this.tilenames[i]]) array.push(this.tilenames[i]);
                    }
                    return array;
                },
                reset: function() {
                    this.base = 0;
                    this.number = 0;
                    for(var i=0; i < this.tilenames.length; i++){
                        this.checkbox[this.tilenames[i]]=false;
                    }
                }
            };
            modalScope.$watch(function(){return modalScope.tilebox.checkbox;}, function(){
                modalScope.tilebox.number = 0;
                for(var value in modalScope.tilebox.checkbox){
                    if(modalScope.tilebox.checkbox[value]) {
                        modalScope.tilebox.number++;
                    }
                }
            }, true);
            modalScope.featurebox = {
                featurenames:[],
                checkbox: {},
                title: {},
                disabled: {},
                getFeatureNames: function() {
                    return this.featurenames;
                },
                set: function(){
                    for(var i=0; i< Config.infoNames.length; i++){
                        var item = Config.infoNames[i];
                        var key =item.name;
                        if(this.featurenames.indexOf(key)!=-1){
                            var disabled = item.download.disabled;
                            modalScope.featurebox.disabled[key] = disabled;
                            modalScope.featurebox.checkbox[key] = !disabled;
                        }
                    }
                },
                reset: function(){
                    for(var key in this.checkbox){
                        this.checkbox[key]= false;
                        this.disabled[key]= true;
                    }
                }
            };
            modalScope.progressBar = {
                text: "saving...",
                maxvalue: 0,
                value: 0,
                visible: false,
                setText: function(text) {
                    this.text = text;
                },
                getText: function() {
                    return this.text;
                },
                addValue: function(value) {
                    this.value += value;
                    var phase = modalScope.$root.$$phase;
                    if (phase == '$apply' || phase == '$digest') return;
                    modalScope.$apply();
                },
                addFull: function(){
                    this.value = this.maxvalue;
                    var phase = modalScope.$root.$$phase;
                    if (phase == '$apply' || phase == '$digest') return;
                    modalScope.$apply();
                },
                reset: function() {
                    this.value = 1;
                    this.visible = false;
                    this.maxvalue = 0;
                    this.text = "saving..."
                    var phase = modalScope.$root.$$phase;
                    if (phase == '$apply' || phase == '$digest') return;
                    modalScope.$apply();
                },
                setVisible: function(bool) {
                    this.visible = bool;
                    var phase = modalScope.$root.$$phase;
                    if (phase == '$apply' || phase == '$digest') return;
                    modalScope.$apply();
                },
                calculateMaxvalue: function(value){
                    this.maxvalue=10;
                    this.maxvalue+=value;
                }
            };
            var resetModal = function() {
                modalScope.databox.reset();
                modalScope.featurebox.reset();
                modalScope.tilebox.reset();
                modalScope.progressBar.reset();
            };
            modalScope.save = function() {
                if (!State.isMap(4)) {
                    alert("error state");
                    return;
                }
                if (!modalScope.isInputDataValid()) return;
                $rootScope.$broadcast('event:button', {name: 'save'});
            };
            modalScope.start = function() {
                if(State.isSaveStatus(true)){
                    modalScope.databox.name = "Field trip: "+Config.fieldtripName;
                }
                modalScope.tilebox.base = DataService.get("tilenumber") || 0;
                modalScope.tilebox.checkbox[TileService.getCurrentTile()] = true;
                modalScope.featurebox.set();

                modal.show();
            };
            modalScope.stop = function() {
                resetModal();
                modal.hide();
            };
            modalScope.isShown = function() {
                return modal.isShown();
            };
            modalScope.cancel = function() {
                $rootScope.$broadcast('event:button', {name: 'downloadback'});
            };
            modalScope.isInputDataValid = function() {
                if (!modalScope.databox.name) {
                    IonicUtilService.alert.start("Error",Message.DOWNLOAD.FAIL.INVALIDNAME);
                    return false;
                }
                if ( modalScope.tilebox.number===0) {
                    IonicUtilService.alert.start("Error",Message.DOWNLOAD.FAIL.NOTILE);
                    return false;
                }
                return true;
            };

            function init(){
                for(var i=0; i < modalScope.tilebox.tilenames.length; i++){
                    var tilename = modalScope.tilebox.tilenames[i];
                    modalScope.tilebox.checkbox[tilename]=false;
                    modalScope.tilebox.imagebox[tilename]=TileService.getTileImage(tilename);
                }

                for(var i=0; i< Config.infoNames.length; i++){
                    var item = Config.infoNames[i];
                    var key =item.name;
                    if(item.download) {
                        var title =item.download.title;
                        var disabled = item.download.disabled;
                        modalScope.featurebox.featurenames.push(key);
                        modalScope.featurebox.checkbox[key]=!disabled;
                        modalScope.featurebox.title[key] = title;
                        modalScope.featurebox.disabled[key] = disabled;
                    }
                }
            };
            init();
            defer.resolve(modalScope);
        });
        return defer.promise;
    };
    service.stopsImage= function(){
        var defer = $q.defer();
        var modalScope = $rootScope.$new();
        $ionicModal.fromTemplateUrl('templates/util/modal/stopsImage.html', {
            scope: modalScope,
            animation: 'fcol-modal-noanimation'
        }).then(function(modal) {
            var i = new Image();
            modalScope.stopImage = undefined;
            modalScope.start = function(image) {
                modalScope.stopImage = image;
                i = new Image();
                i.src = modalScope.stopImage;
                i.onload = function(){
                    modal.show();
                };
            };
            modalScope.isShown = function() {
                return modal.isShown();
            };
            modalScope.stop = function() {
                modal.hide();
            };
            modalScope.getStyle = function(){
                return {
                    'background-image': 'url('+modalScope.stopImage+')',
                    'background-repeat': 'no-repeat',
                    'height': i.height+'px',
                    'width': i.width+'px'
                };
            };

            defer.resolve(modalScope);
        });
        return defer.promise;
    };
    service.layer = function() {
        var defer = $q.defer();
        var modalScope = $rootScope.$new();
        ionic.Platform.setPlatform('iOS');
        $ionicPopover.fromTemplateUrl('templates/util/modal/layer.html', {
            scope: modalScope,
            //animation: 'fcol-modal-noanimation'
        }).then(function(modal) {
            var layerboxnames = [];
            modalScope.start = function($event) {
                layerboxnames = [];
                for(var i=0; i<Config.infoNames.length; i++){
                    if(Config.infoNames[i].name!='bar') layerboxnames.push(Config.infoNames[i]);
                }
                modal.show($event);
            };
            modalScope.stop = function() {
                modal.hide();
            };
            modalScope.model = {
                radio: TileService.getCurrentTile()
            };

            modalScope.getTileImage = function(tilename) {
                return TileService.getTileImage(tilename);
            };
            //use tile names from tile service
            modalScope.getTileNames = function() {
                return TileService.getNames();
            };
            modalScope.getFullName = function(tilename) {
                return TileService.getFullName(tilename);
            };
            modalScope.$watch("model.radio", function() {
                TileService.setCurrentTile(modalScope.model.radio);
                if($window.ga) $window.ga.trackEvent('Basemap', 'Changed', modalScope.model.radio);
            });

            modalScope.getFeatureConfig = function() {
                return layerboxnames;
            };
            modalScope.clickToggle = function(item){
                $rootScope.$broadcast("event:featurelayer", item);
                //item.layerbox.checked   true=on,false=off
                //item.name
                if($window.ga) $window.ga.trackEvent('Layer', item.name, item.layerbox.checked);
            };
            defer.resolve(modalScope);
        });
        return defer.promise;
    };

    service.fieldtrip = function(){
        var defer = $q.defer();
        var modalScope = $rootScope.$new();
        ionic.Platform.setPlatform('iOS');
        $ionicModal.fromTemplateUrl('templates/util/modal/fieldtrip.html', {
            scope: modalScope,
            animation: 'fcol-modal-noanimation'
        }).then(function(modal) {
            modalScope.start = function($event) {
                if ($window.ga) $window.ga.trackView('Field trip guide list');
                if( !DataService.get('fieldtripguidesall') || (DataService.get('fieldtripguidesall').length==0) ){
                    IonicUtilService.spinnerWithCancel.start();
                    RequestService.fieldtripguideall().then(function(ret){
                        DataService.set('fieldtripguidesall',ret);
                        reorderContent();
                        IonicUtilService.spinnerWithCancel.stop();
                    },function(error){
                        reorderContent();
                        IonicUtilService.spinnerWithCancel.stop();
                    });
                }else{
                    reorderContent();
                }
                modal.show($event);
            };
            modalScope.doRefresh = function(){
                if( !DataService.get('fieldtripguidesall') || (DataService.get('fieldtripguidesall').length==0) ){
                    RequestService.fieldtripguideall().then(function(ret){
                        DataService.set('fieldtripguidesall',ret);
                        reorderContent();
                        modalScope.$broadcast('scroll.refreshComplete');
                    },function(error){
                        reorderContent();
                        modalScope.$broadcast('scroll.refreshComplete');
                    });
                }else{
                    reorderContent();
                    modalScope.$broadcast('scroll.refreshComplete');
                }
            };
            modalScope.stop = function() {
                modal.hide();
            };
            modalScope.isShown = function() {
                return modal.isShown();
            };

            $ionicPlatform.onHardwareBackButton(function() {
                modal.hide();
            });

            var contentNotInPath = [];
            var contentInPath = [];
            var contentEmpty = false;
            modalScope.isContentEmpty = function(){
                return contentEmpty;
            };
            modalScope.getContentInPath = function(){
                return contentInPath;
            };
            modalScope.getContentNotInPath = function(){
                return contentNotInPath;
            };
            modalScope.isEmpty = function(value){
                if(value) return false;
                else return true;
            };
            modalScope.fieldTripMore = function(item){
                $rootScope.$broadcast("event:button", {name: "fieldtripmore", content: item});
                IonicUtilService.spinner.start();
                modalScope.stop();
            };

            var reorderContent = function(){
                //differentiate content in path or not
                contentInPath = DataService.get('fieldtripguides');
                var contentInPathIDs = [];
                for(var i=0; i<contentInPath.length; i++){
                    contentInPathIDs.push(contentInPath[i].id);
                }
                contentNotInPath = [];
                var content = DataService.get('fieldtripguidesall');
                for(var i=0; i<content.length; i++){
                    if( contentInPathIDs.indexOf(content[i].id)==-1) contentNotInPath.push(content[i]);
                }
                if(content.length===0) contentEmpty=true;
                else contentEmpty = false;

                var phase = modalScope.$root.$$phase;
                if (phase == '$apply' || phase == '$digest') return;
                modalScope.$apply();
            };
            defer.resolve(modalScope);
        });
        return defer.promise;
    };
    return service;
});
