var qaPage = function() {
	var qaPage = $('#page_qa');
	var qaHeader = qaPage.children('div[data-role=header]');
	var qaContent = qaPage.children('div[data-role=content]');

	var displayQa = function() {
		var qa = _storage.qaAnswerList[_storage.qaIndex];

		qaContent.html([
			'<h2>', qa.question, '</h2>',
			qa.answer
		].join(''));
	};

	qaPage.on('pagebeforeshow', function() {
		displayQa();
	});

	qaPage.on('swipeleft', function(evt) {
		if (_storage.qaIndex + 1 < _storage.qaAnswerList.length) {
			++_storage.qaIndex;
			qaContent.stop().css('left', 0)
				.animate({left: '-100%'}, function() {
					displayQa();
					qaContent.css('left', '100%')
						.animate({left: 0});
				});
		}
		evt.preventDefault();
	});

	qaPage.on('swiperight', function(evt) {
		if (_storage.qaIndex  > 0) {
			--_storage.qaIndex;
			qaContent.stop().css('left', 0)
				.animate({left: '100%'}, function() {
					displayQa();
					qaContent.css('left', '-100%')
						.animate({left: 0});
				});
		}
		evt.preventDefault();
	});

	var askqPage = $('#page_askq');
	var askqHeader = askqPage.children('div[data-role=header]');
	var askqContent = askqPage.children('div[data-role=content]');

	var askqForm = askqContent.children('form');
	var askqText = askqForm.children('textarea');

	var displayAskq = function() {
		askqText.val('');
	};

	askqPage.on('pagebeforeshow', function() {
		_storage.tab = 'qa';
		displayAskq();
	});

	askqForm.children('a').click(function() {
		var question = $.trim(askqText.val());
		if (question == '') {
			alert(getLocale('Please enter your question.'));
			return false;
		}

		askQuestion(question, function() {
			$.mobile.changePage('#page_main', {transition: 'pop', reverse: true});
		}, function() {
			alert(getLocale('Failed to send your question. Please check your Internet connection and try again.'));
		});
		return false;
	});
};
