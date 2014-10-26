var qaDataStore = {};

qaDataStore.QaData = function(question, answer){
	this.question = question;
	this.answer = answer;
};

qaDataStore.searchAnswers = function(q, callback) {
	dataContext.searchQuestion(q, function(result, err) {
		var list = [];
		if ($.isArray(result)) {
			for (var i = 0; i < result.length; ++i) {
				var qa = result[i];
				list.push(new qaDataStore.QaData(qa.QuestionDetail, qa.Answer));
			}
		}
		callback(list);
	});
};

qaDataStore.askQuestion = function(clazz, question, okFunc, errFunc) {
	setTimeout(okFunc, 3000);
};