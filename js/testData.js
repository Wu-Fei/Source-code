var testDataStore = {
};

var TestData = function(data){
	this.pk = data[0];
	this.clazz = data[1];
	this.name = data[2];
	this.isRead = data[3];
	this.isExam = data[4];

	this.setRead = function() {
		this.isRead = true;
		testDataStore.uipage.trigger('listchanged', [this.isExam]);
	};
};

testDataStore.setUIPage = function(page) {
	testDataStore.uipage = page;
};

var testAssignmentDataList = [
	new TestData([3, 1, '1.1 Assignment', true, false]),
	new TestData([4, 1, '1.2 Assignment', true, false]),
	new TestData([5, 2, '2.1 Assignment', true, false]),
	new TestData([6, 3, '2.2 Assignment', true, false]),
	new TestData([7, 2, '2.3 Assignment', true, false]),
	new TestData([8, 1, '3.1 Assignment', true, false])
];

var testExamDataList = [
	new TestData([1, 3, '2014 Final Test', false, true]),
	new TestData([2, 1, '2014 Middle Test', true, true])
];

testDataStore.getAssignmentDataList = function() {
	return testAssignmentDataList;
};

testDataStore.getExamDataList = function() {
	return testExamDataList;
};

testDataStore.TRUE_FALSE = 'T';
testDataStore.SINGLE_CHOICE = 'S';
testDataStore.MULTIPLE_CHOICE = 'M';

testDataStore.Quiz = function(pk, type, content, score, challenge) {
	this.pk = pk;
	this.type = type;
	this.content = content;
	this.score = score;
	this.challenge = challenge;
	this.answer = [];

	this.setAnswer = function(answer) {
		this.answer = answer;
	};
};

testDataStore.Problem = function(name, content, quizs) {
	this.name = name;
	this.content = content;
	this.quizs = quizs;
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
			var quiz = list[i];
			if (quiz instanceof testDataStore.Problem)
				continue;

			result['' + quiz.pk] = quiz.answer;
		}

		console.log(result);
		setTimeout(okFunc, 3000);
	};
};

var testExerciseDataList = (function() {
	var _TF = testDataStore.TRUE_FALSE;
	var _SC = testDataStore.SINGLE_CHOICE;
	var _MC = testDataStore.MULTIPLE_CHOICE;

	var sections = [
		new testDataStore.Section('Listening', [
			new testDataStore.Problem('', '', [
				new testDataStore.Quiz(1, _TF, 'Do you hear sound?', 5),
				new testDataStore.Quiz(2, _SC, 'What is this animal?', 5, ['Cat', 'Dog', 'Mice', 'None of above'])
			])
		]),
		new testDataStore.Section('Grammar', [
			new testDataStore.Problem('Single Choice', '', [
				new testDataStore.Quiz(3, _SC, 'Which is correct?', 5, ['He is best', 'He is worse', 'He is worst', 'None of above']),
				new testDataStore.Quiz(4, _SC, 'Which is incorrect?', 5, ['He love her', 'You love him', 'We love you', 'They love me'])
			]),
			new testDataStore.Problem('Multiple Choices', '', [
				new testDataStore.Quiz(5, _MC, 'Which is correct?', 10, ['He is the best', 'He is the worst', 'He is better', 'He is worse']),
				new testDataStore.Quiz(6, _MC, 'Which is incorrect?', 10, ['Find the other one', 'Find another one', 'Find other one', 'Find the another one'])
			])
		]),
		new testDataStore.Section('Reading', [
			new testDataStore.Problem('', 'Once upon time, there were three little pigs...<br/><img src="img/three-little-pigs.jpg"/>', [
				new testDataStore.Quiz(7, _TF, 'At the end, the wolf ate the pigs.', 5),
				new testDataStore.Quiz(8, _SC, 'How did the second pig build the house?', 5, ['Use bricks', 'Use sticks', 'Use straw', 'Use iron']),
				new testDataStore.Quiz(9, _SC, 'What is the name of the BBW?', 5, ['Bob', 'Mike', 'Wolf', 'Did not say'])
			]),
			new testDataStore.Problem('', 'Far far away, there lived a dragon...', [
				new testDataStore.Quiz(10, _MC, 'What does the dragon like?', 10, ['Eat apple', 'Gold', 'Play games', 'Sleep']),
				new testDataStore.Quiz(11, _MC, 'What is the story about?', 10, ['About a dragon', 'About a boy', 'About a girl', 'All of above'])
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

testDataStore.getTestDetail = function(pk, okFunc, errFunc) {
	var n = testExerciseDataList.length;
	for (var i = 0; i < n; ++i) {
		var exercise = testExerciseDataList[i];
		if (pk == exercise.pk) {
			setTimeout(function() {
				console.log('loaded exercise', exercise.name);
				okFunc(exercise);
			}, 3000);
			return;
		}
	}
	errFunc();
};
