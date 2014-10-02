var mainPage = function() {
	/*
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
	*/
};
