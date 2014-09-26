var testPage = function() {
	var testPage = $('#page_test');
	var testHeader = testPage.children('div[data-role=header]');
	var testContent = testPage.children('div[data-role=content]');

	var txtTitle = testHeader.children('h1');

	var displayTest = function() {
		var test = _storage.testList[_storage.testIndex];

		txtTitle.html(test[0]);
		test[1] = true;
		/*
		test.setRead();

		txtTimestamp.html(dtFullStr(inbox.timestamp));
		inboxContent.html([
			'<h2>', inbox.subject, '</h2>',
			inbox.content
		].join(''));
		btnInboxFlag.css('background', inbox.isMarked ? '#ff8080' : 'transparent');

		btnInboxFlag.unbind( "click" ).bind('click', function() {
			inbox.isMarked = !inbox.isMarked;
			btnInboxFlag.css('background', inbox.isMarked ? '#ff8080' : 'transparent');
		});
		*/
	};

	testPage.on('pagebeforeshow', function() {
		displayTest();
	});

	testPage.on('swipeleft', function() {
		if (_storage.testIndex + 1 < _storage.testList.length) {
			++_storage.testIndex;
			testContent.animate({left: '-100%'}, function() {
				displayTest();
				testContent.css('left', '100%')
					.animate({left: 0});
			});
		}
	});

	testPage.on('swiperight', function() {
		if (_storage.testIndex  > 0) {
			--_storage.testIndex;
			testContent.animate({left: '100%'}, function() {
				displayTest();
				testContent.css('left', '-100%')
					.animate({left: 0});
			});
		}
	});
};
