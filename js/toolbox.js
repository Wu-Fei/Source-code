QUIZ_TYPE = {};
QUIZ_TYPE.TRUE_FALSE = 'T';
QUIZ_TYPE.SINGLE_CHOICE = 'S';
QUIZ_TYPE.MULTIPLE_CHOICE = 'M';
QUIZ_TYPE.FILL_BLANK = 'B';

TEST_STATUS = {};
TEST_STATUS.NEW = 'n';
TEST_STATUS.WORKING = 'w';
TEST_STATUS.SUBMITTED = 's';
TEST_STATUS.SCORED = 'o';

var mediaManager = {};

mediaManager.media = null;
mediaManager.src = null;
mediaManager.playing = false;

mediaManager.play = function(src, okFunc, errFunc) {
	if (mediaManager.media) {
		if (src == mediaManager.src) {
			if (!mediaManager.playing) {
				mediaManager.media.play();
				mediaManager.playing = true;
			}
			return;
		} else {
			mediaManager.media.stop();
			mediaManager.media.release();
		}
	}

	mediaManager.media = new Media(mediaManager.src = src, okFunc, errFunc);
	mediaManager.media.play();
	mediaManager.playing = true;
};

mediaManager.pause = function() {
	if (mediaManager.media) {
		mediaManager.media.pause();
		mediaManager.playing = false;
	}
};

mediaManager.stop = function() {
	if (mediaManager.media) {
		if (mediaManager.playing) {
			mediaManager.media.stop();
			mediaManager.playing = false;
		}
	}
};

mediaManager.release = function() {
	if (mediaManager.media) {
		if (mediaManager.playing) {
			mediaManager.media.stop();
			mediaManager.playing = false;
		}
		mediaManager.media.release();
		mediaManager.media = mediaManager.src = null;
	}
};

var toolbox = {
};

toolbox.htmlEncoder = $('<div></div>');

toolbox.htmlEncode = function(text) {
	return toolbox.htmlEncoder.text(text).html();
}

toolbox.dtStr = function(dt, today) {
	if (!today) {
		return [
			dt.getFullYear(), '/',
			dt.getMonth() + 1, '/',
			dt.getDate(), ' ',
			dt.getHours(), ':',
			dt.getMinutes(), ':',
			dt.getSeconds()
		].join('');
	}

	var thisday = new Date(dt.valueOf());
	thisday.setHours(0, 0, 0, 0);
	if (thisday.valueOf() == today) {
		return [dt.getHours(), ':', dt.getMinutes(), ':', dt.getSeconds()].join('');
	} else {
		return [dt.getFullYear(), '/', dt.getMonth() + 1, '/', dt.getDate()].join('');
	}
};

toolbox.arrayCompare = function(a, b) {
	return $(a).not(b).length === 0 && $(b).not(a).length === 0;
};

toolbox.loading = function(show, model) {
	if (show) {
		if (model) {
			var blocker = $('#_loading_blocker_');
			if (blocker.length) {
				blocker.show();
			} else {
				$('body').append('<div id="_loading_blocker_" class="ui-popup-screen in ui-overlay-b"></div>');
			}
		}
		$.mobile.loading('show');
	} else {
		$('#_loading_blocker_').hide();
		$.mobile.loading('hide');
	}
};

toolbox.pages = [
	['inbox', 'Inbox', 'mail'],
	['test', 'Test', 'bullets'],
	['qa', 'Q &amp; A', 'comment'],
	['class', 'Class', 'user']
];

toolbox.initPage = function(pagename) {
	var page = $('#' + pagename + 'Page');
	var header = page.children('div[data-role=header]');
	var content = page.children('div[data-role=content]');

	var tabItems = ['<div data-role="footer" data-position="fixed">', '<div data-role="navbar">', '<ul>'];
	for (var i = 0; i < toolbox.pages.length; ++i) {
		var p = toolbox.pages[i];
		if (p[0] == pagename) {
			tabItems.push(
				'<li>',
				'<a data-icon="', p[2], '" class="ui-state-persist lang">', p[1], '</a>',
				'</li>'
			);
		} else {
			tabItems.push(
				'<li>',
				'<a data-icon="', p[2], '" data-transition="none" goto="#', p[0], 'Page" class="lang">', p[1], '</a>',
				'</li>'
			);
		}
	}
	tabItems.push('</ul>', '</div>', '</div>');
	var footer = page.append(tabItems.join('')).children('div[data-role=footer]');

	page.on('pagebeforeshow', function() {
		if (!dataContext.getAccessToken()) {
			location.replace('#loginPage');
		}
	});

	page.on('pageshow', function() {
		var height = $.mobile.getScreenHeight()
			- header.outerHeight()
			- footer.outerHeight()
			- (content.outerHeight() - content.height());
		content.height(height);
	});

	footer.find('a[goto]').each(function() {
		var a = $(this);
		a.on('click', function() {
			location.replace(a.attr('goto'));
			//$.mobile.changePage(a.attr('goto'), {transition: 'none', changeHash: false});
		});
	});

	return page;
};

toolbox.setPrevNext = function(page, content, footer, displayContent, canGoPrev, canGoNext, goPrev, goNext) {
	if (!footer) {
		footer = page.append('<div data-role="footer" data-position="fixed" class="footer-transparent"></div>').children(':last');
	}
	var btnPrev = footer.prepend('<a data-icon="arrow-l" class="lang">Prev</a>').children(':first');
	var btnNext = footer.append('<a data-icon="arrow-r" data-iconpos="right" class="ui-btn-right lang">Next</a>').children(':last');

	var myGoPrev = function() {
		var b = canGoNext();
		goPrev();
		if (!canGoPrev()) {
			btnPrev.addClass('ui-state-disabled');
		}
		if (!b) {
			btnNext.removeClass('ui-state-disabled');
		}

		content.stop().css('left', 0)
			.animate({left: '100%'}, function() {
				displayContent();
				content.css('left', '-100%')
					.animate({left: 0});
			});
	};
	var myGoNext = function() {
		var b = canGoPrev();
		goNext();
		if (!canGoNext()) {
			btnNext.addClass('ui-state-disabled');
		}
		if (!b) {
			btnPrev.removeClass('ui-state-disabled');
		}

		content.stop().css('left', 0)
			.animate({left: '-100%'}, function() {
				displayContent();
				content.css('left', '100%')
					.animate({left: 0});
		});
	};

	btnPrev.on('click', myGoPrev);
	btnNext.on('click', myGoNext);

	page.on('swiperight', function(evt) {
		if (canGoPrev()) {
			myGoPrev();
		} else {
			displayContent();
			content.stop().css('left', 0)
				.animate({left: '20%'}, function() {
					content.animate({left: 0});
				});
		}
		evt.preventDefault();
	});
	page.on('swipeleft', function(evt) {
		if (canGoNext()) {
			myGoNext();
		} else {
			displayContent();
			content.stop().css('left', 0)
				.animate({left: '-20%'}, function() {
					content.animate({left: 0});
				});
		}
		evt.preventDefault();
	});

	page.on('pagebeforeshow', function() {
		displayContent();

		if (canGoPrev()) {
			btnPrev.removeClass('ui-state-disabled');
		} else {
			btnPrev.addClass('ui-state-disabled');
		}
		if (canGoNext()) {
			btnNext.removeClass('ui-state-disabled');
		} else {
			btnNext.addClass('ui-state-disabled');
		}
	});
};
