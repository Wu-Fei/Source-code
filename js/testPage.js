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

	var displayContent = function() {
		var data = _storage.testData[_storage.testDataIndex];

		txtTitle.html(data.name);
		data.setRead();
	};

	toolbox.setPrevNext(page, content, footer, displayContent,
		function() { return false; },
		function() { return false; },
		function() {},
		function() {}
	);
};
