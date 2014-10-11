var prepareChallenge = {};

prepareChallenge[QUIZ_TYPE.TRUE_FALSE] = function(list, quiz, submitted) {
	var checked, wrong;
	checked = $.inArray(0, quiz.answer) >= 0 ? ' checked="checked"' : '';
	wrong = '';
	if (submitted) {
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
	checked = $.inArray(1, quiz.answer) >= 0 ? ' checked="checked"' : '';
	wrong = '';
	if (submitted) {
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

prepareChallenge[QUIZ_TYPE.SINGLE_CHOICE] = function(list, quiz, submitted) {
	var checked, wrong, n = quiz.challenge.length;
	for (var i = 0; i < n; ++i) {
		checked = $.inArray(i, quiz.answer) >= 0 ? ' checked="checked"' : '';
		wrong = '';
		if (submitted) {
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

prepareChallenge[QUIZ_TYPE.MULTIPLE_CHOICE] = function(list, quiz, submitted) {
	var checked, wrong, n = quiz.challenge.length;
	for (var i = 0; i < n; ++i) {
		checked = $.inArray(i, quiz.answer) >= 0 ? ' checked="checked"' : '';
		wrong = '';
		if (submitted) {
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

var renderQuiz = function(list, quiz, status) {
	list.push(quiz.content);
	list.push('<form>', '<fieldset data-role="controlgroup">');
	prepareChallenge[quiz.type](list, quiz, status);
	list.push('</fieldset>', '</form>');
};
