'use strict';

app.factory('$config', [function(){
	
	var isDebug = true;

	var debug = '//localhost:7000';
	var production = '//';

	return {
		server: (isDebug) ? debug : production,
	}
}]);