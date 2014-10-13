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

	var btnSubmit = $('#testContentBtnSubmit').on('click', function() {
		var exercise = _storage.testExercise;
		if (exercise.status == EXERCISE_STATUS.SUBMITTED) {
			return false;
		}

		mediaManager.pause();

		if (!exercise.isCompleted()
			&& !confirm(getLocale('The test is not completed yet. Do you still want to submit?'))) {
			return false;
		}
		toolbox.loading(true, true);
		exercise.submit(function() {
			toolbox.loading(false);
			setupCatalogPanel(exercise);
			setupSubmitBtn(exercise);
			displayContent();
			alert(getLocale('Your answer was successfully submitted.'));
		}, function() {
			toolbox.loading(false);
			alert(getLocale('Failed to submit. Please check your Internet connection and try again.'));
		});
	});

	var setupSubmitBtn = function(exercise) {
		if (!exercise) {
			btnSubmit.hide();
			return;
		}
		if (exercise.status == EXERCISE_STATUS.SUBMITTED) {
			localizeAll(btnSubmit.html('<span class="lang">Score:</span> ' + exercise.score));
			btnSubmit.css({
				'background': 'transparent',
				'border': 'none',
				'font-size': '16px'
			}).removeClass('ui-shadow').show();
		} else {
			localizeAll(btnSubmit.html('<span class="lang">Submit</span>'));
			btnSubmit.removeAttr('style').addClass('ui-shadow').show();
		}
	};

	var catalog = $('#testContentCatalogList').listview({
		icon: false
	});

	var setupCatalogPanel = function(exercise) {
		var submitted = exercise.status == EXERCISE_STATUS.SUBMITTED;
		var items = exercise.asList();
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
				var read = item.answer.length;
				var wrong = submitted && !toolbox.arrayCompare(item.answer, item.key);
				list.push(
					'<li><a seq="', i, '" class="', read ? 'list_read' : '', wrong ? ' wrong_answer': '', '"',
						'><div style="float:left">', item.seq, '</div>',
						!item.score ? '' : '<div style="float:right">(' + item.score + ')</div>',
					'</a></li>'
				);
			}
		};

		localizeAll(catalog.html(list.join('')));
		catalog.listview('refresh').find('a').on('click', function() {
			var self = $(this);
			var newSeq = self.attr('seq') * 1;
			if (newSeq < seq) {
				catalog.find('a[seq=' + seq + ']').css('font-style', 'normal');
				content.stop().css('left', 0)
					.animate({left: '100%'}, function() {
						seq = newSeq;
						page.trigger('pagebeforeshow');
						self.css('font-style', 'italic');
						content.css('left', '-100%')
							.animate({left: 0});
					});
			} else if (newSeq > seq) {
				catalog.find('a[seq=' + seq + ']').css('font-style', 'normal');
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
			txtTitle.html('');
			catalog.html('');
			setupSubmitBtn();
			content.html('');
			testDataStore.getTestDetail(data.pk, function(exercise) {
				data.setRead();
				_storage.testExercise = exercise;
				seq = 0;
				setupCatalogPanel(exercise);
				setupSubmitBtn(exercise);
				page.trigger('pagebeforeshow');
				txtTitle.html(data.name);
				toolbox.loading(false);
			}, function() {
				txtTitle.html(data.name);
				toolbox.loading(false);
				alert(getLocale('Failed to load test content.'));
			});
			return;
		}

		mediaManager.stop();

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
			list.push('<span>', data.seq, ') </span>');
			renderQuiz(list, data, _storage.testExercise.status == EXERCISE_STATUS.SUBMITTED);
		}
		localizeAll(content.html(list.join('')));
		renderAudio(content);

		var answer = content.find('input').on('change', function() {
			var val = answer.filter(':checked').map(function() {
				return $(this).val() * 1;
			}).get();
			data.setAnswer(val);
			if (val.length) {
				catalog.find('a[seq=' + seq + ']').addClass('list_read');
			} else {
				catalog.find('a[seq=' + seq + ']').removeClass('list_read');
			}
		});
		if (_storage.testExercise.status == EXERCISE_STATUS.SUBMITTED) {
			answer.parent().on('click', function() {
				return false;
			});
		}

		content.trigger('create');
	};

	toolbox.setPrevNext(page, content, footer, displayContent,
		function() { return _storage.testExercise && seq > 0; },
		function() { return _storage.testExercise && seq < _storage.testExercise.asList().length - 1; },
		function() {
			catalog.find('a[seq=' + seq + ']').css('font-style', 'normal');
			catalog.find('a[seq=' + (--seq) + ']').css('font-style', 'italic');
			return seq;
		},
		function() {
			catalog.find('a[seq=' + seq + ']').css('font-style', 'normal');
			catalog.find('a[seq=' + (++seq) + ']').css('font-style', 'italic');
			return seq;
		}
	);

	page.on('pageshow', function() {
		if (!txtTitle.html()) {
			toolbox.loading(true, true);
		}
	});
};
