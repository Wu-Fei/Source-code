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
        var newquestion = eclasso2o.data.create('Question');
        newquestion.IsPublic = true;
        newquestion.QuestionDetail = question;
        newquestion.Answer = answer;
        newquestion.Create = Date();
        newquestion.UserId = eclasso2o.data.user.Id;

        eclasso2o.data.save(newquestion).then(function () {
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
        eclasso2o.data.searchQuestion(condition).then(function (data) {
            data.results.forEach(function (q) {
                $('#questionresult').append('<li><span>' + q.QuestionDetail + ' ' + q.Answer + '</span></li>');
            });
        });

    });
};
