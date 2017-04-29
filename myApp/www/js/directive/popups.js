/* inspired by ionic-pullup (http://arielfaur.github.io/ionic-pullup/) */
app.constant('ionPullupState', {
    COLLAPSED: 'COLLAPSED',
    MINIMIZED: 'MINIMIZED',
    EXPANDED: 'EXPANDED',
    HIDED: 'HIDED'
});

app.directive('ionPullup', function($timeout, $rootScope, $window, $ionicPlatform, ionPullupState) {
    return {
        restrict: 'AE',
        controller: function($scope, $element, $attrs) {
            var
                headerHeight = 0,
                handleHeight = 0,
                barHeight = 0,
                contentelem = undefined,
                color = $attrs.bgcolor || "#f9f9f9";
                pullup = {
                    curPosY: 0,
                    height: 0,
                    posY: 0,
                    state: ionPullupState.COLLAPSED,
                    maxHeight: parseInt($attrs.maxHeight, 10) || 0,
                    initialState: $attrs.initialState ? $attrs.initialState.toUpperCase() : ionPullupState.HIDED
                };

            this.bgcolor = color;
            function init() {
                headerHeight = document.querySelector('.bar-header') ? document.querySelector('.bar-header').offsetHeight : 0;
                $element.css({
                    'position': 'absolute',
                    'bottom': "0",
                    'width':'100%',
                    'transition': '300ms ease-in-out',
                    'padding': '0',
                    'display': 'block',
                });
            };
            function updateUI() {
                $timeout(function() {
                    computeHeights();
                }, 300);
            };
            function computeHeights() {
                pullup.height = pullup.maxHeight > 0 ? pullup.maxHeight : $window.innerHeight- headerHeight;
                $element.css({ 'height': pullup.height + 'px' });
                if (pullup.initialState == ionPullupState.MINIMIZED) {
                    minimize();
                } else if (pullup.initialState == ionPullupState.EXPANDED) {
                    expand();
                } else if (pullup.initialState == ionPullupState.COLLAPSED){
                    collapse();
                }else{
                    hide();
                }
            };
            function resetContentHeight() {
                //console.log("curPosY:", pullup.curPosY)
                if (pullup.curPosY < 0) pullup.curPosY = 0;
                var height = pullup.height - pullup.curPosY - barHeight;
                angular.element(contentelem).css({ height: height + "px" });
                //console.log("height:", height);
            };
            function expand() {
                pullup.curPosY = pullup.height-200;
                $element.css({
                    '-webkit-transform': 'translate3d(0, ' + pullup.curPosY + 'px, 0)',
                    'transform': 'translate3d(0, ' + pullup.curPosY + 'px, 0)'
                });
                resetContentHeight();
                pullup.state = ionPullupState.EXPANDED;
            };
            function collapse() {
                pullup.curPosY = pullup.height - barHeight;
                $element.css({
                    '-webkit-transform': 'translate3d(0, ' + pullup.curPosY + 'px, 0)',
                    'transform': 'translate3d(0, ' + pullup.curPosY + 'px, 0)'
                });
                pullup.state = ionPullupState.COLLAPSED
            };
            function minimize() {
                pullup.curPosY = pullup.height;
                $element.css({
                    '-webkit-transform': 'translate3d(0, ' + pullup.curPosY + 'px, 0)',
                    'transform': 'translate3d(0, ' + pullup.curPosY + 'px, 0)'
                });
                pullup.state = ionPullupState.MINIMIZED;
            };
            function hide() {
                pullup.curPosY = pullup.height + handleHeight;
                $element.css({
                    '-webkit-transform': 'translate3d(0, ' + pullup.curPosY + 'px, 0)',
                    'transform': 'translate3d(0, ' + pullup.curPosY + 'px, 0)'
                });
                pullup.state = ionPullupState.HIDED;
            };
            this.setHandleHeight = function(height) {
                handleHeight = height;
                computeHeights();
            };
            this.getHandleHeight= function(){
                return handleHeight;
            }
            this.setBarHeight = function(height) {
                barHeight = height;
            };
            this.setContent = function(element){
                contentelem = element;
            };
            this.getBarHeight = function(){
                return barHeight;
            };

            this.onTap = function(e) {
                e.gesture.srcEvent.preventDefault();
                e.gesture.preventDefault();
                if (pullup.state == ionPullupState.COLLAPSED) {
                    expand();
                } else if (pullup.state == ionPullupState.MINIMIZED) {
                    expand();
                } else {
                    collapse();
                }
            };
            this.onDrag = function(e) {
                e.gesture.srcEvent.preventDefault();
                e.gesture.preventDefault();

                switch (e.type) {
                    case 'dragstart':
                        $element.css('transition', 'none');
                        break;
                    case 'drag':
                        pullup.posY = Math.round(e.gesture.deltaY) + pullup.curPosY;
                        $element.css({
                            '-webkit-transform': 'translate3d(0, ' + pullup.posY + 'px, 0)',
                            'transform': 'translate3d(0, ' + pullup.posY + 'px, 0)'
                        });
                        break;
                    case 'dragend':
                        if (pullup.posY >= (pullup.height-barHeight)) {
                            pullup.posY = pullup.height;
                            pullup.state = ionPullupState.MINIMIZED;
                        }else if (pullup.posY < 0) {
                            pullup.posY = 0;
                            pullup.state = ionPullupState.EXPANDED;
                        }else {
                            pullup.state = ionPullupState.EXPANDED;
                        }
                        pullup.curPosY = pullup.posY;
                        $element.css({
                            'transition': '300ms ease-in-out',
                            '-webkit-transform': 'translate3d(0, ' + pullup.curPosY + 'px, 0)',
                            'transform': 'translate3d(0, ' + pullup.curPosY + 'px, 0)'
                        });
                        break;
                }
                resetContentHeight();
            };
            init();


            $scope.on = function(){
                if (pullup.state != ionPullupState.EXPANDED){
                    expand();
                }
            };
            $scope.off = function(){
                hide();
            };

            $scope.$on("event:pullup", function(event, value){
                if(value.status==="on"){
                    $scope.on();
                }else{
                    $scope.off();
                }
            });

            $ionicPlatform.ready(function() {
                $window.addEventListener('orientationchange', updateUI);
            });
        }
    }
});
app.directive('ionPullupHandle', function($ionicGesture, $window) {
    return {
        restrict: 'AE',
        require: '^ionPullup',
        link: function(scope, element, attrs, controller) {
            var height = parseInt(attrs.height, 10) || 25;
            width = parseInt(attrs.width, 10) || 100;
            var offset = parseInt(attrs.position, 10) || 0;
            controller.setHandleHeight(height);
            element.addClass("fc-pullup-handle");
            element.css({
                'top': (-height+1) + 'px',
                'left': (($window.innerWidth - width) / 2)+ offset + 'px',
                'height': height + 'px',
                'width': width + 'px',
            });
            $ionicGesture.on('tap', controller.onTap, element);
            $ionicGesture.on('drag dragstart dragend', controller.onDrag, element);
        }
    }
});
app.directive('ionPullupBody', function() {
    return {
        restrict: 'AE',
        require: '^ionPullup',
        link: function(scope, element, attrs, controller) {
            element.addClass("fc-pullup-body");
            element.css({
                'top': (-controller.getHandleHeight()+1)+'px'
            });
        }
    }
});

app.directive('pullupHeader', ['$ionicGesture', function($ionicGesture) {
    return {
        restrict: 'A',
        scope: false,
        require: '^ionPullup',
        link: function(scope, element, attrs, controller) {
            var height = parseInt(attrs.height, 10) || 44;
            controller.setBarHeight(height);
            element.addClass("fc-pullup-bar")
            element.css({
                'height': height + 'px'
            });
            $ionicGesture.on('tap', controller.onTap, element);
            $ionicGesture.on('drag dragstart dragend', controller.onDrag, element);
        }
    }
}]);
app.directive('pullupContent', function() {
    return {
        restrict: 'A',
        scope: false,
        require: '^ionPullup',
        link: function(scope, element, attrs, controller) {
            controller.setContent(element);
            var height = controller.getBarHeight();
            element.css({
                'bottom': '0'
            });
        }
    }
});


app.directive('popup', function($rootScope, Config, State, Modal, $location, $state, $ionicScrollDelegate, $timeout, Util) {
    return {
        restrict: 'E',
        scope: {},
        templateUrl: 'templates/util/popup.html',
        controller: function($scope, $element, $attrs){
            var title = undefined;
            var name = undefined;
            var url = undefined;
            var content = undefined;
            var addnumber = 10;
            var maxnumber = 10;
            var showContent=false;
            var scrollmore = true;
            var stopID = undefined;
            var stopimagemodal = undefined;
            var backbutton = false;

            $scope.isBackButton = function(){
                return backbutton;
            };
            $scope.loadMore = function(){
                $timeout(function() {
                    maxnumber+=addnumber;
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                }, 1000);
            };
            $scope.show = function(id){
                if(id < maxnumber) return true;
                else return false;
            };
            $scope.getTitle = function(){
                return title;
            };
            $scope.setTitle = function(name){
                for(var i=0; i< Config.infoNames.length; i++){
                    var item = Config.infoNames[i];
                    if(item.name===name){
                        title = item.popup.title;
                        return;
                    }
                }
            };
            $scope.formatNumber = function(value) {
                var digits = 1;
                if(typeof value == 'number'){
                    return parseFloat(Math.round(value * 10) / 10).toFixed(digits);
                }else if(typeof value == 'string'){
                    return parseFloat(value).toFixed(digits);
                }else return value;
            }
            $scope.getUrl = function(){
                return url;
            };
            $scope.getContent = function(){
                return content;
            };
            $scope.isTrip = function(bool){
                return State.isTrip(bool);
            };
            $scope.toUrl = function(title) {
                $rootScope.$broadcast("event:loadwiki", title);
            };
            $scope.isEmpty = function(value){
                if(value) return false;
                else return true;
            };
            $scope.delete = function (){
                $rootScope.$broadcast("event:button", {name: "popoverdelete"});
            };


            $scope.setCollapsed = function(item){
                if(!item.collapsed) {
                    item["collapsed"] = true;
                }else{
                    item.collapsed = !item.collapsed;
                }
                return item.collapsed;
            };

            $scope.getCollapsed = function(item){
                return item.collapsed;
            };
            $scope.showContent = function (){
                return showContent;
            };
            $scope.findOnMap = function(stop){
                $rootScope.$broadcast("event:feature", stop.id);
            };
            $scope.imgClicked = function(image){
                if(stopimagemodal){
                    stopimagemodal.start(image);
                }
            };
            $scope.backToFieldLists = function(){
                if(Config.fieldModal) Config.fieldModal.start();
            };
            $scope.scrollMe = function() {
                if(stopID&&content&&content.stops){
                    if(angular.element(document.querySelector("#"+stopID))[0]){
                        var contentDiv = angular.element(document.querySelector("#pullupContent"));
                        var stopDiv = angular.element(document.querySelector("#"+stopID));
                        var stopRect = stopDiv[0].getBoundingClientRect();
                        var contentRect = contentDiv[0].getBoundingClientRect();
                        var stopOffset = stopRect.top- contentRect.top;
                        $ionicScrollDelegate.$getByHandle('pullupscrollhandle').scrollBy(0, stopOffset);
                    }
                }
            };

            $scope.getFigureByID = function(id){
                if(content&&content.figures){
                    for(var i=0; i<content.figures.length; i++){
                        if(content.figures[i].identifier==id){
                            return content.figures[i];
                        }
                    }
                }
                return null;
            };
            $rootScope.$on("event:popupoff", function() {
                $scope.$broadcast("event:pullup", {status:"off",  value: 1});
                name=undefined;
                url = undefined;
                content = undefined;
                title = undefined;
                maxnumber = 10;
                stopID = undefined;

                var phase = $scope.$root.$$phase;
                if (phase == '$apply' || phase == '$digest') return;
                $scope.$apply();
            });
            $rootScope.$on("event:popupon", function(evt, value) {
                showContent=false;
                $ionicScrollDelegate.$getByHandle('pullupscrollhandle').scrollTop();
                $scope.$broadcast("event:pullup", {status:"on", value: 1});
                name = value.type;
                url = 'templates/util/popup/'+name+'.html';
                content = value.content;
                var anchor = value.anchor;
                stopimagemodal= value.modal;
                if(value.back){
                    backbutton = value.back;
                }else{
                    backbutton = false;
                }
                maxnumber = 10;
                $scope.setTitle(name);

                if(content&&content.sections){
                    for(var i=0; i<content.sections.length; i++){
                        content.sections[i].text = Util.toHtml(content.sections[i].text);
                    }
                }

                if(content&&content.stops){
                    for(var i=0; i<content.stops.length; i++){
                        content.stops[i].text = Util.toHtml(content.stops[i].text);
                    }

                    if(anchor){
                        stopID = "stop-" + anchor;
                        for(var i=0; i< content.stops.length; i++){
                            if(content.stops[i].id == anchor ){
                                content.stops[i]["collapsed"]=true;
                            }else{
                                content.stops[i]["collapsed"]=false;
                            }
                        }
                    }else{
                        stopID = "stop-" + anchor;
                        for(var i=0; i< content.stops.length; i++){
                            content.stops[i]["collapsed"]=false;
                        }
                    }
                }

                showContent=true;
                var phase = $scope.$root.$$phase;
                if (phase == '$apply' || phase == '$digest') return;
                $scope.$apply();

                $timeout(function() {
                    $scope.scrollMe();
                }, 400);
            });

            $scope.isScrollMore = function(){
                return scrollmore;
            };
        }
    };
});
