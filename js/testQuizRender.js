var prepareChallenge = {};

var prepareAnswer = {};

prepareChallenge[QUIZ_TYPE.TRUE_FALSE] = function(list, quiz, working) {
	var checked, wrong;
	checked = quiz.answer[0] ? ' checked="checked"' : '';
	wrong = '';
	if (!working) {
		if ($.inArray(0, quiz.key) >= 0) {
			if (!checked) {
				wrong = ' wrong_answer miss';
			}
		} else {
			if (checked) {
				wrong = ' wrong_answer extra';
			}
		}
	}
	list.push(
		'<input id="_challenge_0"', checked, ' type="radio" name="_challenge_" value="0"/>',
		'<label for="_challenge_0" class="lang', wrong, '">False</label>'
	);
	checked = quiz.answer[1] ? ' checked="checked"' : '';
	wrong = '';
	if (!working) {
		if ($.inArray(1, quiz.key) >= 0) {
			if (!checked) {
				wrong = ' wrong_answer miss';
			}
		} else {
			if (checked) {
				wrong = ' wrong_answer extra';
			}
		}
	}
	list.push(
		'<input id="_challenge_1"', checked, ' type="radio" name="_challenge_" value="1"/>',
		'<label for="_challenge_1" class="lang', wrong, '">True</label>'
	);
};

prepareAnswer[QUIZ_TYPE.TRUE_FALSE] = function(content, catalog, quiz, working) {
	var answer = content.find('input');
	if (working) {
		answer.on('change', function() {
			answer.each(function() {
				var self = $(this);
				quiz.setAnswer(self.val() * 1, self.is(':checked'));
			});
			if (quiz.isAnswerReady()) {
				catalog.addClass('list_read');
			} else {
				catalog.removeClass('list_read');
			}
		});
	} else {
		answer.prop('disabled', true);
	}
};

prepareChallenge[QUIZ_TYPE.SINGLE_CHOICE] = function(list, quiz, working) {
	var checked, wrong, n = quiz.challenge.length;
	for (var i = 0; i < n; ++i) {
		checked = quiz.answer[i] ? ' checked="checked"' : '';
		wrong = '';
		if (!working) {
			if ($.inArray(i, quiz.key) >= 0) {
				if (!checked) {
					wrong = ' class="wrong_answer miss"';
				}
			} else {
				if (checked) {
					wrong = ' class="wrong_answer extra"';
				}
			}
		}
		list.push(
			'<input id="_challenge_', i, '"', checked, ' type="radio" name="_challenge_" value="', i, '"/>',
			'<label for="_challenge_', i, '"', wrong, '>', quiz.challenge[i], '</label>'
		);
	}
};

prepareAnswer[QUIZ_TYPE.SINGLE_CHOICE] = prepareAnswer[QUIZ_TYPE.TRUE_FALSE];

prepareChallenge[QUIZ_TYPE.MULTIPLE_CHOICE] = function(list, quiz, working) {
	var checked, wrong, n = quiz.challenge.length;
	for (var i = 0; i < n; ++i) {
		checked = quiz.answer[i] ? ' checked="checked"' : '';
		wrong = '';
		if (!working) {
			if ($.inArray(i, quiz.key) >= 0) {
				if (!checked) {
					wrong = ' class="wrong_answer miss"';
				}
			} else {
				if (checked) {
					wrong = ' class="wrong_answer extra"';
				}
			}
		}
		list.push(
			'<input id="_challenge_', i, '"', checked, ' type="checkbox" name="_challenge_" value="', i, '"/>',
			'<label for="_challenge_', i, '"', wrong, '>', quiz.challenge[i], '</label>'
		);
	}
};

prepareAnswer[QUIZ_TYPE.MULTIPLE_CHOICE] = prepareAnswer[QUIZ_TYPE.TRUE_FALSE];

prepareAnswer[QUIZ_TYPE.FILL_BLANK] = function(content, catalog, quiz, working) {
	var workingOnFillBlank = function(b, idx) {
		var answer = quiz.answer[idx] ? toolbox.htmlEncode(quiz.answer[idx]) : '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
		b.html('&nbsp;' + answer + '&nbsp;').on('click', function() {
			var answer = prompt('', quiz.answer[idx] || '' );
			if (answer !== null) {
				answer = $.trim(answer);
				if (answer === '') {
					b.html('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;');
					quiz.setAnswer(idx, null);
					catalog.removeClass('list_read');
				} else {
					b.html('&nbsp;' + toolbox.htmlEncode(answer) + '&nbsp;');
					quiz.setAnswer(idx, answer);
					if (quiz.isAnswerReady()) {
						catalog.addClass('list_read');
					}
				}
			}
		});
	};

	var blanks = content.find('span.fill_blank');
	var n = quiz.key.length;
	var b, answer;
	for (var i = 0; i < n; ++i) {
		b = blanks.eq(i);
		if (working) {
			workingOnFillBlank(b, i);
		} else {
			answer = quiz.answer[i];
			if (answer == quiz.key[i]) {
				b.text(answer);
			} else {
				if (answer) {
					b.html([
						'<span class="wrong_answer extra">&nbsp;', toolbox.htmlEncode(answer), '&nbsp;</span>',
						'&nbsp;',
						'<span class="wrong_answer">&nbsp;', toolbox.htmlEncode(quiz.key[i]), '&nbsp;<span>'
					].join(''));
				} else {
					b.html([
						'<span class="wrong_answer">&nbsp;', toolbox.htmlEncode(quiz.key[i]), '&nbsp;<span>'
					].join(''));
				}
			}
		}
	};
};

var renderQuizChallenge = function(list, quiz, working) {
	if (quiz.type == QUIZ_TYPE.FILL_BLANK) {
		list.push(quiz.content.replace(/_{4,}/g, '<span class="fill_blank"></span>'));
	} else {
		list.push(quiz.content);
		list.push('<form>', '<fieldset data-role="controlgroup">');
		prepareChallenge[quiz.type](list, quiz, working);
		list.push('</fieldset>', '</form>');
	}
};

var renderQuizAnswer = function(content, catalog, quiz, working) {
	prepareAnswer[quiz.type](content, catalog, quiz, working);
};

var isAnswerCorrect = function(quiz) {
	if (quiz.type == QUIZ_TYPE.FILL_BLANK) {
		for (var i = 0; i < quiz.answer.length; ++i) {
			if (quiz.key[i] !== quiz.answer[i]) {
				return false;
			}
		}
		return true;
	} else {
		for (var i = 0; i < quiz.answer.length; ++i) {
			if (quiz.answer[i] !== ($.inArray(i, quiz.key) >= 0)) {
				return false;
			}
		}
		return true;
	}
};

var renderAudio = function(content) {
	content.find('myaudio').each(function() {
		var self = $(this);
		var src = self.attr('src');
		var btns = self.html([
			'<fieldset data-role="controlgroup" data-type="horizontal" style="display:inline-block">',
				'<a class="ui-btn ui-corner-all ui-icon-play ui-btn-icon-notext">&nbsp;</a>',
				'<a class="ui-btn ui-corner-all ui-icon-pause ui-btn-icon-notext">&nbsp;</a>',
				'<a class="ui-btn ui-corner-all ui-icon-stop ui-btn-icon-notext">&nbsp;</a>',
			'</fieldset>'
		].join('')).find('a');
		btns.eq(0).on('click', function() {
			mediaManager.play(src, function() {});
		});
		btns.eq(1).on('click', function() {
			mediaManager.pause();
		});
		btns.eq(2).on('click', function() {
			mediaManager.stop();
		});
	});
};
