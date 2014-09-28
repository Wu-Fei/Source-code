var settingPage = function() {
	var settingPage = $('#page_setting');
	var settingHeader = settingPage.children('div[data-role=header]');
	var settingContent = settingPage.children('div[data-role=content]');

	$('#setLang input').click(function() {
		var lang = $(this).val();

		setLocaleLanguage(lang);
	}).val([getLocaleLanguage()]);

	$('#setClass a').click(function() {
		captureQRCode(function(res) {
			alert("We got a barcode\n" +
			      "Result: " + res.text + "\n" +
			      "Format: " + res.format + "\n" +
                  "Cancelled: " + res.cancelled);
		}, function(err) {
			alert("Scanning failed: " + err);
		});
	});
};
