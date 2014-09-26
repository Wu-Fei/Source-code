var inboxPage = function() {
	var inboxPage = $('#page_inbox');
	var inboxHeader = inboxPage.children('div[data-role=header]');
	var inboxContent = inboxPage.children('div[data-role=content]');

	var btnInboxFlag = $('#btnInboxFlag');
	var txtTitle = inboxHeader.children('h1');

	var displayInbox = function() {
		var inbox = _storage.inboxList[_storage.inboxIndex];
		inbox.setRead();

		txtTitle.html(dtFullStr(inbox.timestamp));
		inboxContent.html([
			'<h2>', inbox.subject, '</h2>',
			inbox.content
		].join(''));

		btnInboxFlag.css('background', inbox.isMarked ? '#ff8080' : 'transparent')
			.unbind( "click" ).bind('click', function() {
				inbox.isMarked = !inbox.isMarked;
				btnInboxFlag.css('background', inbox.isMarked ? '#ff8080' : 'transparent');
			});
	};

	inboxPage.on('pagebeforeshow', function() {
		displayInbox();
	});

	inboxPage.on('swipeleft', function(evt) {
		if (_storage.inboxIndex + 1 < _storage.inboxList.length) {
			++_storage.inboxIndex;
			inboxContent.stop().css('left', 0)
				.animate({left: '-100%'}, function() {
					displayInbox();
					inboxContent.css('left', '100%')
						.animate({left: 0});
				});
		}
		evt.preventDefault();
	});

	inboxPage.on('swiperight', function(evt) {
		if (_storage.inboxIndex  > 0) {
			--_storage.inboxIndex;
			inboxContent.stop().css('left', 0)
				.animate({left: '100%'}, function() {
					displayInbox();
					inboxContent.css('left', '-100%')
						.animate({left: 0});
				});
		}
		evt.preventDefault();
	});
};
