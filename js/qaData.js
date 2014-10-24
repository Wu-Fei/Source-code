var QaData = function(question, answer){
	this.question = question;
	this.answer = answer;
};

var searchAnswers = function(q, okFunc) {
	dataContext.searchQuestion(q, function(result) {
		var list = [];
		for (var i = 0; i < result.length; ++i) {
			var qa = result[i];
			list.push(new QaData(qa.QuestionDetail, qa.Answer));
		}
		okFunc(list);
	});
};

var askQuestion = function(clazz, question, okFunc, errFunc) {
	setTimeout(okFunc, 3000);
};