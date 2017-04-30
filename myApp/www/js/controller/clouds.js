app.controller('CloudsCtrl', function($scope, $window) {
 
   startApp.set({ /* params */
    "action": "ACTION_SEND",
    "package": "com.google.android.stardroid",
    "type": "text/plain"
   }, {
    "android.intent.extra.TEXT":"Text..."
   }).start();

   $scope.launch=function()
   {
        startApp.set({ /* params */
         "action": "ACTION_SEND",
         "package": "com.google.android.stardroid",
         "type": "text/plain"
        }, {
         "android.intent.extra.TEXT":"Text..."
        }).start();
   }
});
