app.filter('DataFormater', function () {
    return function (type, data, name, title, imgid) {
    	data['SourceFrom'] = type;
    	if(name) data['TaxonName'] = name;
    	if(title) {data['WikiDataTitle'] = title;
        	data['Url'] = "https://en.m.wikipedia.org/wiki/" + data.WikiDataTitle;
    	}
        if(imgid) data['ImgSrc'] = "https://paleobiodb.org/data1.2/taxa/thumb.png?id="+imgid;
        return data;
    }
});
