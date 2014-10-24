var settingPage = function() {
	var page = $('#settingPage');
	//var header = page.children('div[data-role=header]');
	//var content = page.children('div[data-role=content]');
	//var footer = page.children('div[data-role=footer]');

	$('#setBtnLogout').on('click', function() {
		if (!confirm('Are you sure you want to logout?')) {
			return;
		}

		dataContext.signout(function() {
			history.back();
		});
	});

	var setLang = $('#setLang input').on('click', function() {
		setLocaleLanguage($(this).val());
	});

	page.on('pageshow', function() {
		setLang.val([getLocaleLanguage()])
			.checkboxradio('refresh');
	});
};
