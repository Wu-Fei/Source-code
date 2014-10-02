var testPage = function() {
	var page = toolbox.initPage('test');
	testDataStore.setUIPage(page);

	var mainList = $('#testList').listview({
		filter: true,
		icon: false
	});
	var mainTab = mainList.parent();

	var linkAssignment = $('#testLinkAssignment').on('tap', function() {
		if (activeTab != linkAssignment) {
			mainTab.hide();
			prepareTestList(false);
			mainTab.slideDown();
			activeTab = linkAssignment;
		}
	});

	var linkExam = $('#testLinkExam').on('tap', function() {
		if (activeTab != linkExam) {
			mainTab.hide();
			prepareTestList(true);
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

	var prepareTestList = function(isExam) {
		var testData = testDataStore.getAll();
		var n = testData.length;
		var list = [];
		for (var i = 0; i < n; ++i) {
			var data = testData[i];
			if (data.isExam != isExam) continue;

			list.push(data);
		}
		_storage.testData = list;

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

	page.on('listchanged', function() {
		prepareTestList(activeTab == linkExam);
	}).trigger('listchanged');
};

var testContentPage = function() {
	var page = $('#testContentPage');
	var header = page.children('div[data-role=header]');
	var content = page.children('div[data-role=content]');

	toolbox.setBack(header);

	var txtTitle = header.children('h1');

	var displayContent = function() {
		var data = _storage.testData[_storage.testDataIndex];

		txtTitle.html(data.name);
		data.setRead();
	};

	page.on('pagebeforeshow', function() {
		displayContent();
	});

};
