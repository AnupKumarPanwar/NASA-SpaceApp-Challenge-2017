app.controller('WikiCtrl', ['$scope', 'DataService', '$sce', '$filter', function($scope, DataService, $sce, $filter) {
	var wiki = {
		title: undefined,
		html: undefined
	};
	$scope.getWiki=function(){
		var object = DataService.get('article.wikiarticle');
		if(!object){
			wiki.title= "Error";
			wiki.html="Sorry, you cannot query this page!";
		}else{
			wiki.title = object.title;
			wiki.html = $sce.trustAsHtml(object.html);
		}
		return wiki;
	};
}]);
