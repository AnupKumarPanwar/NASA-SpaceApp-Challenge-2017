app.factory('Popover', ['$ionicPopup', function($ionicPopup) {
    var service = {};
    service.start = function(modalScope, yes, no) {
        modalScope.data={};
        $ionicPopup.show({
            title: 'Save location?',
            template:[
            '<div class="list">',
                '<label class="item item-input">',
                    '<input type="text" placeholder="Name" ng-model="data.name">',
                '</label>',
                '<label class="item item-input">',
                    '<textarea placeholder="Description" ng-model="data.description"></textarea>',
                '</label>',
            '</div>'].join(''),
            scope: modalScope,
            buttons: [{
                text: 'Cancel',
                onTap: function(e) {
                    if(no) no();
                }
            }, {
                text: 'Save',
                type: 'button-positive',
                onTap: function(e) {
                    if(yes) yes(modalScope.data);
                }
            }]
        });
    };
    return service;
}]);
