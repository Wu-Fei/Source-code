var loginPage = function () {
    var page = $('#loginPage');
	var header = page.children('div[data-role=header]');
	var content = page.children('div[data-role=content]');

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

    $('#loginBtnLogin').on('click', function () {
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
		var height = $.mobile.getScreenHeight()
					- header.outerHeight()
					- (content.outerHeight() - content.height())
					- 2;
		content.height(height);
		form.next().css('top', form.position().top + form.outerHeight(true) + 10);

		txtUserName.val('');
		txtPassword.val('');
	});

	dataContext.user = null;
	var accessToken = dataContext.getAccessToken();
	if (!accessToken) {
		setTimeout(function() {
			location.replace('#loginPage');
		}, 3000);
	} else {
		var t0 = new Date();
		dataContext.setAccessToken(accessToken);
		dataContext.getCurrentUser(function(user, err) {
			if (user) {
				realStart(user);
			} else {
				t0 = 3000 - (new Date() - t0);
				if (t0 < 0) t0 = 0;
				setTimeout(function() {
					location.replace('#loginPage');
				}, t0);
			}
		});
	}
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
		var email = '';
		var phone = '';

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