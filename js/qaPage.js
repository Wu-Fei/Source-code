var qaPage = function() {
	var page = toolbox.initPage('qa');

	var mainList = $('#qaList').listview({
		icon: false
	});
	var mainListDiv = mainList.parent()
	var mainTab = mainListDiv.parent();

	var link = $('#qaLink');

	page.on('pageshow', function() {
		if (localStorage.activePage != 'qa') {
			mainTab.hide();
			mainTab.slideDown(function() {
				mainListDiv.height(mainTab.height() - mainListDiv.position().top - (mainListDiv.outerHeight(true) - mainListDiv.height()));
			});
			localStorage.activePage = 'qa';
		}
	});

	var btnAskq = $('#qaBtnAskq').hide();
	var search = $('#qaSearch').on('input', function(e) {
		var txt = $.trim(search.val());
		if (txt == '') {
			btnAskq.hide();
			mainList.html('');
		} else {
			btnAskq.show();
			var answerList = searchAnswers(txt);
			var n = answerList.length;
			if (n == 0) {
				localize(mainList.html('<li><a></a></li>').find('a'), 'Sorry, no similar questions were found.');
				mainList.listview('refresh');
			} else {
				_storage.qaData = answerList;
				var list = new Array(n);
				for (var i = 0; i < n; ++i) {
					var data = answerList[i];
					list[i] = [
						'<li>',
						'<a href="#qaContentPage" data-transition="slide" onclick="_storage.qaDataIndex=', i, '">',
						data.question,
						'</a>',
						'</li>'
					].join('');
				}
				mainList.html(list.join('')).listview('refresh');
			}
		}
	});
};

var qaContentPage = function() {
	var page = $('#qaContentPage');
	//var header = page.children('div[data-role=header]');
	var content = page.children('div[data-role=content]');

	var displayContent = function() {
		var data = _storage.qaData[_storage.qaDataIndex];

		content.html([
			'<h2>', data.question, '</h2>',
			data.answer
		].join(''));
	};

	toolbox.setPrevNext(page, content, null, displayContent,
		function() { return _storage.qaDataIndex > 0; },
		function() { return _storage.qaDataIndex + 1 < _storage.qaData.length; },
		function() { --_storage.qaDataIndex; },
		function() { return ++_storage.qaDataIndex; }
	);
};

var qaAskqPage = function() {
	var page = $('#qaAskqPage');
	//var header = page.children('div[data-role=header]');
	var content = page.children('div[data-role=content]');

	var form = content.children('form');
	var txtQuestion = form.children('textarea');

	var displayAskq = function() {
		txtQuestion.val('');
	};

	page.on('pagebeforeshow', function() {
		displayAskq();
	});

	$('#qaAskqBtnSubmit').on('click', function() {
		var question = $.trim(txtQuestion.val());
		if (question == '') {
			alert(getLocale('Please enter your question.'));
			return false;
		}

		askQuestion(question, function() {
			$.mobile.changePage('#qaPage', {transition: 'pop', reverse: true});
		}, function() {
			alert(getLocale('Failed to send your question. Please check your Internet connection and try again.'));
		});
		return false;
	});
};
