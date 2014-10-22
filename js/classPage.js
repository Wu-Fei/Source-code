var classPage = function() {
	var page = toolbox.initPage('class');
	var header = page.children('div[data-role=header]');
	classDataStore.setUIPage(page);

	if (!localStorage.classActiveTab) {
		localStorage.classActiveTab = 'Active';
	}

	var txtTitle = header.children('h1').append('<span></span>').children('span');

	var menu = $('#classMenu');
	var menuDropdown = header.append('<span class="ui-btn-icon-notext ui-icon-carat-d title-dropdown-icon"></span>')
		.children(':last').on('click', function() {
			menu.popup('open', {x: '50%', y: header.outerHeight() + menu.outerHeight() / 2 + 5});
		});

	var mainList = $('#classList').listview({
		filter: true,
		icon: false
	});
	var mainTab = mainList.parent();

	var menuActive = $('#classMenuActive').on('click', function() {
		if (localStorage.classActiveTab != 'Active') {
			menu.popup('close');
			mainTab.hide();
			prepareClassList(classDataStore.getActiveDataList());
			mainTab.slideDown();
			localStorage.classActiveTab = 'Active';
			setTitle();
			menuActive.addClass('ui-btn-active');
			menuPending.removeClass('ui-btn-active');
		}
	});

	var menuPending = $('#classMenuPending').on('click', function() {
		if (localStorage.classActiveTab != 'Pending') {
			menu.popup('close');
			mainTab.hide();
			prepareClassList(classDataStore.getPendingDataList());
			mainTab.slideDown();
			localStorage.classActiveTab = 'Pending';
			setTitle();
			menuPending.addClass('ui-btn-active');
			menuActive.removeClass('ui-btn-active');
		}
	});

	if (localStorage.classActiveTab == 'Active') {
		menuActive.addClass('ui-btn ui-btn-active');
	} else {
		menuPending.addClass('ui-btn ui-btn-active');
	}

	var setTitle = function() {
		localize(txtTitle, localStorage.classActiveTab);
		menuDropdown.css('left', txtTitle.position().left + txtTitle.outerWidth(true));
	};

	page.on('pageshow', function() {
		setTitle();
		if (localStorage.activePage != 'class') {
			mainTab.hide();
			mainTab.slideDown();
			localStorage.activePage = 'class';
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
				'<a href="#classContentPage" data-transition="slide" class="list_read"',
				' onclick="_storage.classDataIndex=', i, '">',
				'<div>', data.name, ' - ', data.owner, '</div>',
				'</a>',
				'</li>'
			].join('');
		}
		mainList.html(list.join('')).listview('refresh');
	};

	page.on('listchanged', function(evt, isPending) {
		if (isPending == (localStorage.classActiveTab == 'Pending')) {
			prepareClassList(isPending
				? classDataStore.getPendingDataList()
				: classDataStore.getActiveDataList()
			);
		}
	});
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
			'<tr><td class="lang">Members:</td><td>', data.members, '</td></tr>',
			'</table>',
			data.description
		].join(''));
		localizeAll(txtDetail);
	};

	toolbox.setPrevNext(page, content, null, displayContent,
		function() { return _storage.classDataIndex > 0; },
		function() { return _storage.classDataIndex + 1 < _storage.classData.length; },
		function() { --_storage.classDataIndex; },
		function() { return ++_storage.classDataIndex; }
	);

	page.on('pagebeforeshow', function() {
		localize(txtTitle, localStorage.classActiveTab);
	});
};

var classJoinPage = function() {
	var page = $('#classJoinPage');
	//var header = page.children('div[data-role=header]');
	//var content = page.children('div[data-role=content]');

	var txtDetail = $('#classJoinTxtDetail');

	var txtUuid = $('#classJoinTxtUuid').on('input', function() {
		btnSubmit.hide();

		var uuid = txtUuid.val();
		if (uuid.length < classDataStore.UUID_LENGTH) {
			txtDetail.html('');
			return;
		}

		if (!classDataStore.validateClassUuid(uuid)) {
			localize(txtDetail, 'Sorry, you entered an invalid class registration code.');
			return;
		}

		displayClassDetail(uuid);
	}).attr('maxlength', classDataStore.UUID_LENGTH);

	$('#classJoinBtnQrcode').on('click', function() {
		btnSubmit.hide();
		txtUuid.val('');

		captureQRCode(function(res) {
			if (res.text) {
				if (!classDataStore.validateClassUuid(res.text)) {
					localize(txtDetail, 'Sorry, you captured an invalid class registration QR code.');
				} else {
					txtUuid.val(res.text);
					displayClassDetail(res.text);
				}
			}
		}, function(err) {
			localize(txtDetail, 'Failed to capture QR code, please try again.');
		});
	});

	var displayClassDetail = function(uuid) {
		classDataStore.getClassContent(uuid, function(data) {
			txtDetail.html([
				'<h2>', data.name, '</h2>',
				'<table>',
				'<tr><td class="lang">Created By:</td><td>', data.owner, '</td></tr>',
				'<tr><td class="lang">Created At:</td><td>', toolbox.dtStr(data.timestamp), '</td></tr>',
				'<tr><td class="lang">Members:</td><td>', data.members, '</td></tr>',
				'</table>',
				data.description
			].join(''));
			localizeAll(txtDetail);

			btnSubmit.show();
		}, function(err) {
			localize(txtDetail, 'The class registration code is invalid.');
		});
	};

	var btnSubmit = $('#classJoinBtnSubmit').on('click', function() {
		btnSubmit.hide();

		classDataStore.joinClass(txtUuid.val(), function() {
			alert(getLocale('You have successfully joined a new class.'));
			txtUuid.val('');
			txtDetail.html('');
		}, function(err) {
			alert(getLocale('Sorry, failed to join the class.'))
			btnSubmit.show()
		});
	});
};
