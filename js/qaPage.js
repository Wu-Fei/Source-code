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

	var btnAskq = $('#qaBtnAskq').addClass('ui-state-disabled').css('opacity', 0.3);
	var timer = null;
	var search = $('#qaSearch').on('input', function(e) {
		var txt = $.trim(search.val());
		if (txt == '') {
			toolbox.loading(false);
			if (timer) {
				clearTimeout(timer);
				timer = null;
			}
			btnAskq.addClass('ui-state-disabled').css('opacity', 0.3);
			mainList.html('');
		} else {
			btnAskq.removeClass('ui-state-disabled').css('opacity', 1);

			if (timer) {
				clearTimeout(timer);
			}
			timer = setTimeout(function() {
				timer = null;
				toolbox.loading(true);
				qaDataStore.searchAnswers(txt, function(answerList) {
					if (txt != $.trim(search.val()))
						return;

					toolbox.loading(false);
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
								'<a href="#qaContentPage" data-transition="slide" class="list_read"',
								' onclick="_storage.qaDataIndex=', i, '">',
								'<div>', data.question, '</div>',
								'</a>',
								'</li>'
							].join('');
						}
						mainList.html(list.join('')).listview('refresh');
					}
				});
			}, 300);
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
		].join(''))
		.find('table').removeAttr('width').css('width', '')
		.find('td').removeAttr('width').css('width', '');
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
	var selClass = form.children('select');
	var txtQuestion = form.children('textarea');

	var displayAskq = function() {
		var classData = classDataStore.getActiveDataList();
		var n = classData.length;
		var sel = [];
		for (var i = 0; i < n; ++i) {
			var data = classData[i];
			sel.push('<option class="lang" value="', data.pk, '">', data.name, '<class>');
		}
		selClass.html(sel.join('')).val([]);
		localize(selClass.prev(), 'Class ...');
		txtQuestion.val('');
	};

	page.on('pagebeforeshow', function() {
		displayAskq();
	});

	$('#qaAskqBtnSubmit').on('click', function() {
		var clazz = selClass.val();
		if (!clazz) {
			alert(getLocale('Please choose a class.'));
			return false;
		}
		var question = $.trim(txtQuestion.val());
		if (question == '') {
			alert(getLocale('Please enter your question.'));
			return false;
		}

		qaDataStore.askQuestion(clazz, question, function() {
			$.mobile.changePage('#qaPage', {transition: 'pop', reverse: true});
		}, function() {
			alert(getLocale('Failed to send your question. Please check your Internet connection and try again.'));
		});
		return false;
	});
};
