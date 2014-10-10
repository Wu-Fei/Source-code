var testPage = function() {
	var page = toolbox.initPage('test');
	var header = page.children('div[data-role=header]');
	testDataStore.setUIPage(page);

	if (!localStorage.testActiveTab) {
		localStorage.testActiveTab = 'Assignment';
	}

	var txtTitle = header.children('h1').append('<span></span>').children('span');

	var menu = $('#testMenu');
	var menuDropdown = header.append('<span class="ui-btn-icon-notext ui-icon-carat-d title-dropdown-icon"></span>')
		.children(':last').on('click', function() {
			menu.popup('open', {x: '50%', y: header.outerHeight() + menu.outerHeight() / 2 + 5});
		});

	var mainList = $('#testList').listview({
		filter: true,
		icon: false
	});
	var mainTab = mainList.parent();

	var menuAssignment = $('#testMenuAssignment').on('click', function() {
		if (localStorage.testActiveTab != 'Assignment') {
			menu.popup('close');
			mainTab.hide();
			prepareTestList(testDataStore.getAssignmentDataList());
			mainTab.slideDown();
			localStorage.testActiveTab = 'Assignment';
			setTitle();
			menuAssignment.addClass('ui-btn-active');
			menuExam.removeClass('ui-btn-active');
		}
	});

	var menuExam = $('#testMenuExam').on('click', function() {
		if (localStorage.testActiveTab != 'Exam') {
			menu.popup('close');
			mainTab.hide();
			prepareTestList(testDataStore.getExamDataList());
			mainTab.slideDown();
			localStorage.testActiveTab = 'Exam';
			setTitle();
			menuExam.addClass('ui-btn-active');
			menuAssignment.removeClass('ui-btn-active');
		}
	});

	if (localStorage.testActiveTab == 'Assignment') {
		menuAssignment.addClass('ui-btn ui-btn-active');
	} else {
		menuExam.addClass('ui-btn ui-btn-active');
	}

	var setTitle = function() {
		localize(txtTitle, localStorage.testActiveTab);
		menuDropdown.css('left', txtTitle.position().left + txtTitle.outerWidth(true));
	};

	page.on('pageshow', function() {
		setTitle();
		if (localStorage.activePage != 'test') {
			mainTab.hide();
			mainTab.slideDown();
			localStorage.activePage = 'test';
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
		if (isExam == (localStorage.testActiveTab == 'Exam')) {
			prepareTestList(isExam
				? testDataStore.getExamDataList()
				: testDataStore.getAssignmentDataList()
			);
		}
	}).trigger('listchanged', [localStorage.testActiveTab == 'Exam']);
};

var testContentPage = function() {
	var page = $('#testContentPage');
	var header = page.children('div[data-role=header]');
	var content = page.children('div[data-role=content]');
	var footer = page.children('div[data-role=footer]');

	var txtTitle = header.children('h1');

	var prepareChallenge = {};
	prepareChallenge[testDataStore.TRUE_FALSE] = function(quiz) {
		var list = [];
		list.push(
			'<input type="radio" name="_challenge_" id="_challenge_0" dummy="" value="0"/>',
			'<label for="_challenge_0" class="lang">False</label>'
		);
		list.push(
			'<input type="radio" name="_challenge_" id="_challenge_1" dummy="" value="1"/>',
			'<label for="_challenge_1" class="lang">True</label>'
		);
		var n = quiz.answer.length;
		for (var i = 0; i < n; ++i) {
			var answer = quiz.answer[i] * 2;
			list[answer] = list[answer].replace('dummy=""', 'checked="checked"');
		}
		return list;
	};
	prepareChallenge[testDataStore.SINGLE_CHOICE] = function(quiz) {
		var n = quiz.challenge.length;
		var list = [];
		for (var i = 0; i < n; ++i) {
			list.push(
				'<input type="radio" name="_challenge_" id="_challenge_', i, '" dummy="" value="', i, '"/>',
				'<label for="_challenge_', i, '">', quiz.challenge[i], '</label>'
			);
		}
		var n = quiz.answer.length;
		for (var i = 0; i < n; ++i) {
			var answer = quiz.answer[i] * 10 + 2;
			list[answer] = list[answer].replace('dummy=""', 'checked="checked"');
		}
		return list;
	};
	prepareChallenge[testDataStore.MULTIPLE_CHOICE] = function(quiz) {
		var n = quiz.challenge.length;
		var list = [];
		for (var i = 0; i < n; ++i) {
			list.push(
				'<input type="checkbox" name="_challenge_" id="_challenge_', i, '" dummy="" value="', i, '"/>',
				'<label for="_challenge_', i, '">', quiz.challenge[i], '</label>'
			);
		}
		var n = quiz.answer.length;
		for (var i = 0; i < n; ++i) {
			var answer = quiz.answer[i] * 10 + 2;
			list[answer] = list[answer].replace('dummy=""', 'checked="checked"');
		}
		return list;
	};

	$('#testContentBtnSubmit').on('click', function() {
		var data = _storage.testData[_storage.testDataIndex];
		if (!_storage.testExercise || _storage.testExercise.pk != data.pk) {
			return false;
		}
		if (!_storage.testExercise.isCompleted()
			&& !confirm(getLocale('The test is not completed yet. Do you still want to submit?'))) {
			return false;
		}
		toolbox.loading(true);
		_storage.testExercise.submit(function() {
			toolbox.loading(false);
			alert(getLocale('Your answer was successfully submitted.'));
		}, function() {
			toolbox.loading(false);
			alert(getLocale('Failed to submit. Please check your Internet connection and try again.'));
		});
	});

	var catelog = $('#testContentCatelogList').listview({
		icon: false
	});

	var setupCatelogPanel = function() {
		var items = _storage.testExercise.asList();
		var n = items.length;
		var list = [], sec = null, prob = null;
		for (var i = 0; i < n; ++i) {
			var item = items[i];
			if (item instanceof testDataStore.Problem) {
				var thisSec = item.section;
				if (thisSec != sec) {
					sec = thisSec;
					list.push('<li>', sec.seq, ' <span class="lang">', sec.name, '</span>', '</li>');
				}
				prob = item;
				list.push('<li><a seq="', i, '" class="list_read"><span>', prob.seq, '</span>', prob.name ? ' <span class="lang">' + prob.name + '</span>' : '', '</a></li>');
			} else {
				var thisProb = item.problem;
				var thisSec = thisProb.section;
				if (thisSec != sec) {
					sec = thisSec;
					list.push('<li>', sec.seq, ' <span class="lang">', sec.name, '</span>', '</li>');
				}
				if (thisProb != prob) {
					prob = thisProb;
					if (prob.seq) {
						list.push('<li>', prob.seq, prob.name ? ' <span class="lang">' + prob.name + '</span>' : '', '</li>');
					}
				}
				list.push(
					'<li><a seq="', i, '"',
							//seq != i ? '' : ' style="font-style:italic"',
							item.answer.length ? ' class="list_read"' : '',
						'><div style="float:left">', item.seq, '</div>',
						!item.score ? '' : '<div style="float:right">(' + item.score + ')</div>',
					'</a></li>'
				);
			}
		};

		localizeAll(catelog.html(list.join('')));
		catelog.listview('refresh').find('a').on('click', function() {
			var self = $(this);
			var newSeq = self.attr('seq') * 1;
			if (newSeq < seq) {
				catelog.find('a[seq=' + seq + ']').css('font-style', 'normal');
				content.stop().css('left', 0)
					.animate({left: '100%'}, function() {
						seq = newSeq;
						page.trigger('pagebeforeshow');
						self.css('font-style', 'italic');
						content.css('left', '-100%')
							.animate({left: 0});
					});
			} else if (newSeq > seq) {
				catelog.find('a[seq=' + seq + ']').css('font-style', 'normal');
				content.stop().css('left', 0)
					.animate({left: '-100%'}, function() {
						seq = newSeq;
						page.trigger('pagebeforeshow');
						self.css('font-style', 'italic');
						content.css('left', '100%')
							.animate({left: 0});
				});
			}
		}).filter('[seq=' + seq + ']').css('font-style', 'italic');
	};

	var seq;
	var displayContent = function() {
		var data = _storage.testData[_storage.testDataIndex];
		if (!_storage.testExercise || _storage.testExercise.pk != data.pk) {
			_storage.testExercise = null;
			catelog.html('');
			txtTitle.html(data.name);
			content.html('');
			toolbox.loading(true, true);
			testDataStore.getTestDetail(data.pk, function(exercise) {
				data.setRead();
				_storage.testExercise = exercise;
				seq = 0;
				setupCatelogPanel();
				displayContent();
				toolbox.loading(false);
			}, function() {
				toolbox.loading(false);
				alert(getLocale('Failed to load test content.'));
			});
			return;
		}

		var data = _storage.testExercise.asList()[seq];
		var list = [];
		if (data instanceof testDataStore.Problem) {
			var sec = data.section;
			list.push(
				'<h4>',
				sec.seq, ') ', '<span class="lang">', sec.name, '</span>',
				' &gt; ', data.seq, data.name ? ') <span class="lang">' + data.name + '</span>' : '',
				'</h4>',
				data.content
			);
		} else {
			var prob = data.problem;
			var sec = prob.section;
			list.push(
				prob.content ? '<div data-role="collapsible"><h4>' : '<h4 style="margin:0">',
				sec.seq, ') <span class="lang">', sec.name, '</span>',
				prob.seq ? ' &gt; ' + prob.seq + (prob.name ? ') <span class="lang">' + prob.name + '</span>' : '') : '',
				prob.content ? '</h4>' + prob.content + '</div>' : '</h4>'
			);
			list.push(!data.score ? '<br/>' : '<div style="text-align:right"><span class="lang">Score:</span> ', data.score, '</div>');
			list.push('<span>', data.seq, ') </span>', data.content);
			list.push('<form>', '<fieldset data-role="controlgroup">');
			$.merge(list, prepareChallenge[data.type](data));
			list.push('</fieldset>', '</form>');
		}
		localizeAll(content.html(list.join('')));

		var answer = content.find('input').on('change', function() {
			var val = answer.filter(':checked').map(function() {
				return $(this).val() * 1;
			}).get();
			data.setAnswer(val);
			if (val.length) {
				catelog.find('a[seq=' + seq + ']').addClass('list_read');
			} else {
				catelog.find('a[seq=' + seq + ']').removeClass('list_read');
			}
		});

		content.trigger('create');
	};

	toolbox.setPrevNext(page, content, footer, displayContent,
		function() { return _storage.testExercise && seq > 0; },
		function() { return _storage.testExercise && seq < _storage.testExercise.asList().length - 1; },
		function() {
			catelog.find('a[seq=' + seq + ']').css('font-style', 'normal');
			catelog.find('a[seq=' + (--seq) + ']').css('font-style', 'italic');
			return seq;
		},
		function() {
			catelog.find('a[seq=' + seq + ']').css('font-style', 'normal');
			catelog.find('a[seq=' + (++seq) + ']').css('font-style', 'italic');
			return seq;
		}
	);
};
