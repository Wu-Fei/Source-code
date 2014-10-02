var inboxPage = function() {
	var page = toolbox.initPage('inbox');
	inboxDataStore.setUIPage(page);

	var mainList = $('#inboxList').listview({
		filter: true,
		icon: false
	});
	var mainTab = mainList.parent();

	var linkPublic = $('#inboxLinkPublic').on('tap', function() {
		if (activeTab != linkPublic) {
			mainTab.hide();
			prepareInboxList(false);
			mainTab.slideDown();
			_storage.activeTab = activeTab = linkPublic;
		}
	});

	var linkPrivate = $('#inboxLinkPrivate').on('tap', function() {
		if (activeTab != linkPrivate) {
			mainTab.hide();
			prepareInboxList(true);
			mainTab.slideDown();
			_storage.activeTab = activeTab = linkPrivate;
		}
	});

	var activeTab = linkPublic;
	page.on('pageshow', function() {
		_storage.activeTab = activeTab.addClass('ui-btn-active');
		if (_storage.activePage != 'inbox') {
			mainTab.hide();
			mainTab.slideDown();
			_storage.activePage = 'inbox';
		}
	});

	var prepareInboxList = function(isPrivate) {
		var inboxData = inboxDataStore.getAll();
		var n = inboxData.length;
		var list0 = [], list1 = [];
		for (var i = 0; i < n; ++i) {
			var data = inboxData[i];
			if (data.isPrivate != isPrivate) continue;

			if (data.isMarked) {
				list0.push(data);
			} else {
				list1.push(data);
			}
		}
		_storage.inboxData = $.merge(list0, list1);

		var today = new Date();
		today.setHours(0, 0, 0, 0);
		today = today.valueOf();
		var list = new Array(n = _storage.inboxData.length);
		for (var i = 0; i < n; ++i) {
			var data = _storage.inboxData[i];
			var thisday = toolbox.dtStr(data.timestamp, today);
			list[i] = [
				'<li>',
				'<a href="#inboxContentPage" data-transition="slide" class="ui-btn ui-btn-icon-left',
					data.isMarked ? ' ui-icon-star' : ' ui-nodisc-icon',
					data.isRead ? ' list_read' : ' list_unread',
					'" onclick="_storage.inboxDataIndex=', i, '">',
					'<div>', thisday, '</div>',
					'<div>', data.subject, '</div>',
				'</a>',
				'</li>'
			].join('');
		}
		mainList.html(list.join('')).listview('refresh');
	};

	page.on('listchanged', function() {
		prepareInboxList(activeTab == linkPrivate);
	}).trigger('listchanged');
};

var inboxContentPage = function() {
	var page = $('#inboxContentPage');
	var header = page.children('div[data-role=header]');
	var content = page.children('div[data-role=content]');

	toolbox.setBack(header);

	var btnFlag = $('#inboxContentBtnFlag');
	var txtTitle = header.children('h1');

	var displayContent = function() {
		var data = _storage.inboxData[_storage.inboxDataIndex];
		data.setRead();

		content.html([
			'<h3>', toolbox.dtStr(data.timestamp), '</h3>',
			'<h2>', data.subject, '</h2>',
			data.content
		].join(''));

		btnFlag.css('background', data.isMarked ? '#ff8080' : 'transparent')
			.off('tap').on('tap', function() {
				data.setMarked(!data.isMarked);
				btnFlag.css('background', data.isMarked ? '#ff8080' : 'transparent');
			});
	};

	page.on('pagebeforeshow', function() {
		localize(txtTitle, _storage.activeTab.data('lang'));
		displayContent();
	});

	page.on('swipeleft', function(evt) {
		if (_storage.inboxDataIndex + 1 < _storage.inboxData.length) {
			++_storage.inboxDataIndex;
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
		if (_storage.inboxDataIndex  > 0) {
			--_storage.inboxDataIndex;
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
