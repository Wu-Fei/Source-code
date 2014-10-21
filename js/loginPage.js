var loginPage = function() {
	var page = $('#loginPage');

	var form = page.find('form');
	var txtUserName = form.find('input[name=username]');
	var txtPassword = form.find('input[name=password]');

	var realStart = function() {
		$('#inboxPage').trigger('listchanged', [localStorage.inboxActiveTab == 'Notification']);
		$('#testPage').trigger('listchanged', [localStorage.testActiveTab == 'Exam']);
		$('#classPage').trigger('listchanged', [localStorage.classActiveTab == 'Pending']);

		var p = localStorage.activePage || 'inbox';
		localStorage.activePage = '';
		location.replace('#' + p + 'Page');
	};

	form.find('a').on('click', function() {
		//realStart();
		//return;

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
			realStart();
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

	form.find('a[data-role=button]').on('click', function() {
		var username = $.trim(txtUserName.val());
		var password = $.trim(txtPassword.val());
		var password2 = $.trim(txtPassword2.val());
		var name = $.trim(txtName.val());

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

		restfulApi.registerUser(username, password, name, function(result) {
			console.log(result);
		}).fail(function(err) {
			console.log(err);
		});
	});
};