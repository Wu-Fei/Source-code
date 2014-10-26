var loginPage = function () {
    var page = $('#loginPage');

    var form = page.find('form');
    var txtUserName = form.find('input[name=username]');
    var txtPassword = form.find('input[name=password]');

    var realStart = function (user) {
		console.log(user);
		dataContext.user = user;

        location.replace('#CreateQaPage');
    };

	dataContext.user = null;
	var accessToken = dataContext.getAccessToken();
	if (accessToken) {
		dataContext.setAccessToken(accessToken);
		toolbox.loading(true, true);
		dataContext.getCurrentUser(function(user) {
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
