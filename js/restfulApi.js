var restfulApi = {

};

restfulApi.host = 'http://eclasso2o.azurewebsites.net';

restfulApi.registerUser = function(username, password, name, email, phone) {
	return $.ajax({
		url : restfulApi.host + '/api/account/register',
		type : 'POST',
		contentType: 'application/json',
		data: JSON.stringify({
			'userName': username,
			'password': password,
			'confirmPassword': password,
			'name': name,
			'email': email,
			'phone': phone
        }),
		dataType : 'json'
	});
};

restfulApi.login = function(username, password) {
	console.log('login', username, password);
	return $.ajax({
		url : restfulApi.host + '/token',
		type : 'POST',
		contentType: 'application/json',
		data: JSON.stringify({
			'grant_type': 'password',
			'username': username,
			'password': password
        }),
		dataType : 'json'
	});
};
