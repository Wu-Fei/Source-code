var testPage = function() {
	var page = toolbox.initPage('test');
	var header = page.children('div[data-role=header]');
	testDataStore.setUIPage(page);

	if (!localStorage.testActiveTab) {
		localStorage.testActiveTab = 'Assignment';
	}

	var txtTitle = header.children('h1').append('<span></span>').children('span');

	var menu = $('#testMenu');
	var menuDropdown = header.append('<span class="ui-btn-icon-notext ui-icon-carat-d title-dropdown-icon"></span>')
		.children(':last').on('click', function() {
			menu.popup('open', {x: '50%', y: header.outerHeight() + menu.outerHeight() / 2 + 5});
		});

	var mainList = $('#testList').listview({
		filter: true,
		icon: false
	});
	var mainTab = mainList.parent();

	var menuAssignment = $('#testMenuAssignment').on('click', function() {
		if (localStorage.testActiveTab != 'Assignment') {
			menu.popup('close');
			mainTab.hide();
			prepareTestList(testDataStore.getAssignmentDataList());
			mainTab.slideDown();
			localStorage.testActiveTab = 'Assignment';
			setTitle();
			menuAssignment.addClass('ui-btn-active');
			menuExam.removeClass('ui-btn-active');
		}
	});

	var menuExam = $('#testMenuExam').on('click', function() {
		if (localStorage.testActiveTab != 'Exam') {
			menu.popup('close');
			mainTab.hide();
			prepareTestList(testDataStore.getExamDataList());
			mainTab.slideDown();
			localStorage.testActiveTab = 'Exam';
			setTitle();
			menuExam.addClass('ui-btn-active');
			menuAssignment.removeClass('ui-btn-active');
		}
	});

	if (localStorage.testActiveTab == 'Assignment') {
		menuAssignment.addClass('ui-btn ui-btn-active');
	} else {
		menuExam.addClass('ui-btn ui-btn-active');
	}

	var setTitle = function() {
		localize(txtTitle, localStorage.testActiveTab);
		menuDropdown.css('left', txtTitle.position().left + txtTitle.outerWidth(true));
	};

	page.on('pageshow', function() {
		setTitle();
		if (localStorage.activePage != 'test') {
			mainTab.hide();
			mainTab.slideDown();
			localStorage.activePage = 'test';
		}
	});

	var prepareTestList = function(testData) {
		var n;
		_storage.testData = $.merge([], testData);

		var list = new Array(n = _storage.testData.length);
		for (var i = 0; i < n; ++i) {
			var data = _storage.testData[i];

			list[i] = [
				'<li>',
				'<a href="#testContentPage" data-transition="slide" class="',
				data.isRead ? 'list_read"' : 'list_unread',
				'" onclick="_storage.testDataIndex=', i, '">',
				'<div>', data.name, '</div>',
				'</a>',
				'</li>'
			].join('');
		}
		mainList.html(list.join('')).listview('refresh');
	};

	page.on('listchanged', function(evt, isExam) {
		if (isExam == (localStorage.testActiveTab == 'Exam')) {
			prepareTestList(isExam
				? testDataStore.getExamDataList()
				: testDataStore.getAssignmentDataList()
			);
		}
	}).trigger('listchanged', [localStorage.testActiveTab == 'Exam']);
};

var testContentPage = function() {
	var page = $('#testContentPage');
	var header = page.children('div[data-role=header]');
	var content = page.children('div[data-role=content]');
	var footer = page.children('div[data-role=footer]');

	var txtTitle = header.children('h1');

	var prepareChallenge = {};
	prepareChallenge[testDataStore.TRUE_FALSE] = function(challenge) {
		var list = [];
		list.push(
			'<input type="radio" name="_challenge_" id="_challenge_0" value="0"/>',
			'<label for="_challenge_0" class="lang">False</label>'
		);
		list.push(
			'<input type="radio" name="_challenge_" id="_challenge_1" value="1"/>',
			'<label for="_challenge_1" class="lang">True</label>'
		);
		return list;
	};
	prepareChallenge[testDataStore.SINGLE_CHOICE] = function(challenge) {
		var n = challenge.length;
		var list = [];
		for (var i = 0; i < n; ++i) {
			list.push(
				'<input type="radio" name="_challenge_" id="_challenge_', i, '" value="', i, '"/>',
				'<label for="_challenge_', i, '">', challenge[i], '</label>'
			);
		}
		return list;
	};
	prepareChallenge[testDataStore.MULTIPLE_CHOICE] = function(challenge) {
		var n = challenge.length;
		var list = [];
		for (var i = 0; i < n; ++i) {
			list.push(
				'<input type="checkbox" name="_challenge_" id="_challenge_', i, '" value="', i, '"/>',
				'<label for="_challenge_', i, '">', challenge[i], '</label>'
			);
		}
		return list;
	};

	var seq;
	var displayContent = function() {
		var data = _storage.testData[_storage.testDataIndex];
		if (!_storage.testExersize || _storage.testExersize.pk != data.pk) {
			_storage.testExersize = null;
			testDataStore.getTestDetail(data.pk, function(exersize) {
				data.setRead();
				txtTitle.html((_storage.testExersize = exersize).name);
				seq = 0;
				displayContent();
			}, function() {
				alert(getLocale('Failed to load test content.'));
			});
			// show loading
			return;
		}

		var data = _storage.testExersize.asList()[seq];
		var list = [];
		if (data instanceof testDataStore.Problem) {
			var sec = data.section;
			list.push(
				'<h4>',
				sec.seq, ') ', '<span class="lang">', sec.name, '</span>',
				' &gt; ', data.seq, data.title ? ') <span class="lang">' + data.title + '</span>' : '',
				'</h4>',
				data.content
			);
		} else {
			var prob = data.problem;
			var sec = prob.section;
			list.push(
				prob.content ? '<div data-role="collapsible"><h4>' : '<h4>',
				sec.seq, ') <span class="lang">', sec.name, '</span>',
				prob.seq ? ' &gt; ' + prob.seq + (prob.title ? ') <span class="lang">' + prob.title + '</span>' : '') : '',
				prob.content ? '</h4>' + prob.content + '</div><br/>' : '</h4>'
			);
			list.push('<span>', data.seq, ') </span>', data.content);
			list.push('<form>', '<fieldset data-role="controlgroup">');
			$.merge(list, prepareChallenge[data.type](data.challenge));
			list.push('</fieldset>', '</form>');
		}

		content.html(list.join(''));
		localizeAll(content);
		content.trigger('create');
	};

	toolbox.setPrevNext(page, content, footer, displayContent,
		function() { return _storage.testExersize && seq > 0; },
		function() { return _storage.testExersize && seq < _storage.testExersize.asList().length - 1; },
		function() { return --seq; },
		function() { return ++seq; }
	);
};
