app.factory('IonicUtilService', function($ionicLoading, $ionicPopup, $rootScope) {
    var service = {};
    service.spinner = {
        start: function() {
            $ionicLoading.show({
                content: 'Loading Data',
                animation: 'fade-in',
                maxWidth: 200,
                showDelay: 500,
                noBackdrop: false
            });
        },
        stop: function() {
            $ionicLoading.hide();
        }
    };
    service.spinnerWithCancel = {
        start: function() {
            $ionicLoading.show({
                template: '<ion-spinner></ion-spinner><br/><br/><button class="button button-clear" style="color:white; line-height: normal; min-height: 0; min-width: 0;" ng-click="spinnerClick()"><i class="ion-close-circled"></i></button> Loading...',
                animation: 'fade-in',
                scope: $rootScope,
                maxWidth: 200,
                showDelay: 500,
                noBackdrop: false
            });
        },
        stop: function() {
            $ionicLoading.hide();
        }
    };
    $rootScope.spinnerClick = function(){
        $rootScope.$broadcast("event:button", {name:'spinner'});
    }
    service.errorAlert = {
        start: function(title, message, errorarray, ok){
            var len = errorarray.length;
            var template = "";
            for(var i=0; i <len; i++){
                template+="<li><a class='ion ion-close-circled'></a>"+ errorarray[i] +"</li>";
            }
            template = "<ul>"+template+"</ul>";
            template += message;
            $ionicPopup.alert({
                title: title,
                template: template
            }).then(function(res) {
                if(ok) ok();
            });

        }
    };
    service.alert = {
        start: function(title, message, ok) {
            $ionicPopup.alert({
              title: title,
              template: message,
            }).then(function(res){
                if(ok) ok();
            });
        }
    };
    service.confirm = {
        start: function(title, errorarray, message, yes, no, okText, cancelText){
            var len=errorarray.length;
            var template="";
            for(var i=0; i <len; i++){
                template+="<li><a class='ion ion-close-circled'> </a> "+errorarray[i]+"</li>";
            }
            template="<ul>"+template+"</ul>"
            template+=message;
            $ionicPopup.confirm({
                title: title,
                template: template,
                okText: okText||"OK",
                cancelText: cancelText||"Cancel"
            }).then(function(res) {
                if(res) {
                    if(yes) yes();
                } else {
                    if(no) no();
                }
            });
        }
    };
    service.toast = {
        start: function(messagearray){
            var len=messagearray.length;
            var template = "";
            for(var i=0; i <len; i++){
                template+="<li>"+messagearray[i]+"</li>";
            }
            template="<ul>"+template+"</ul>"
            $ionicLoading.show({
                template: template,
                noBackdrop: true,
                duration: 2000
            });
        }
    };
    return service;
});
