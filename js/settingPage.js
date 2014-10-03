var settingPage = function() {
	var page = $('#settingPage');
	//var header = page.children('div[data-role=header]');
	//var content = page.children('div[data-role=content]');
	//var footer = page.children('div[data-role=footer]');

	var setLang = $('#setLang input').on('click', function() {
		setLocaleLanguage($(this).val());
	});

	/*
	$('#setClass a').on('click', function() {
		captureQRCode(function(res) {
			alert("We got a barcode\n" +
			      "Result: " + res.text + "\n" +
			      "Format: " + res.format + "\n" +
                  "Cancelled: " + res.cancelled);
		}, function(err) {
			alert("Scanning failed: " + err);
		});
	});
	*/

	page.on('pageshow', function() {
		setLang.val([getLocaleLanguage()])
			.checkboxradio('refresh');
	});
};
