app.factory('Util', function() {
    var service = {};
    service.cutPointDigitsInPolygon = function(polygon) {
        for(var i=0; i<polygon.geometry.coordinates[0].length; i++){
            var array= polygon.geometry.coordinates[0][i];
            array[0] = parseInt(array[0]*Math.pow(10, 2))/Math.pow(10, 2);
            array[1] = parseInt(array[1]*Math.pow(10, 2))/Math.pow(10, 2);
        }
    };
    service.lingstring2Arc = function(startcoord, endcoord) {
        var end = { x: endcoord[0], y: endcoord[1] };
        var start = { x: startcoord[0], y: startcoord[1] };
        var generator = new arc.GreatCircle(start, end, { name: undefined });
        var line = generator.Arc(100, { offset: 10 });
        var feature = line.json();
        return feature;
    };
    service.formatCoords = function(coords) {
        var retcoords=[coords[0], coords[1]];
        var v = (retcoords[0]>0)?-360:360;
        while(retcoords[0]<-180 || retcoords[0]>180){
            retcoords[0]+=v;
        }
        return retcoords;
    };
    service.isSameCoords = function(coords1, coords2){
        if(coords1[0]===coords2[0] && coords1[1]===coords2[1]) return true;
        else return false;
    };
    service.getCenterWithHeading = function(mapsize, position, rotation, resolution, percentage) {
        var height = mapsize[1];
        var width = mapsize[0];
        return [
            position[0] - percentage * width * resolution,
            position[1]
        ];
    };
    service.math = {
        mod: function(n){
            return ((n % (2 * Math.PI)) + (2 * Math.PI)) % (2 * Math.PI);
        },
        degToRad: function(deg){
            return deg * Math.PI * 2 / 360;
        }
    };
    service.toHtml = function(str){
        str = str.replace(new RegExp('\r?\n','g'), '<br>');
        return str;
    };

    return service;
});