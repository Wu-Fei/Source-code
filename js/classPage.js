var classPage = function() {
	var page = toolbox.initPage('class');
	classDataStore.setUIPage(page);

	var mainList = $('#classList').listview({
		filter: true,
		icon: false
	});
	var mainTab = mainList.parent();

	var linkActive = $('#classLinkActive').on('click', function() {
		if (activeTab != linkActive) {
			mainTab.hide();
			prepareClassList(classDataStore.getActiveDataList());
			mainTab.slideDown();
			_storage.activeTab = activeTab = linkActive;
		}
	});

	var linkPending = $('#classLinkPending').on('click', function() {
		if (activeTab != linkPending) {
			mainTab.hide();
			prepareClassList(classDataStore.getPendingDataList());
			mainTab.slideDown();
			_storage.activeTab = activeTab = linkPending;
		}
	});

	var activeTab = linkActive;
	page.on('pageshow', function() {
		_storage.activeTab = activeTab.addClass('ui-btn-active');
		if (_storage.activePage != 'class') {
			mainTab.hide();
			mainTab.slideDown();
			_storage.activePage = 'class';
		}
	});

	var prepareClassList = function(classData) {
		var n;
		_storage.classData = $.merge([], classData);

		var list = new Array(n = _storage.classData.length);
		for (var i = 0; i < n; ++i) {
			var data = _storage.classData[i];

			list[i] = [
				'<li>',
				'<a href="#classContentPage" data-transition="slide" class="',
				'" onclick="_storage.classDataIndex=', i, '">',
				'<div>', data.name, ' - ', data.owner, '</div>',
				'</a>',
				'</li>'
			].join('');
		}
		mainList.html(list.join('')).listview('refresh');
	};

	page.on('listchanged', function(evt, isPending) {
		if (isPending == (activeTab == linkPending)) {
			prepareClassList(isPending
				? classDataStore.getPendingDataList()
				: classDataStore.getActiveDataList()
			);
		}
	}).trigger('listchanged', [false]);
};

var classContentPage = function() {
	var page = $('#classContentPage');
	var header = page.children('div[data-role=header]');
	var content = page.children('div[data-role=content]');

	var txtTitle = header.children('h1');
	var txtDetail = content.children('div:first');

	$('#classContentBtnQuit').on('click', function() {
		var data = _storage.classData[_storage.classDataIndex];
		if (confirm(getLocale('Are you sure you want to quit from this class?'))) {
			classDataStore.quitClass(data.uuid);
			history.back();
		}
		return false;
	});

	var displayContent = function() {
		var data = _storage.classData[_storage.classDataIndex];

		txtDetail.html([
			'<h2>', data.name, '</h2>',
			'<table>',
			'<tr><td class="lang">Created By:</td><td>', data.owner, '</td></tr>',
			'<tr><td class="lang">Created At:</td><td>', toolbox.dtStr(data.timestamp), '</td></tr>',
			'<tr><td class="lang">Members:</td><td>', data.owner, '</td></tr>',
			'</table>',
			data.description
		].join(''));
		localizeAll(txtDetail);
	};

	page.on('pagebeforeshow', function() {
		localize(txtTitle, _storage.activeTab.data('lang'));
		displayContent();
	});

	page.on('swipeleft', function(evt) {
		if (_storage.classDataIndex + 1 < _storage.classData.length) {
			++_storage.classDataIndex;
			content.stop().css('left', 0)
				.animate({left: '-100%'}, function() {
					displayContent();
					content.css('left', '100%')
						.animate({left: 0});
				});
		}
		evt.preventDefault();
	});

	page.on('swiperight', function(evt) {
		if (_storage.classDataIndex  > 0) {
			--_storage.classDataIndex;
			content.stop().css('left', 0)
				.animate({left: '100%'}, function() {
					displayContent();
					content.css('left', '-100%')
						.animate({left: 0});
				});
		}
		evt.preventDefault();
	});
};
