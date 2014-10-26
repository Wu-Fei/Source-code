var loginPage = function () {
    var page = $('#loginPage');

    var form = page.find('form');
    var txtUserName = form.find('input[name=username]');
    var txtPassword = form.find('input[name=password]');

    var realStart = function (user) {
		console.log(user);
		dataContext.user = user;
		settingPage.setUser(user);

        $('#inboxPage').trigger('listchanged', [localStorage.inboxActiveTab == 'Notification']);
        $('#testPage').trigger('listchanged', [localStorage.testActiveTab == 'Exam']);
        $('#classPage').trigger('listchanged', [localStorage.classActiveTab == 'Pending']);

        var p = localStorage.activePage || 'inbox';
        localStorage.activePage = '';
        location.replace('#' + p + 'Page');
    };

	dataContext.user = null;
	var accessToken = dataContext.getAccessToken();
	if (accessToken) {
		dataContext.setAccessToken(accessToken);
		toolbox.loading(true, true);
		dataContext.getCurrentUser(function(user, err) {
			toolbox.loading(false);
			if (user) {
				realStart(user);
			}
		});
	}

    form.find('a[data-role=button]').on('click', function () {
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

		toolbox.loading(true, true);
        dataContext.signin(username, password, function(user, err) {
            toolbox.loading(false);
            if (user) {
				realStart(user);
			} else {
                alert(getLocale('Failed to login.') + (!err ? '' : ('\n' + err)));
            }
        });
    });

	page.on('pageshow', function() {
		txtUserName.val('');
		txtPassword.val('');
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

	form.find('a[data-role=button]').on('click', function() {
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

		toolbox.loading(true, true);
	    dataContext.register(username, password, name, email, phone, function (result, err) {
			toolbox.loading(false);
			if (result) {
				alert(getLocale('Register user succeeded.'));
				history.back();
			} else {
				alert(getLocale('Failed to register user.') + (!err ? '' : ('\n' + err)));
			}
		});
	});
};