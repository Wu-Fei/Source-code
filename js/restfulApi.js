var restfulApi = {
};



restfulApi.host = 'http://eclasso2o.azurewebsites.net';
restfulApi.caller = new breeze.EntityManager(restfulApi.host + '/breeze/eClassO2OApi');
breeze.NamingConvention.camelCase.setAsDefault();

restfulApi.registerUser = function(username, password, name, email, phone, okFunc, errFunc) {
	$.ajax({
		url : restfulApi.host + '/api/account/register',
		type : 'POST',
		dataType : 'json',
		data: {
			'userName': username,
			'password': password,
			'confirmPassword': password,
			'name': name,
			'email': email,
			'phone': phone
        }
	}).fail(errFunc).done(okFunc);
};

restfulApi.login = function(username, password, okFunc, errFunc) {
	$.ajax({
		url : restfulApi.host + '/token',
		type : 'POST',
		dataType : 'json',
		data: {
			'grant_type': 'password',
			'username': username,
			'password': password
        }
	}).fail(function(res){
		errFunc(res.responseJSON && res.responseJSON.error_description
			? res.responseJSON.error_description
			: 'Failed to login.');
	}).done(function(result) {
		if (result.access_token) {
			var auth = 'Bearer ' + result.access_token;
			breeze.config.getAdapterInstance('ajax').defaultSettings = {
				headers: {'Authorization': auth}
			};
			okFunc();
		} else {
			errFunc(result.error_description || 'Failed to login.');
		}
	});
};

restfulApi.logout = function() {
	breeze.config.getAdapterInstance('ajax').defaultSettings = {
		headers: {}
	};
};

restfulApi.getClass = function(okFunc, errFunc) {
	var query = breeze.EntityQuery.from("Classes");
	restfulApi.caller.executeQuery(query)
		.fail(errFunc).done(okFunc);
};