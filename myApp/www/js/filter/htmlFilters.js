app.filter('HtmlFilter', function(){
    return function (data) {
        var markup = data.parse.text["*"];
        var html = "";
        angular.forEach(markup, function(value, key) {
            html += value;
        });
        return html;
    }
});
app.filter('HyperlinkFilter', function(){
	return function (html) {
    	var htmlElem =angular.element("<div>"+html+"</div>");
        var selected = htmlElem.find("span");
        var len = selected.length;
        for(var i=0; i<len; i++){
            var value = angular.element(selected[i]);
            if (value.text() === "Edit") {
                value.remove();
            }else{
                value.replaceWith(value.html());
            }
        }
        return htmlElem.html();
    }
});
app.filter('CompressFilter', function(){
	return function (html) {
		html = html.replace(/\n/g,'');
        return html;
    }
});
app.filter('StubFilter', function(){
	return function (html) {
		var htmlElem = angular.element("<div>"+html+"</div>");
        var selected = htmlElem.find("table");
        var len = selected.length;
        for(var i=0; i<len; i++){
            var value = angular.element(selected[i]);
            if(value.hasClass("plainlinks")){
                value.remove();
            }
        }
        return htmlElem.html();
    }
});
app.filter('ImageFilter', function(){
    return function (html) {
        var htmlElem = angular.element("<div>"+html+"</div>");
        var selected = htmlElem.find("img");
        var len = selected.length;
        for(var i=0; i<len; i++){
            var value = angular.element(selected[i]);
            value.remove();
        }
        return htmlElem.html();
    }
});
app.filter('RedirectFilter', function(){
    return function (html) {
        var htmlElem = angular.element("<div>"+html+"</div>");
        var selected = htmlElem.find("ul");
        var len = selected.length;
        for(var i=0; i<len; i++){
            var value = angular.element(selected[i]);
            if(value.hasClass("redirectText")){
                return value.text();
            }
        }
        return undefined;
    }
});
