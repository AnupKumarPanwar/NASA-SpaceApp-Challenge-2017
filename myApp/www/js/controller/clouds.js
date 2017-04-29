app.controller('CloudsCtrl', function($scope, $window) {
    $scope.getContent = function() {
        return content;
    };
    $scope.openInExternalBrowser = function(){
     window.open('http://www.kennyblumenfeld.com/','_system');
    };
    var content = [{
        id: 1,
        title: "Clouds, and how to know them",
        imgs: ["img/RFA/list/sectionLakeCoastal.jpg"],
    }, {
        id: 2,
        title: "Know your clouds",
        imgs: ["img/RFA/list/sectionLakeCoastal.jpg"],
    }, {
        id: 3,
        title: "More information to make you cloud-smarter",
        imgs: ["img/RFA/list/sectionLakeCoastal.jpg"],
    }];

    if ($window.ga) {
        $window.ga.trackView('Clouds');
    }
});
