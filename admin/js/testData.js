QUIZ_TYPE = {};
QUIZ_TYPE.TRUE_FALSE = 'T';
QUIZ_TYPE.SINGLE_CHOICE = 'S';
QUIZ_TYPE.MULTIPLE_CHOICE = 'M';
QUIZ_TYPE.FILL_BLANK = 'B';

var testDataStore = {
};

testDataStore.Quiz = function(type, content, score, challenge, key) {
	this.type = type;
	this.content = content;
	this.score = score;
	this.challenge = challenge;
	this.key = key;
};

testDataStore.Problem = function(name, content) {
	this.name = name;
	this.content = content;
	this.quizs = [];

	this.addQuiz = function(quiz) {
		this.quizs.push(quiz);
	};

	this.remove = function() {
		var problems = this.section.problems;
		var n = problems.length;
		for (var i = 0; i < n; ++i) {
			if (problems[i].seq == this.seq) {
				problems.splice(i, 1);
				return true;
			}
		}
		return false;
	};

	this.moveUp = function() {
		var problems = this.section.problems;
		var n = problems.length;
		for (var i = 0; i < n; ++i) {
			if (problems[i].seq == this.seq) {
				if (i > 0) {
					var problem = problems[i];
					problems[i] = problems[i - 1];
					problems[i - 1] = problem;
					return true;
				}
				break;
			}
		}
		return false;
	};

	this.moveDown = function() {
		var problems = this.section.problems;
		var n = problems.length;
		for (var i = 0; i < n; ++i) {
			if (problems[i].seq == this.seq) {
				if (i < n - 1) {
					var problem = problems[i];
					problems[i] = problems[i + 1];
					problems[i + 1] = problem;
					return true;
				}
				break;
			}
		}
		return false;
	};
};

testDataStore.Section = function(name) {
	this.name = name;
	this.problems = [];

	this.addProblem = function(problem) {
		this.problems.push(problem);
	};

	this.remove = function() {
		var sections = this.exercise.sections;
		var n = sections.length;
		for (var i = 0; i < n; ++i) {
			if (sections[i].seq == this.seq) {
				sections.splice(i, 1);
				return true;
			}
		}
		return false;
	};

	this.moveUp = function() {
		var sections = this.exercise.sections;
		var n = sections.length;
		for (var i = 0; i < n; ++i) {
			if (sections[i].seq == this.seq) {
				if (i > 0) {
					var section = sections[i];
					sections[i] = sections[i - 1];
					sections[i - 1] = section;
					return true;
				}
				break;
			}
		}
		return false;
	};

	this.moveDown = function() {
		var sections = this.exercise.sections;
		var n = sections.length;
		for (var i = 0; i < n; ++i) {
			if (sections[i].seq == this.seq) {
				if (i < n - 1) {
					var section = sections[i];
					sections[i] = sections[i + 1];
					sections[i + 1] = section;
					return true;
				}
				break;
			}
		}
		return false;
	};
};

testDataStore.Exercise = function(name, clazz, isExam) {
	this.name = name;
	this.clazz = clazz;
	this.isExam = isExam;
	this.sections = [];

	this.addSection = function(section) {
		this.sections.push(section);
	};

	var list = [];
	this.refreshSeq = function() {
		list.length = 0;
		var n = this.sections.length;
		for (var i = 0; i < n; ++i) {
			var sec = this.sections[i];
			sec.seq = i + 1;
			sec.exercise = this;
			list.push(sec);

			var m = sec.problems.length;
			for (var j = 0; j < m; ++j) {
				var prob = sec.problems[j];
				prob.seq = sec.seq + '.' + (j + 1);
				prob.section = sec;
				list.push(prob);

				var p = prob.quizs.length;
				for (var k = 0; k < p; ++k) {
					var quiz = prob.quizs[k];
					quiz.seq = prob.seq + '.' + (k + 1);
					quiz.problem = prob;
					list.push(quiz);
				}
			}
		}

		return list;
	};

	this.asList = function() {
		return list;
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
		console.log(self.name, result);
	};
};
