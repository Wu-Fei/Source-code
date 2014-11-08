var createMessagePage = function () {
    var page = $('#createMessagePage');

    var targetType = $('#target_type').val();
    var Targetvalue = $('#target').val();
    var announcementId; 
	var editor = new TINY.editor.edit('editor', {
	    id: 'announcement',
		width: 584,
		height: 175,
		cssclass: 'tinyeditor',
		controlclass: 'tinyeditor-control',
		rowclass: 'tinyeditor-header',
		dividerclass: 'tinyeditor-divider',
		controls: ['bold', 'italic', 'underline', 'strikethrough', '|', 'subscript', 'superscript', '|',
			'orderedlist', 'unorderedlist', '|', 'outdent', 'indent', '|', 'leftalign',
			'centeralign', 'rightalign', 'blockjustify', '|', 'unformat', '|', 'undo', 'redo', 'n',
			'font', 'size', 'style', '|', 'image', 'hr', 'link', 'unlink', '|', 'print'],
		footer: true,
		fonts: ['Verdana','Arial','Georgia','Trebuchet MS'],
		xhtml: true,
		cssfile: 'custom.css',
		bodyid: 'editor',
		footerclass: 'tinyeditor-footer',
		toggle: {text: 'source', activetext: 'wysiwyg', cssclass: 'toggle'},
		resize: {cssclass: 'resize'}
	});

	$('#save').on('click', function () {
        //realStart();
        //return;

		editor.post();

		var announcement = $.trim($('#announcement').val());
		var priority = parseInt($('#priority').val());
        //Validation Skipped

        //Save Question Example
        var newquestion = dataContext.create('Announcement');
        newquestion.Content = announcement;
        newquestion.Priority = priority;
        newquestion.Create = Date.now();

	    dataContext.save(newquestion).then(function () {
	        announcementId = newquestion.Id;
            $('#publishrow').toggleClass('visible');
        }).fail(function (error) {
            alert('Save failed!');
        });

    });


	$('#publish').on('click', function () {
	    //realStart();
	    //return;

	    var target = $.trim($('#target').val());
	    
	    dataContext.publishAnnouncement(announcementId, target, function (result, error) 
	    {
	            if (result)
	            {
	                alert(result.count);
	            };
	        }
	    );
	    
	});
    
};

