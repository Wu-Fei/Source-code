var dataContext = {
	host: 'http://eclasso2o.azurewebsites.net',
//	host: 'http://localhost:56360',

	connection: true,
    islocal: false,
    isconnected: true
};


dataContext.manager = new breeze.EntityManager(dataContext.host + '/breeze/eClassO2OApi');

dataContext.create = function(modelname) {
	return dataContext.manager.createEntity(modelname);
};

dataContext.save = function(entity) {
	dataContext.manager.attachEntity(entity, entity.entityAspect.entityState);
	return dataContext.manager.saveChanges();
};

dataContext.rejectChanges = function() {
	dataContext.manager.rejectChanges();
};

dataContext.getAccessToken = function() {
	return localStorage.accessToken;
};

dataContext.setAccessToken = function(accessToken) {
	localStorage.accessToken = accessToken;
	breeze.NamingConvention.camelCase.setAsDefault();
	var ajaxAdapter = breeze.config.getAdapterInstance('ajax');
	ajaxAdapter.defaultSettings = !accessToken ? {} : {
		beforeSend: function (xhr, settings) {
			if (xhr) {
				xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken);
			}
		}
	};
};

dataContext.makeQuery = function(query, callback) {
	dataContext.manager.executeQuery(query).then(function(result) {
		console.log('query result', result);
		if (result && $.isArray(result.results)) {
			callback(result.results);
		} else {
			callback(null);
		}
	}, function(err) {
		console.log('query erro', err);
		callback(null);
	});
};

dataContext.getCurrentUser = function(callback) {
	var query = breeze.EntityQuery.from('currentUser');
	dataContext.makeQuery(query, function(result) {
		callback(result && result.length > 0 ? result[0] : null);
	});
};

dataContext.getClass = function(callback) {
	var query = breeze.EntityQuery.from("Classes");
	dataContext.makeQuery(query, callback);
};

dataContext.searchQuestion = function(search, callback) {
	var query = breeze.EntityQuery.from("Questions")
					.where("QuestionDetail", "contains", search)
					.orderBy("Create DESC");
	dataContext.makeQuery(query, callback);
};

dataContext.signin = function(username, password, callback) {
	$.post(dataContext.host + '/token', {
		grant_type: 'password',
		username: username,
		password: password
	}).fail(function (err) {
		callback(err && err.responseJSON && err.responseJSON.error_description ? err.responseJSON.error_description : null);
	}).done(function (result) {
		if (result.access_token) {
			dataContext.setAccessToken(result.access_token);
			dataContext.getCurrentUser(callback);
		} else {
			callback(null);
		}
	});
};

dataContext.signout = function(callback) {
	dataContext.setAccessToken('');
	callback();
};

dataContext.register = function(username, password, name, email, phone, callback, errcallback) {
	return $.ajax({
		url: dataContext.host + '/api/account/register',
		type: 'POST',
		dataType: 'json',
		data: {
			'userName': username,
			'password': password,
			'confirmPassword': password,
			'name': name,
			'email': email,
			'phone': phone,
			'role': 'S'
		}
	}).fail(function(err) {
		errcallback('Failed to register user.');
	}).done(function(result) {
		if (result && result.result === 'Success') {
			callback();
		} else {
			errcallback('Failed to register user.');
		}
	});
};
