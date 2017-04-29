app.directive('fcButton', ['$rootScope', function($rootScope) {
    return {
        restrict: 'E',
        scope:{},
        template: [
        '<div ng-show="visible()" ng-class="classes()" ng-click="click()" on-hold="click()">',
            '<i ng-class="icon()">{{text()}}</i>',
        '</div>'].join(''),
        controller: function($scope, $element, $attrs) {
            var classes = $attrs.classes||"";
            var text = $attrs.text||"";
            var icon = $attrs.icon||"";
            var visible = true;
            var click = undefined;
            var reset = undefined;
            var disable = false;

            this.setDisabled = function(dis){
                disable = dis;
                var phase = $scope.$root.$$phase;
                if (phase == '$apply' || phase == '$digest') return;
                $scope.$apply();
            };
            this.getDisabled = function(){
                return disable;
            };
            this.resetButton =function(){
                if(reset) reset();
            };
            this.setReset = function(fn){
                reset=fn;
            };
            this.currentState = function(){
                if(angular.element($element.children()[0]).hasClass("gray")) return 0;
                else if(angular.element($element.children()[0]).hasClass("active")) return 2;
                else return 1;
            };
            this.setClasses = function(state){
                classes = "";
                switch(state){
                    case 0: classes = classes+" gray"; break;
                    case 1: classes = classes+" "; break;
                    case 2: classes = classes+" active";break;
                }
                var phase = $scope.$root.$$phase;
                if (phase == '$apply' || phase == '$digest') return;
                $scope.$apply();
            };
            this.setClick = function(fn){
                click=fn;
            };
            this.setVisible = function(v){
                visible=v;
                var phase = $scope.$root.$$phase;
                if (phase == '$apply' || phase == '$digest') return;
                $scope.$apply();
            };
            $scope.visible= function(){
                return visible;
            };
            $scope.text= function(){
                return text;
            };
            $scope.classes= function(){
                return classes;
            };
            $scope.click= function(){
                if(click) click();
            };
            $scope.icon= function(){
                return icon;
            }
        }
    };
}]);

app.directive('hasState', ['$rootScope', function($rootScope) {
    return {
        restrict: 'AE',
        require: '^fcButton',
        link: function(scope, element, attrs, controller) {
            var pressed = false;
            var name = attrs.name||"";

            controller.setReset(function(){
                pressed = false;
            });

            scope.$watch(function(){return controller.getDisabled();}, function(){
                if(controller.getDisabled()){
                    controller.setClasses(0);
                }else{
                    if(pressed) controller.setClasses(2);
                    else controller.setClasses(1);
                }
            });

            $rootScope.$on("event:navoff", function(evt){
                if(controller.currentState()==2){
                    controller.setClasses(1);
                    pressed = false;
                }
            });

            controller.setClick(function(){
                if(controller.getDisabled()){
                    controller.setClasses(0);
                }else{
                    if(pressed){
                        controller.setClasses(1);
                    }else{
                        controller.setClasses(2);
                    }
                }
                pressed = !pressed;
                $rootScope.$broadcast('event:button', {name:name, state: pressed });
            });
        }
    };
}]);
app.directive('noState', ['$rootScope', function($rootScope) {
    return {
        restrict: 'AE',
        require: '^fcButton',
        link: function(scope, element, attrs, controller) {
            var name = attrs.name||"";
            controller.setClick(function(){
                $rootScope.$broadcast('event:button', {name: name});
            });

            scope.$watch(function(){return controller.getDisabled();}, function(){
                if(controller.getDisabled()){
                    controller.setClasses(0);
                }else{
                    controller.setClasses(1);
                }
            });
        }
    };
}]);
app.directive('gpsTriggered', ['$rootScope', 'State', function($rootScope, State) {
    return {
        restrict: 'AE',
        require: '^fcButton',
        link: function(scope, element, attrs, controller) {
            scope.$watch(State.getGPS, function(){
                if(State.isGPS(0)){
                    console.log("button--->when gps: 0")
                    controller.resetButton();
                    controller.setDisabled(true);
                    controller.setVisible(false);
                }else if(State.isGPS(2)){
                    console.log("button--->when gps: 2")
                    controller.setDisabled(true);
                    controller.setVisible(true);
                }else{
                    console.log("button--->when gps: 1")
                    controller.setDisabled(false);
                    controller.setVisible(true);
                }
            });
        }
    };
}]);
app.directive('stateTriggered', ['$rootScope', 'State', function($rootScope, State) {
    return {
        restrict: 'AE',
        require: '^fcButton',
        link: function(scope, element, attrs, controller) {
            var state = attrs.state;
            $rootScope.$watch(State.getButton, function(){
                controller.setVisible(state==State.getButton());
            });
        }
    };
}]);
