var testPage = function() {
	var page = toolbox.initPage('test');
	testDataStore.setUIPage(page);

	var mainList = $('#testList').listview({
		filter: true,
		icon: false
	});
	var mainTab = mainList.parent();

	var linkAssignment = $('#testLinkAssignment').on('click', function() {
		if (activeTab != linkAssignment) {
			mainTab.hide();
			prepareTestList(testDataStore.getAssignmentDataList());
			mainTab.slideDown();
			activeTab = linkAssignment;
		}
	});

	var linkExam = $('#testLinkExam').on('click', function() {
		if (activeTab != linkExam) {
			mainTab.hide();
			prepareTestList(testDataStore.getExamDataList());
			mainTab.slideDown();
			activeTab = linkExam;
		}
	});

	var activeTab = linkAssignment;
	page.on('pageshow', function() {
		activeTab.addClass('ui-btn-active');
		if (_storage.activePage != 'test') {
			mainTab.hide();
			mainTab.slideDown();
			_storage.activePage = 'test';
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
		if (isExam == (activeTab == linkExam)) {
			prepareTestList(isExam
				? testDataStore.getExamDataList()
				: testDataStore.getAssignmentDataList()
			);
		}
	}).trigger('listchanged', [false]);
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
