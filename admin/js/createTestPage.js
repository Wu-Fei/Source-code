var createTestPage = function() {
    var page = $('#CreateTestPage');

	var catalog = $('#testCatalog').listview({
		icon: false
	});
	var content = $('#testContent');

	var editExcercise = $('#testEditExercise');
	var editSection = $('#testEditSection');
	var editProblem = $('#testEditProblem');
	var editQuiz = $('#testEditQuiz');

	var txtSectionName = editSection.find('input[name=name]');

	var txtProblemName = editProblem.find('input[name=name]');
	var txtProblemContent = editProblem.find('input[name=content]');

	var exercise = new testDataStore.Exercise('', '', false);

	page.on('pageshow', function() {
		exercise.name = '';
		exercise.clazz = '';
		exercise.isExam = false;
		exercise.sections.length = 0;

		var section = new testDataStore.Section('');
		exercise.addSection(section);
		var problem = new testDataStore.Problem('', '');
		section.addProblem(problem);
		var quiz = new testDataStore.Quiz('', '', 0, [], []);
		problem.addQuiz(quiz);

		refreshCatalog(null);
	});

	var refreshCatalog = function(focus) {
		var items = exercise.refreshSeq();
		var n = items.length;
		var list = [], idx = 0;
		for (var i = 0; i < n; ++i) {
			var item = items[i];
			if (focus && focus.seq == item.seq) {
				idx = i;
			}
			if (item instanceof testDataStore.Section) {
				list.push('<li><a seq="', i, '"><span>', item.seq, ' <span class="lang">', item.name, '</span>', '</a></li>');
			} else if (item instanceof testDataStore.Problem) {
				list.push('<li><a seq="', i, '"><span>', item.seq, '</span>', item.name ? ' <span class="lang">' + item.name + '</span>' : '', '</a></li>');
			} else {
				list.push('<li><a seq="', i, '"><span>', item.seq, '</span>', '</a></li>');
			}
		};

		var curItem = catalog.html(list.join('')).find('a[seq=' + idx + ']').css('font-style', 'italic');
		localizeAll(catalog);
		displayItem(idx);
		catalog.listview('refresh').find('a').on('click', function() {
			idx = $(this).attr('seq') * 1;
			curItem.css('font-style', 'normal');
			curItem = catalog.find('a[seq=' + idx + ']').css('font-style', 'italic');
			displayItem($(this).attr('seq') * 1);
		});
	};

	var displayItem = function(idx) {
		console.log('displayItem', idx);
		content.data('idx', idx);

		var item = exercise.asList()[idx];
		if (item instanceof testDataStore.Section) {
			editProblem.hide();
			editQuiz.hide();
			editSection.show();
			txtSectionName.val(item.name);
		} else if (item instanceof testDataStore.Problem) {
			editSection.hide();
			editQuiz.hide();
			editProblem.show();
			txtProblemName.val(item.name);
			txtProblemContent.val(item.content);
		} else {
			editSection.hide();
			editProblem.hide();
			editQuiz.show();
		}
	};

	txtSectionName.on('input', function() {
		var idx = content.data('idx');
		var item = exercise.asList()[idx];

		item.name = txtSectionName.val();
		catalog.find('a[seq=' + idx + ']').html('<span>' + item.seq + ' <span class="lang">' + item.name + '</span>');
	});

	txtProblemName.on('input', function() {
		var idx = content.data('idx');
		var item = exercise.asList()[idx];

		item.name = txtProblemName.val();
		catalog.find('a[seq=' + idx + ']').html('<span>' + item.seq + '</span>' + (item.name ? ' <span class="lang">' + item.name + '</span>' : ''));
	});
	txtProblemContent.on('input', function() {
		var idx = content.data('idx');
		var item = exercise.asList()[idx];

		item.content = txtProblemContent.val();
	});

	$('#testBtnAddSection').on('click', function() {
		var section = new testDataStore.Section('');
		exercise.addSection(section);

		refreshCatalog(section);
	});

	$('#testBtnMoveUpSection').on('click', function() {
		var idx = content.data('idx');
		var item = exercise.asList()[idx];
		if (item.moveUp()) {
			refreshCatalog(item);
		}
	});

	$('#testBtnMoveDownSection').on('click', function() {
		var idx = content.data('idx');
		var item = exercise.asList()[idx];
		if (item.moveDown()) {
			refreshCatalog(item);
		}
	});

	$('#testBtnDeleteSection').on('click', function() {
		var idx = content.data('idx');
		var item = exercise.asList()[idx];
		if (item.remove()) {
			refreshCatalog(idx == 0 ? null : exercise.asList()[idx - 1]);
		}
	});

	$('#testBtnAddProblem').on('click', function() {
		var idx = content.data('idx');
		var item = exercise.asList()[idx];
		var problem = new testDataStore.Problem('', '');
		item.addProblem(problem);
		refreshCatalog(item);
	});

	$('#testBtnMoveUpProblem').on('click', function() {
		var idx = content.data('idx');
		var item = exercise.asList()[idx];
		if (item.moveUp()) {
			refreshCatalog(item);
		}
	});

	$('#testBtnMoveDownProblem').on('click', function() {
		var idx = content.data('idx');
		var item = exercise.asList()[idx];
		if (item.moveDown()) {
			refreshCatalog(item);
		}
	});

	$('#testBtnDeleteProblem').on('click', function() {
		var idx = content.data('idx');
		var item = exercise.asList()[idx];
		if (item.remove()) {
			refreshCatalog(idx == 0 ? null : exercise.asList()[idx - 1]);
		}
	});

	$('#testBtnAddQuiz').on('click', function() {
		var idx = content.data('idx');
		var item = exercise.asList()[idx];
		var quiz = new testDataStore.Quiz('', '', 0, [], []);
		item.addQuiz(quiz);
		refreshCatalog(item);
	});


};

