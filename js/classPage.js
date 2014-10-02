var classPage = function() {
	var page = toolbox.initPage('class');

	var mainList = $('#classList').listview({
		filter: true,
		icon: false
	});
	var mainTab = mainList.parent();

	var link = $('#classLink');

	var activeTab = link;
	page.on('pageshow', function() {
		activeTab.addClass('ui-btn-active');
		if (_storage.activePage != 'class') {
			mainTab.hide();
			mainTab.slideDown();
			_storage.activePage = 'class';
		}
	});

	var prepareTestList = function(isExam) {
		var n = testData.length;
		var list = [];
		for (var i = 0; i < n; ++i) {
			var data = testData[i];
			if (data[2] != isExam) continue;

			list.push(data);
		}
		_storage.testData = list;

		var list = new Array(n = _storage.testData.length);
		for (var i = 0; i < n; ++i) {
			var data = _storage.testData[i];

			list[i] = [
				'<li>',
				'<a href="#testContentPage" data-transition="slide" class="',
				data[1] ? 'list_read"' : 'list_unread',
				'" onclick="_storage.testDataIndex=', i, '">',
				'<div>', data[0], '</div>',
				'</a>',
				'</li>'
			].join('');
		}
		mainList.html(list.join('')).listview('refresh');
	};

	page.on('listchanged', function() {
		prepareClassList();
	}).trigger('listchanged');
};

var classContentPage = function() {
	var page = $('#classContentPage');
	var header = page.children('div[data-role=header]');
	var content = page.children('div[data-role=content]');

	toolbox.setBack(header);

	var displayContent = function() {
		var data = _storage.classData[_storage.classDataIndex];

		content.html([
			'<h2>', data.question, '</h2>',
			data.answer
		].join(''));
	};

	page.on('pagebeforeshow', function() {
		displayContent();
	});

};
