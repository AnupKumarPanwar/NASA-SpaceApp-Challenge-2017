app.controller('SavedCtrl', function($scope, DB, $rootScope, Config, $state, $timeout, IonicUtilService, Message, $ionicListDelegate, $ionicHistory, DataService) {
    $ionicHistory.nextViewOptions({
        disableBack: true
    })
    $scope.infoList=[];
    var loadSuccess = function(){
        $state.go("app.map");
        $rootScope.$broadcast('event:loadmap', null);
    };
    var isEmpty = false;
    var loadFail = function(e){
        IonicUtilService.spinner.stop();
        alert(e);
    };
    var loadList= function(){
        if(Config.isCurrentDB(1)){
            DB.load.infolist().then(function(data){
                $scope.infoList = data;
                if ($scope.infoList.length===0)
                  isEmpty = true
                else {
                  isEmpty = false
                };
            }, loadFail);
        }
    };
    $scope.load = function(info){
        IonicUtilService.spinner.start();
        DataService.resetAll();
        DB.load.infocontent(info.name).then(function(data){
            IonicUtilService.spinner.stop();
            DataService.set('id', info.name);
            DataService.set('info', info);
            DataService.set('macro', data[0]);
            DataService.set('ocean', data[1]);
            DataService.set('junin', data[2]);
            DataService.set('neotoma',data[3]);
            DataService.set('wiki',data[4]);
            DataService.set('pbdb',data[5]);
            DataService.set('lac',data[6]);
            DataService.set('nepgpx',data[7]);
            DataService.set('neplogger',data[8]);
            DataService.set('nepinreach',data[9]);
            DataService.set('fieldtripguide',data[10]);
            loadSuccess();
        }, loadFail );
    };

    $scope.isInfolistEmpty = function() {
      return isEmpty
    };

    var deleteSuccess =function(index){
        IonicUtilService.toast.start(["Deleted!"]);
        var front = $scope.infoList.slice(0, index);
        var rear = $scope.infoList.slice(index+1);
        $scope.infoList= front.concat(rear);
    };
    var deletedFail =function(e){
        IonicUtilService.spinner.stop();
        IonicUtilService.toast.start([e]);
    };
    $scope.delete = function(info, index){
        IonicUtilService.confirm.start("Delete Path?", [], "", function() {
            IonicUtilService.spinner.start();
            DB.remove.infocontent(info.name).then(function(){
                IonicUtilService.spinner.stop();

                deleteSuccess(index);
            }, deletedFail );
        },function(){

        });
    };

    $scope.deleteAll=function(){
        IonicUtilService.confirm.start(Message.MODAL.CONFIRM.DELETEALL.TITLE, [], Message.MODAL.CONFIRM.DELETEALL.MESSAGE, function(){
            if(Config.isCurrentDB(1)){
                IonicUtilService.spinner.start();
                DB.remove.all().then(function(){
                    IonicUtilService.spinner.stop();
                    IonicUtilService.toast.start(['Deleted']);
                },function(e){
                    IonicUtilService.spinner.stop();
                    IonicUtilService.toast.start(['Delete fails']);
                });
                loadList();
            }
        });
    };

    loadList();
});
