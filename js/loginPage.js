var loginPage = function() {
	var page = $('#loginPage');

	var form = page.find('form');
	var txtUserName = form.find('input[name=username]');
	var txtPassword = form.find('input[name=password]');

	form.find('a').on('click', function() {
		var username = $.trim(txtUserName.val());
		var password = $.trim(txtPassword.val());

		if (username.length < 4) {
			alert(getLocale('Invalid user ID.'));
			return;
		}
		if (password.length < 6) {
			alert(getLocale('Invalid password.'));
			return;
		}

		restfulApi.login(username, password, function() {
			var p = localStorage.activePage || 'inbox';
			localStorage.activePage = '';
			location.replace('#' + p + 'Page');
		}, function(err){
			alert(getLocale(err));
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

		if (username.length < 4) {
			alert(getLocale('Invalid user ID.'));
			return;
		}
		if (password.length < 6) {
			alert(getLocale('Invalid password.'));
			return;
		}
		if (password2 != password) {
			alert(getLocale('Password is not confirmed.'));
			return;
		}
		if (!name) {
			alert(getLocale('Please enter your name.'));
			return;
		}

		restfulApi.registerUser(username, password, name, email, phone, function(result) {
				console.log(result);
			}, function(err) {
				console.log(err);
			});
	});
};