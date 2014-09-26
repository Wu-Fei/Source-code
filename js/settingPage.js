var settingPage = function() {
	var settingPage = $('#page_setting');
	var settingHeader = settingPage.children('div[data-role=header]');
	var settingContent = settingPage.children('div[data-role=content]');

	$('#setLang input').click(function() {
		var lang = $(this).val();

		setLocaleLanguage(lang);
	}).val([getLocaleLanguage()]);
};
