var mainPage = function() {
	var mainPage = $('#page_main');
	var mainHeader = mainPage.children('div[data-role=header]');
	var mainContent = mainPage.children('div[data-role=content]');
	var mainFooter = mainPage.children('div[data-role=footer]');

	var mainHeight = $.mobile.getScreenHeight()
		- mainHeader.outerHeight()
		- mainFooter.outerHeight()
		- (mainContent.outerHeight() - mainContent.height());
	mainContent.height(mainHeight);

	var tabInbox = $('#tab_inbox');
	var tabTest = $('#tab_test');
	var tabQA = $('#tab_qa');

	var btnAskQ = $('#btnAskQ');
	var txtTitle = $('#txtTitle');

	var listInbox = $('#listInbox').listview({
		filter: true,
		icon: false
	});
	var lnk_inbox = $('#lnk_inbox').click(function(){
		localize(txtTitle, 'Inbox');

		btnAskQ.hide();
		tabTest.hide();
		tabQA.hide();
		tabInbox.slideDown();
		_storage.tab = 'inbox';

		var n = inboxList.length;
		var list0 = [], list1 = [];
		for (var i = 0; i < n; ++i) {
			var inbox = inboxList[i];
			if (!inbox.isMarked) {
				list0.push(inbox);
			} else {
				list1.push(inbox);
			}
		}
		_storage.inboxList = $.merge([], list1);
		$.merge(_storage.inboxList, list0);

		var today = new Date();
		today.setHours(0, 0, 0, 0);
		var list = new Array(n);
		for (var i = 0; i < n; ++i) {
			var inbox = _storage.inboxList[i];
			var thisday = dtStr(inbox.timestamp, today);
			list.push([
				'<li>',
				'<a href="#page_inbox" data-transition="slide" class="ui-btn ui-btn-icon-left',
					inbox.isMarked ? ' ui-icon-star' : ' ui-nodisc-icon',
					inbox.isRead ? ' list_read' : ' list_unread',
					'" onclick="_storage.inboxIndex=', i, '">',
					'<div>', thisday, '</div>',
					'<div>', inbox.subject, '</div>',
				'</a>',
				'</li>'
			].join(''));
		}
		listInbox.html(list.join('')).listview('refresh');
	});

	var listTest = $('#listTest').listview({
		filter: true,
		icon: false
	});
	var lnk_test = $('#lnk_test').click(function(){
		localize(txtTitle, 'Test');

		btnAskQ.hide();
		tabInbox.hide();
		tabQA.hide();
		tabTest.slideDown();
		_storage.tab = 'test';

		_storage.testList = testList;

		var n = testList.length;
		var list = new Array(n);
		for (var i = 0; i < n; ++i) {
			var test = testList[i];
			list[i] = [
				'<li>',
				'<a href="#page_test" data-transition="slide" class="',
				test[1] ? 'list_read"' : 'list_unread',
				'" onclick="_storage.testIndex=', i, '">',
				'<div>', test[0], '</div>',
				'</a>',
				'</li>'
			].join('');
		}
		listTest.html(list.join('')).listview('refresh');
	});

	var lnk_qa = $('#lnk_qa').click(function(){
		localize(txtTitle, 'Q &amp; A');

		if ($.trim(searchQA.val()) != '') {
			btnAskQ.show();
		} else{
			btnAskQ.hide();
		}

		tabTest.hide();
		tabInbox.hide();
		tabQA.slideDown(function(){
			var divListQA = listQA.parent();
			divListQA.height(tabQA.height() - divListQA.position().top - (divListQA.outerHeight(true) - divListQA.height()));
		});
		_storage.tab = 'qa';
	});

	var searchQA = $('#searchQA');
	var listQA = $('#listQA').listview({
		icon: false
	});

	searchQA.on('input', function(e) {
		var txt = $.trim(searchQA.val());

		if (txt != '') {
			btnAskQ.show();
			var answerList = searchAnswers(txt);
			var n = answerList.length;
			if (n > 0) {
				_storage.qaAnswerList = answerList;
				var list = new Array(n);
				for (var i = 0; i < n; ++i) {
					var qa = answerList[i];
					list[i] = [
						'<li>',
						'<a href="#page_qa" data-transition="slide" onclick="_storage.qaIndex=', i, '">',
						qa.question,
						'</a>',
						'</li>'
					].join('');
				}
				listQA.html(list.join(''))
					.listview('refresh');
			} else {
				localize(listQA.html('<li><a></a></li>').find('a'), 'Sorry, no similar questions were found.');
				listQA.listview('refresh');
			}
		} else{
			btnAskQ.hide();
			listQA.html('');
		}
	});

	mainPage.on('pageshow', function() {
		switch (_storage.tab) {
		case 'inbox':
			lnk_inbox.click();
			break;
		case 'test':
			lnk_test.click();
			break;
		case 'qa':
			lnk_qa.click();
			break;
		}
	});
};
