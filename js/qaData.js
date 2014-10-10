var QaData = function(data){
	this.pk = data[0];
	this.question = data[1];
	this.answer = data[2];
};

var qaList = [
	new QaData([1, 'C&apos;est quoi la difference etre un peu et petit?', 'bla, bla, bla']),
	new QaData([2, 'C&apos;est quoi la hat is the difference between cat and dog?', 'Dog chases cat.']),
	new QaData([3, 'Is mice big?', 'No, it is small.']),
	new QaData([4, 'How dog catches mice?', 'The dog does not like to catch mice.'])
];

var searchAnswers = function(q, okFunc) {
	var words = q.toLowerCase().split(/\s+/);
	var wordnum = words.length, i, j;

	var result = [];
	for (i = qaList.length - 1; i >= 0; --i) {
		var question = qaList[i].question.toLowerCase();
		for (j = 0; j < wordnum; ++j) {
			if (question.indexOf(words[j]) < 0) {
				break;
			}
		}
		if (j == wordnum) {
			result.push(qaList[i]);
		}
	}

	setTimeout(function() {
		okFunc(result);
	}, 3000);
};

var askQuestion = function(clazz, question, okFunc, errFunc) {
	setTimeout(okFunc, 3000);
};