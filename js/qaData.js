var qaDataStore = {};

qaDataStore.QaData = function(question, answer){
	this.question = question;
	this.answer = answer;
};

qaDataStore.searchAnswers = function(q, okFunc) {
	dataContext.searchQuestion(q, function(result) {
		var list = [];
		if ($.isArray(result)) {
			for (var i = 0; i < result.length; ++i) {
				var qa = result[i];
				list.push(new qaDataStore.QaData(qa.QuestionDetail, qa.Answer));
			}
		}
		okFunc(list);
	});
};

qaDataStore.askQuestion = function(clazz, question, okFunc, errFunc) {
	setTimeout(okFunc, 3000);
};