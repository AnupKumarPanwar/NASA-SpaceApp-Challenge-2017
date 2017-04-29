
app.filter('Base64Filter', function(){
	return function (arraybuffer) {
		try{
	        var arr = new Uint8Array(arraybuffer);
	        var raw = String.fromCharCode.apply(null, arr);
	        var b64 = btoa(raw);
	        var value = "data:image/jpeg;base64," + b64;
	        return value;
    	}catch(e){
    		return null;
    	}
    }
});
