app.controller('WthCtrl', function($scope, $window, $stateParams) {

  $scope.getContent = function() {
    return content;
  };
  $scope.openInExternalBrowser = function(){
    console.log('sfdssdf')
   window.open('http://rocksfromabove.blogspot.com/','_system');
  };

  var formatContent = function() {
		var array = [];
    for (var i = 0; i < content.length; i += 2) {
      var firstitem = content[i];
      var seconditem = content[i + 1];
      array.push([firstitem, seconditem]);
    }
    content = array;
  };

  var content = [
    {
      id: "river",
      title: "River or stream",
      img: "img/RFA/list/sectionRiver.jpg",
    },
    {
      id: "lake",
      title: "Lake or coastline",
      img: "img/RFA/list/sectionLakeCoastal.jpg",
    },
    {
      id: "mount",
      title: "Mountain, hill or ridge",
      img: "img/RFA/list/sectionMount.jpg",
    },
    {
      id: "can",
      title: "Valley or canyon",
      img: "img/RFA/list/sectionValley.jpg",
    },
    {
      id: "dune",
      title: "Pattern of sand or debris",
      img: "img/RFA/list/sectionSand.jpg",
    },
    {
      id: "land",
      title: "Whole landscape",
      img: "img/RFA/list/sectionLand.jpg",
    },
    {
      id: "human",
      title: "Human-made landscape",
      img: "img/RFA/list/sectionHuman.jpg",
    },
    {
      id: "crops",
      title: "Crops",
      img: "img/RFA/list/sectionCrops.jpg",
    },
    {
      id: "colors",
      title: "Bizzare colors",
      img: "img/RFA/list/sectionColors.jpg",
    },
    {
      id: "other",
      title: "Other",
      img: "img/RFA/list/sectionOther.jpg",
    }
  ];

  formatContent();
  if ($window.ga) {
    $window.ga.trackView('What is that?');
  }
});
