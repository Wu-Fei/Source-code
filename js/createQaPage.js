var createQaPage = function() {
    var page = $('#CreateQaPage');

    var form = page.find('form');
    var txtQuestion = form.find('input[name=question]');
    var txtAnswer = form.find('textarea[name=answer]');
    var txtSearch = $('#condition');

    $('#saveanswer').on('click', function () {
        //realStart();
        //return;

        var question = $.trim(txtQuestion.val());
        var answer = $.trim(txtAnswer.val());

        //Validation Skipped

        //Save Question Example
        var newquestion = dataContext.create('Question');
        newquestion.IsPublic = true;
        newquestion.QuestionDetail = question;
        newquestion.Answer = answer;
        newquestion.Create = Date();
        newquestion.UserId = dataContext.user.Id;

        dataContext.save(newquestion).then(function () {
            alert('Question saved!');
        }).fail(function () {
            alert('Save failed!');
        });

    });

    $('#loadquestion').on('click', function () {
        //realStart();
        //return;
        $('#questionresult').empty();
        var condition = $('#condition').val();

        //Validation Skipped

        //Save Question Example
        dataContext.searchQuestion(condition, function(result) {
			var list = [];
			if ($.isArray(result)) {
				for (var i = 0; i < result.length; ++i) {
					var qa = result[i];
					list.push('<li><span>', qa.QuestionDetail, ' - [answer]: ', qa.Answer, '</span></li>');
				}
			}
			$('#questionresult').html(list.join(''));
        });
    });
};

