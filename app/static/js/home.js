$(document).ready(function() {
	$('#questionEdit').hide();
	$('#manually').hide();
	$('#upload').hide();
    $('#answer-fieldA').on('mousedown', function(){
        $('#answer-fieldA').css('background-color', '#00b300');
        $('#answer-fieldB').css('background-color', '#ffb3b3');
        $('#answer-fieldC').css('background-color', '#ffb3b3');
        $('#answer-fieldC').css('background-color', '#ffb3b3');
    });
    $('#answer-fieldB').on('mousedown', function(){
        $('#answer-fieldB').css('background-color', '#00b300');
        $('#answer-fieldA').css('background-color', '#ffb3b3');
        $('#answer-fieldC').css('background-color', '#ffb3b3');
        $('#answer-fieldD').css('background-color', '#ffb3b3');
    });
    $('#answer-fieldC').on('mousedown', function(){
        $('#answer-fieldC').css('background-color', '#00b300');
        $('#answer-fieldA').css('background-color', '#ffb3b3');
        $('#answer-fieldB').css('background-color', '#ffb3b3');
        $('#answer-fieldD').css('background-color', '#ffb3b3');
    });
    $('#answer-fieldD').on('mousedown', function(){
        $('#answer-fieldD').css('background-color', '#00b300');
        $('#answer-fieldA').css('background-color', '#ffb3b3');
        $('#answer-fieldB').css('background-color', '#ffb3b3');
        $('#answer-fieldC').css('background-color', '#ffb3b3');
    });

    $('#answer-imageA').on('mousedown', function(){
        $('#answer-imageA').css('background-color', '#00b300');
        $('#answer-imageB').css('background-color', '#ffb3b3');
        $('#answer-imageC').css('background-color', '#ffb3b3');
        $('#answer-imageC').css('background-color', '#ffb3b3');
    });
    $('#answer-imageB').on('mousedown', function(){
        $('#answer-imageB').css('background-color', '#00b300');
        $('#answer-imageA').css('background-color', '#ffb3b3');
        $('#answer-imageC').css('background-color', '#ffb3b3');
        $('#answer-imageD').css('background-color', '#ffb3b3');
    });
    $('#answer-imageC').on('mousedown', function(){
        $('#answer-imageC').css('background-color', '#00b300');
        $('#answer-imageA').css('background-color', '#ffb3b3');
        $('#answer-imageB').css('background-color', '#ffb3b3');
        $('#answer-imageD').css('background-color', '#ffb3b3');
    });
    $('#answer-imageD').on('mousedown', function(){
        $('#answer-imageD').css('background-color', '#00b300');
        $('#answer-imageA').css('background-color', '#ffb3b3');
        $('#answer-imageB').css('background-color', '#ffb3b3');
        $('#answer-imageC').css('background-color', '#ffb3b3');
    });
    
});

var current_subtopic_id = 0;
var subtopicClick = function(subtopic_id)
{
    current_subtopic_id = subtopic_id;
    $('#cover').css('display', 'none');
    $('#CreateBtn').css('display', 'none');
    $('.courseContainer').css('display', 'block');
}

var typeManually = function() {
	showQuestionEdit();
	$('#manually').show();
}

var uploadPicture = function() {
	showQuestionEdit();
	$('#upload').show();
}

var showQuestionEdit = function() {
	$('#selectQuestionType').hide();
	$('#questionEdit').show();
	$('#manually').hide();
	$('#upload').hide();
}

var modalClose = function() {
	$('#selectQuestionType').show();
	$('#questionEdit').hide();
}

var buttonQuestionClick = function() {
    console.log("buttonQuestion click");
    $('#attachmentQuestion').click();
}

var showImageQuestion = function() {
	if($('input[name=attachmentQuestion]').prop('files')[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
        	console.log("image path = ", e.target.result);
            $('#imageQuestion').attr('src', e.target.result);
            $('#imageQuestion').css('display', 'block');
        };
        reader.readAsDataURL($('input[name=attachmentQuestion]').prop('files')[0]);
    }
}
var buttonAClick = function() {
    console.log("buttonA click");
    $('#attachmentA').click();
}

var showImageA = function() {
    if($('input[name=attachmentA]').prop('files')[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $('#imageA').attr('src', e.target.result);
        };
        reader.readAsDataURL($('input[name=attachmentA]').prop('files')[0]);
    }
}

var buttonBClick = function() {
	$('#attachmentB').click();
}

var showImageB = function() {
	if($('input[name=attachmentB]').prop('files')[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $('#imageB').attr('src', e.target.result);
        };
        reader.readAsDataURL($('input[name=attachmentB]').prop('files')[0]);
    }
}

var buttonCClick = function() {
	$('#attachmentC').click();
}

var showImageC = function() {
	if($('input[name=attachmentC]').prop('files')[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $('#imageC').attr('src', e.target.result);
        };
        reader.readAsDataURL($('input[name=attachmentC]').prop('files')[0]);
    }
}

var buttonDClick = function() {
	$('#attachmentD').click();
}

var showImageD = function() {
	if($('input[name=attachmentD]').prop('files')[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $('#imageD').attr('src', e.target.result);
        };
        reader.readAsDataURL($('input[name=attachmentD]').prop('files')[0]);
    }
}

var uploadCourse = function(){
    var jsonData = {};
    jsonData.subtopic_id = current_subtopic_id;
    var imgQuestion = $('#imageQuestion').attr('src');
    jsonData.imgQuestion = imgQuestion;
    jsonData.imgAnswers = [];
    jsonData.imgAnswers.push($('#imageA').attr('src'));
    jsonData.imgAnswers.push($('#imageB').attr('src'));
    jsonData.imgAnswers.push($('#imageC').attr('src'));
    jsonData.imgAnswers.push($('#imageD').attr('src'));


    $.ajax({
         type: 'POST',
         url: Flask.url_for('main.upload'),
         data: JSON.stringify(jsonData),
         contentType: "application/json",
         dataType: 'json',
         success: function(response) {
             console.log('success to upload')
         },
         error: function(response) {
             document.write(response);
         }
     });

}