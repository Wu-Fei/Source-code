var loginPage = function() {
	var page = $('#loginPage');

	var form = page.find('form');
	var txtUserName = form.find('input[name=username]');
	var txtPassword = form.find('input[name=password]');

	console.log(txtUserName, txtPassword);

	form.find('a').on('click', function() {
		var username = $.trim(txtUserName.val());
		var password = $.trim(txtPassword.val());

		// validate

		restfulApi.login(username, password)
			.done(function(data) {
				console.log(data);

				var p = localStorage.activePage || 'inbox';
				localStorage.activePage = '';
				location.replace('#' + p + 'Page');

			}).fail(function(err) {
				console.log(err);
			});
	});
};


var registerPage = function() {
	var page = $('#registerPage');

	var form = page.find('form');
	var txtUserName = form.find('input[name=username]');
	var txtPassword = form.find('input[name=password]');
	var txtPassword2 = form.find('input[name=password2]');
	var txtName = form.find('input[name=name]');
	var txtEmail = form.find('input[name=email]');
	var txtPhone = form.find('input[name=phone]');

	form.find('a').on('click', function() {
		var username = $.trim(txtUserName.val());
		var password = $.trim(txtPassword.val());
		var password2 = $.trim(txtPassword2.val());
		var name = $.trim(txtName.val());
		var email = $.trim(txtEmail.val());
		var phone = $.trim(txtPhone.val());

		// validate
		restfulApi.registerUser(username, password, name, email, phone)
			.done(function(data) {
				console.log(data);
			}).fail(function(err) {
				console.log(err);
			});
	});
};