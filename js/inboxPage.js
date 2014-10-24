var inboxPage = function() {
	var page = toolbox.initPage('inbox');
	var header = page.children('div[data-role=header]');
	inboxDataStore.setUIPage(page);

	if (!localStorage.inboxActiveTab) {
		localStorage.inboxActiveTab = 'Notification';
	}

	var txtTitle = header.children('h1').append('<span></span>').children('span');

	var menu = $('#inboxMenu');
	var menuDropdown = header.append('<span class="ui-btn-icon-notext ui-icon-carat-d title-dropdown-icon"></span>')
		.children(':last').on('click', function() {
			menu.popup('open', {x: '50%', y: header.outerHeight() + menu.outerHeight() / 2 + 5});
		});

	var mainList = $('#inboxList').listview({
		filter: true,
		icon: false
	});
	var mainTab = mainList.parent();

	var menuNotification = $('#inboxMenuNotification').on('click', function() {
		if (localStorage.inboxActiveTab != 'Notification') {
			menu.popup('close');
			mainTab.hide();
			prepareInboxList(inboxDataStore.getNotificationDataList());
			mainTab.slideDown();
			localStorage.inboxActiveTab = 'Notification';
			setTitle();
			menuNotification.addClass('ui-btn-active');
			menuMessage.removeClass('ui-btn-active');
		}
	});

	var menuMessage = $('#inboxMenuMessage').on('click', function() {
		if (localStorage.inboxActiveTab != 'Message') {
			menu.popup('close');
			mainTab.hide();
			prepareInboxList(inboxDataStore.getMessageDataList());
			mainTab.slideDown();
			localStorage.inboxActiveTab = 'Message';
			setTitle();
			menuMessage.addClass('ui-btn-active');
			menuNotification.removeClass('ui-btn-active');
		}
	});

	if (localStorage.inboxActiveTab == 'Notification') {
		menuNotification.addClass('ui-btn ui-btn-active');
	} else {
		menuMessage.addClass('ui-btn ui-btn-active');
	}

	var setTitle = function() {
	    localize(txtTitle, localStorage.inboxActiveTab);
		menuDropdown.css('left', txtTitle.position().left + txtTitle.outerWidth(true));
	};

	page.on('pageshow', function() {
		setTitle();
		if (localStorage.activePage != 'inbox') {
			mainTab.hide();
			mainTab.slideDown();
			localStorage.activePage = 'inbox';
		}
	});

	var prepareInboxList = function(inboxData) {
		var n = inboxData.length;
		var list0 = [], list1 = [];
		for (var i = 0; i < n; ++i) {
			var data = inboxData[i];

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

	page.on('listchanged', function(evt, isNotification) {
		if (isNotification == (localStorage.inboxActiveTab == 'Notification')) {
			prepareInboxList(isNotification
				? inboxDataStore.getNotificationDataList()
				: inboxDataStore.getMessageDataList()
			);
		}
	});
};

var inboxContentPage = function() {
	var page = $('#inboxContentPage');
	var header = page.children('div[data-role=header]');
	var content = page.children('div[data-role=content]');

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
			.off('click').on('click', function() {
				data.setMarked(!data.isMarked);
				btnFlag.css('background', data.isMarked ? '#ff8080' : 'transparent');
			});
	};

	toolbox.setPrevNext(page, content, null, displayContent,
		function() { return _storage.inboxDataIndex > 0; },
		function() { return _storage.inboxDataIndex + 1 < _storage.inboxData.length; },
		function() { --_storage.inboxDataIndex; },
		function() { return ++_storage.inboxDataIndex; }
	);

	page.on('pagebeforeshow', function() {
		localize(txtTitle, localStorage.inboxActiveTab);
	});

};
