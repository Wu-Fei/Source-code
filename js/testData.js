var testDataStore = {
};

var TestData = function(pk, clazz, name, status, isExam){
	this.pk = pk;
	this.clazz = clazz;
	this.name = name;
	this.status = status;
	this.isExam = isExam;

	this.setStatus = function(status) {
		this.status = status;
		testDataStore.uipage.trigger('listchanged', [this.isExam]);
	};
};

testDataStore.setUIPage = function(page) {
	testDataStore.uipage = page;
};

var testAssignmentDataList = [
	new TestData(3, 1, '1.1 Assignment', 'n', false),
	new TestData(4, 1, '1.2 Assignment', 'n', false),
	new TestData(5, 2, '2.1 Assignment', 'n', false),
	new TestData(6, 3, '2.2 Assignment', 'n', false),
	new TestData(7, 2, '2.3 Assignment', 'n', false),
	new TestData(8, 1, '3.1 Assignment', 'n', false)
];

var testExamDataList = [
	new TestData(1, 3, '2014 Final Test', 'n', true),
	new TestData(2, 1, '2014 Middle Test', 'n', true)
];

testDataStore.getAssignmentDataList = function() {
	return testAssignmentDataList;
};

testDataStore.getExamDataList = function() {
	return testExamDataList;
};

testDataStore.Quiz = function(pk, type, content, score, challenge, key) {
	this.pk = pk;
	this.type = type;
	this.content = content;
	this.score = score;
	this.challenge = challenge;
	this.key = key;
	this.answer = new Array(
		type == QUIZ_TYPE.TRUE_FALSE
			? 2 : type == QUIZ_TYPE.FILL_BLANK
				? key.length : challenge.length
	);
	this.t0 = null;
	this.usedTime = 0;

	this.clearAnswer = function() {
		for (var i = 0; i < this.answer.length; ++i) {
			this.answer[i] = null;
		}
	};

	this.clearAnswer();

	this.isAnswerReady = function() {
		var ready = false;
		for (var i = 0; i < this.answer.length; ++i) {
			var a = this.answer[i];
			if (a === null) {
				return false;
			}
			if (a) {
				ready = true;
			}
		}
		return ready;
	};

	this.setAnswer = function(idx, val) {
		this.answer[idx] = val;
	};

	this.addUsedTime = function(dt) {
		this.usedTime += dt;
	};
};

testDataStore.Problem = function(pk, name, content, quizs) {
	this.pk = pk;
	this.name = name;
	this.content = content;
	this.quizs = quizs;
	this.t0 = null;
	this.usedTime = 0;

	this.addUsedTime = function(dt) {
		this.usedTime += dt;
	};
};

testDataStore.Section = function(name, problems) {
	this.name = name;
	this.problems = problems;
};

testDataStore.Exercise = function(pk, name, sections) {
	this.pk = pk;
	this.name = name;
	this.sections = sections;

	var list = [];
	var n = sections.length;
	for (var i = 0; i < n; ++i) {
		var sec = sections[i];
		sec.seq = i + 1;

		var m = sec.problems.length;
		if (m == 1) {
			var prob = sec.problems[0];
			if (!prob.name && !prob.content) {
				prob.seq = '';
				prob.section = sec;
				var p = prob.quizs.length;
				for (var k = 0; k < p; ++k) {
					var quiz = prob.quizs[k];
					quiz.seq = sec.seq + '.' + (k + 1);
					quiz.problem = prob;
					list.push(quiz);
				}
				continue;
			}
		}

		for (var j = 0; j < m; ++j) {
			var prob = sec.problems[j];
			prob.seq = sec.seq + '.' + (j + 1);
			prob.section = sec;
			if (prob.content) {
				list.push(prob);
			}
			var p = prob.quizs.length;
			for (var k = 0; k < p; ++k) {
				var quiz = prob.quizs[k];
				quiz.seq = prob.seq + '.' + (k + 1);
				quiz.problem = prob;
				list.push(quiz);
			}
		}
	}

	this.asList = function() {
		return list;
	};

	this.isCompleted = function() {
		var n = list.length;
		for (var i = 0; i < n; ++i) {
			var quiz = list[i];
			if (quiz instanceof testDataStore.Problem)
				continue;

			if (!quiz.answer.length)
				return false;
		}
		return true;
	};

	this.submit = function(okFunc, errFunc) {
		var result = {};
		var n = list.length;
		for (var i = 0; i < n; ++i) {
			var data = list[i];
			if (data instanceof testDataStore.Problem) {
				result['p' + data.pk] = data.usedTime;
			} else {
				result['q' + data.pk] = [data.usedTime, data.answer];
			}
		}

		var self = this;
		console.log(self.pk, self.name, result);
		setTimeout(function() {
			self.test.status = TEST_STATUS.SUBMITTED;

			var n = list.length, score = 0, total = 0;
			for (var i = 0; i < n; ++i) {
				var quiz = list[i];
				if (quiz instanceof testDataStore.Problem)
					continue;

				total += quiz.score;

				if (isAnswerCorrect(quiz))
					score += quiz.score;
			}
			self.test.score = score + '/' + total;
			self.test.setStatus(TEST_STATUS.SCORED);

			okFunc();
		}, 3000);
	};
};

var testExerciseDataList = (function() {
	var _TF = QUIZ_TYPE.TRUE_FALSE;
	var _SC = QUIZ_TYPE.SINGLE_CHOICE;
	var _MC = QUIZ_TYPE.MULTIPLE_CHOICE;
	var _FB = QUIZ_TYPE.FILL_BLANK;

	var sections = [
		new testDataStore.Section('Listening', [
			new testDataStore.Problem(1, '', '', [
				new testDataStore.Quiz(1, _TF, 'Do you hear sound? <myaudio src="/android_asset/www/N1S08-01.mp3" />', 5, [], [0]),
				new testDataStore.Quiz(2, _SC, 'What is this animal?', 5, ['Cat', 'Dog', 'Mice', 'None of above'], [3])
			])
		]),
		new testDataStore.Section('Grammar', [
			new testDataStore.Problem(2, 'Single Choice', '', [
				new testDataStore.Quiz(3, _SC, 'Which is correct?', 5, ['He is best', 'He is worse', 'He is worst', 'None of above'], [1]),
				new testDataStore.Quiz(4, _SC, 'Which is incorrect?', 5, ['He love her', 'You love him', 'We love you', 'They love me'], [0])
			]),
			new testDataStore.Problem(3, 'Multiple Choice', '', [
				new testDataStore.Quiz(5, _MC, 'Which is correct?', 10, ['He is the best', 'He is the worst', 'He is better', 'He is worse'], [0, 1, 2, 3]),
				new testDataStore.Quiz(6, _MC, 'Which is incorrect?', 10, ['Find the other one', 'Find another one', 'Find other one', 'Find the another one'], [2, 3])
			]),
			new testDataStore.Problem(4, 'Fill in the Blank', '', [
				new testDataStore.Quiz(7, _FB, 'We ____ going to the park ____ the morning.', 5, [], ['are', 'in']),
				new testDataStore.Quiz(8, _FB, 'The plane takes ____ in five minutes. Hurry ____.', 5, [], ['off', 'up'])
			])
		]),
		new testDataStore.Section('Reading', [
			new testDataStore.Problem(5, 'Three little pigs', 'Once upon time, there were three little pigs...<br/><img src="img/three-little-pigs.jpg"/>', [
				new testDataStore.Quiz(9, _TF, 'At the end, the wolf ate the pigs.', 5, [], [0]),
				new testDataStore.Quiz(10, _SC, 'How did the second pig build the house?', 5, ['Use bricks', 'Use sticks', 'Use straw', 'Use iron'], [1]),
				new testDataStore.Quiz(11, _SC, 'What is the name of the BBW?', 5, ['Bob', 'Mike', 'Wolf', 'Did not say'], [3]),
				new testDataStore.Quiz(12, _FB, 'The third ____ built the ____ with ____.', 5, [], ['pig', 'bricks']),
			]),
			new testDataStore.Problem(6, 'Dragon and Alice', 'Far far away, there lived a dragon...', [
				new testDataStore.Quiz(12, _MC, 'What does the dragon like?', 10, ['Eat apple', 'Gold', 'Play games', 'Sleep'], [1]),
				new testDataStore.Quiz(13, _MC, 'What is the story about?', 10, ['About a dragon', 'About a boy', 'About a girl', 'All of above'], [0, 2])
			])
		])
	];

	var list = [];
	for (var i = 0; i < testExamDataList.length; ++i) {
		var data = testExamDataList[i];
		list.push(new testDataStore.Exercise(data.pk, data.name, sections));
	}
	for (var i = 0; i < testAssignmentDataList.length; ++i) {
		var data = testAssignmentDataList[i];
		list.push(new testDataStore.Exercise(data.pk, data.name, sections));
	}
	return list;
})();

testDataStore.getTestDetail = function(data, okFunc, errFunc) {
	var n = testExerciseDataList.length, pk = data.pk;
	for (var i = 0; i < n; ++i) {
		var exercise = testExerciseDataList[i];
		if (pk == exercise.pk) {
			setTimeout(function() {
				exercise.test = data;
				okFunc(exercise);
			}, 3000);
			return;
		}
	}
	errFunc();
};
