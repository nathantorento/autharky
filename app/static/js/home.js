var cur_course_id = 0;
var cur_topic_id = 0;
var current_subtopic_id = 0;
var user_id = 0;
var test_finish = false;
var question_count = 0;
$(document).ready(function() {
	$('#questionEdit').hide();
	$('#manually').hide();
	$('#upload').hide();

    $('#answer-fieldA').on('mousedown', function(){
        $('#answer-fieldA').css('background-color', '#00b300');
        $('#answer-fieldB').css('background-color', '#ffb3b3');
        $('#answer-fieldC').css('background-color', '#ffb3b3');
        $('#answer-fieldD').css('background-color', '#ffb3b3');
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

     $('#answer-imageD').on('mousedown', function(){
        $('#answer-imageD').css('background-color', '#00b300');
        $('#answer-imageA').css('background-color', '#ffb3b3');
        $('#answer-imageB').css('background-color', '#ffb3b3');
        $('#answer-imageC').css('background-color', '#ffb3b3');
    });

    $('#answer-imageA').on('mousedown', function(){
        $('#answer-imageA').css('background-color', '#00b300');
        $('#answer-imageB').css('background-color', '#ffb3b3');
        $('#answer-imageC').css('background-color', '#ffb3b3');
        $('#answer-imageD').css('background-color', '#ffb3b3');
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

    $('#modalbtn').on('click', function() {
        $('#selectQuestionType').show();
        $('#questionEdit').hide(); 
        $('#test').css('display', 'none');

        $('#imageQuestion').attr("src","");
        $('#testqueston').attr("src","");
        $('#imageA').attr("src","");
        $('#imageB').attr("src","");
        $('#imageC').attr("src","");
        $('#imageD').attr("src","");  
        $('#testimageA').attr("src","");
        $('#testimageB').attr("src","");
        $('#testimageC').attr("src","");
        $('#testimageD').attr("src","");

        $('#answer-imageA').css('background-color', '#ffb3b3');
        $('#answer-imageB').css('background-color', '#ffb3b3');
        $('#answer-imageC').css('background-color', '#ffb3b3');
        $('#answer-imageD').css('background-color', '#ffb3b3');
        $('#test-imageA').css('background-color', '#ffb3b3');
        $('#test-imageB').css('background-color', '#ffb3b3');
        $('#test-imageC').css('background-color', '#ffb3b3');
        $('#test-imageD').css('background-color', '#ffb3b3');

        $("#radioA").prop("checked", 'false');
    });

    $('#Questionbtn').on('click', function() {
        if($(".test-question").length == 0) {
            $("#Questionbtn").css("cursor","not-allowed");
            alert('there is no question for this subtopic');
            return;
        }
        $('#selectQuestionType').hide();
        $('#test').css('display', 'block');
        $(".test-question").css('display','none');
        $("#test1").css('display','block');
    });

    $('#createtest').on('click', function(){
        if (test_finish)
        {
            $('#createtest').html("Next question");
    //	    $('#modal').hide();
    //	    $('#selectQuestionType').show();
    //        modalClose();
                var obj = $('#modal');
            $('.close').click();
            test_finish = false;
            return;
        }

        var select_id = 0;
        $("#radioA").change(function() {
          select_id = $(this).children(":selected").attr("id");
        });
        $("#radioB").change(function() {
          select_id = $(this).children(":selected").attr("id");
        });
        $("#radioC").change(function() {
          select_id = $(this).children(":selected").attr("id");
        });
        $("#radioD").change(function() {
          select_id = $(this).children(":selected").attr("id");
        });

        var param = {}
        param.course_id = cur_course_id;
        param.topic_id = cur_topic_id;
        param.subtopic_id = current_subtopic_id;
        param.user_id = user_id;
        param.select_id = select_id;

        $.ajax({
             type: 'POST',
             url: Flask.url_for('main.get_testinfo'),
             data: JSON.stringify(param),
             contentType: "application/json",
             dataType: 'json',
             success: function(response) {

                 console.log(response);
                 if (response.is_end)
                 {
                    $('#createtest').html("Finish Test");
                    test_finish = true;
                 }
                 else
                 {
                     $('#testqueston').attr("src", response.question);
                     $('#testimageA').attr("src",response.answers[0]);
                     $('#testimageB').attr("src",response.answers[1]);
                     $('#testimageC').attr("src",response.answers[2]);
                     $('#testimageD').attr("src",response.answers[3]);
                     current_subtopic_id = response.id;
                 }
             },
             error: function(response) {
                console.log(response);
             }
        });
    });



});


var subtopicClick = function(course_id, subtopic_id, userid)
{
    
    $("#studyGuide").summernote("code", "");
    cur_course_id = course_id;
//    cur_topic_id = topic_id;
    user_id = userid;
    console.log(subtopic_id);
    current_subtopic_id = subtopic_id;
    $('#cover').css('display', 'none');
    $('#CreateBtn').css('display', 'none');
    $('.courseContainer').css('display', 'block');
    var param = {}
    param.course_id = cur_course_id;
//    param.topic_id = cur_topic_id;
    param.subtopic_id = subtopic_id;
    $(".subTopic").removeClass('selected');
    $("#sub_topic"+subtopic_id).addClass('selected');
    $.ajax({
        type: 'POST',
        url: Flask.url_for('main.get_study'),
        data: JSON.stringify({subtopic_id:current_subtopic_id,user_id:user_id}),
        contentType: "application/json",
        dataType: 'json',
        success: function(response) {
            $("#studyGuide").summernote("code", response.study);
        },
        error: function(response) {
            document.write(response);
        }
   });    
    $.ajax({
         type: 'POST',
         url: Flask.url_for('main.getsubtopicinfo'),
         data: JSON.stringify(param),
         contentType: "application/json",
         dataType: 'json',
         success: function(response) {
             question_count = response.count;
             $(".question-number").html("Question "+(question_count+1));
             $("#test").html("");
             for(var i = 0 ;i < response.count ;i++) {
                if(response.question[i].question_type == 0) {
                    question = '<h4>'+response.question[i].question+'</h4>';
                    answer1 = '<h4>'+response.question[i].answer1+'</h4>';
                    answer2 = '<h4>'+response.question[i].answer2+'</h4>';
                    answer3 = '<h4>'+response.question[i].answer3+'</h4>';
                    answer4 = '<h4>'+response.question[i].answer4+'</h4>';
                }else {
                    question = '\
                    <div class="" style="width: 100%;height: 315px;">\
                        <img  src="'+response.question[i].question+'" style = "width: 50%; height: 50%;" alt>\
                    </div>';
                    answer1 = '<img src="'+response.question[i].answer1+'" alt>';
                    answer2 = '<img src="'+response.question[i].answer2+'" alt>';
                    answer3 = '<img src="'+response.question[i].answer3+'" alt>';
                    answer4 = '<img src="'+response.question[i].answer4+'" alt>';
                }
                if(i == response.count - 1) {
                    BottomButton = '<button class="btn-light" onClick="finishQuestion()" id="finishQuestioBtn">Finish test</button>';
                } else {
                    BottomButton = '<button class="btn-light" onClick="nextQuestion()">Next question</button>';
                }
                $("#test").append('\
                <div class="test-question" id="test'+(i+1)+'">\
                    <h6 class="text-left">Question '+(i+1)+':</h6>\
                    <div class="question-name">\
                        '+question+'\
                    </div>\
                    <br>\
                    <h6 class="text-left">Answers: (Don\'t forget to select the correct answer)</h6>\
                    <div class="answer-container">\
                        <div>\
                            <div class="row m-l-0 m-r-0">\
                                <div class="col-md-6 answer-field">\
                                    <div class="col-md-2 m-l-0 m-r-0 float-l">\
                                        <input type="radio" id="radioA'+(i+1)+'" name="radio'+(i+1)+'" style="height:27px; width:28px;">\
                                    </div>\
                                    <div class="col-md-10 m-l-0 m-r-0 float-r">\
                                        ' + answer1 + '\
                                    </div>\
                                </div>\
                                <div class="col-md-6 answer-field">\
                                    <div class="col-md-2 m-l-0 m-r-0 float-l">\
                                        <input type="radio" id="radioB'+(i+1)+'" name="radio'+(i+1)+'" style="height:27px; width:28px;">\
                                    </div>\
                                    <div class="col-md-10 m-l-0 m-r-0 float-r">\
                                        ' + answer2+ '\
                                    </div>\
                                </div>\
                            </div>\
                            <div class="row m-l-0 m-r-0">\
                                <div class="col-md-6 answer-field">\
                                    <div class="col-md-2 m-l-0 m-r-0 float-l">\
                                        <input type="radio" id="radioC'+(i+1)+'" name="radio'+(i+1)+'" style="height:27px; width:28px;">\
                                    </div>\
                                    <div class="col-md-10 m-l-0 m-r-0 float-r">\
                                        ' + answer3+ '\
                                    </div>\
                                </div>\
                                <div class="col-md-6 answer-field">\
                                    <div class="col-md-2 m-l-0 m-r-0 float-l">\
                                        <input type="radio" id="radioD'+(i+1)+'" name="radio'+(i+1)+'" style="height:27px; width:28px;">\
                                    </div>\
                                    <div class="col-md-10 m-l-0 m-r-0 float-r" style = "margin-bottom: 5px;">\
                                        ' + answer4+ '\
                                    </div>\
                                </div>\
                            </div>\
                        </div>\
                    </div>\
                    <br>\
                    <div class="test-result" style="display:none" id="testResult'+(i+1)+'"></div>\
                        '+ BottomButton + '\
                    <input type="hidden" class="hidden-question-number" value="'+(i+1)+'">\
                </div>\
                ');
                $.ajax({
                    type: 'POST',
                    url: Flask.url_for('main.get_testinfo'),
                    data: JSON.stringify({subtopic_id:current_subtopic_id,user_id:user_id}),
                    contentType: "application/json",
                    dataType: 'json',
                    success: function(response) {
                        console.log(response);
                        if(!response.tested) {
                            test_finish = false;
                            return;
                        }
                        test_finish = true;
                        $(".test-question input:radio").prop('disabled',true);
                        $(".test-result").css('display','block');
                        for( i = 0 ;i < response.is_correct.length ;i++) {
                            if(response.is_correct[i] == 1) {
                                $("#testResult"+(i+1)).css('display','block');
                                $("#testResult"+(i+1)).html('<img src="' + $("#yesImgURL").val()+'" alt="" width="100px" height="100px">');
                            }
                            else {
                                $("#testResult"+(i+1)).css('display','block');
                                $("#testResult"+(i+1)).html('<img src="' + $("#noImgURL").val()+'" alt="" width="100px" height="100px">');
                            }
                            if(response.answers[i] == 1) $("#radioA"+(i+1)).prop('checked',true);
                            if(response.answers[i] == 2) $("#radioB"+(i+1)).prop('checked',true);
                            if(response.answers[i] == 3) $("#radioC"+(i+1)).prop('checked',true);
                            if(response.answers[i] == 4) $("#radioD"+(i+1)).prop('checked',true);
                        }
                        $("#finishQuestioBtn").css('display','none');
                    },
                    error: function(response) {
                        document.write(response);
                    }
               });               
            }
         },
         error: function(response) {
             console.log("Failed to load subtopic questions:" + response);
         }
    });
}
var nextQuestion = function() {
    currentQuestion = parseInt($(".test-question:visible").children('.hidden-question-number').val());
    $("#test"+currentQuestion).css("display","none");
    $("#test"+(currentQuestion+1)).css("display","block");
}
var finishQuestion = function() {
    console.log("Test Finished");
    answers = [];
    $( ".test-question" ).each(function( index ) {
        answer = 0;
        if($("#radioA"+(index+1)).prop('checked')) answer = 1;
        if($("#radioB"+(index+1)).prop('checked')) answer = 2;
        if($("#radioC"+(index+1)).prop('checked')) answer = 3;
        if($("#radioD"+(index+1)).prop('checked')) answer = 4;
        answers.push(answer);
    });
    $.ajax({
        type: 'POST',
        url: Flask.url_for('main.finish_test'),
        data: JSON.stringify({answers:answers,subtopic_id:current_subtopic_id,user_id:user_id}),
        contentType: "application/json",
        dataType: 'json',
        success: function(response) {
            console.log(response);
            test_finish = true;
            currentQuestion = parseInt($(".test-question:visible").children('.hidden-question-number').val());
            $("#test"+currentQuestion).css("display","none");
            $("#test1").css("display","block");
            $(".test-question input:radio").prop('disabled',true);
            $(".test-result").css('display','block');
            var correction = 1;
            for( i = 0 ;i < response.is_correct.length ;i++) {
                if(response.is_correct[i] == 1){
                    $("#testResult"+(i+1)).css('display','block');
                    $("#testResult"+(i+1)).html('<img src="' + $("#yesImgURL").val()+'" alt="" width="100px" height="100px">');
                }
                else{
                    $("#testResult"+(i+1)).css('display','block');
                    $("#testResult"+(i+1)).html('<img src="' + $("#noImgURL").val()+'" alt="" width="100px" height="100px">');
                    correction = 0;
                }
            }
            if(correction == 1) {
                $("#sub_topic"+current_subtopic_id).addClass('right-answer');
            } else {
                $("#sub_topic"+current_subtopic_id).addClass('wrong-answer');
            }
            $("#finishQuestioBtn").css('display','none');
        },
        error: function(response) {
            document.write(response);
        }
   });
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
	$('#questionEdit').hide();
	$('#test').hide();
    resetQuestionField();
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

var createQuestion = function(type=0) {
    console.log("create Question");
    question = type==0?$("#textQuestion").val():$('#imageQuestion').attr('src');
    correct = 0;
    answer1 = type==0?$("#QToptionA").val():$('#imageA').attr('src');
    answer2 = type==0?$("#QToptionB").val():$('#imageB').attr('src');
    answer3 = type==0?$("#QToptionC").val():$('#imageC').attr('src');
    answer4 = type==0?$("#QToptionD").val():$('#imageD').attr('src');
    subtopic_id = current_subtopic_id;
    console.log('question count:'+ question_count);
    if($("#QTradioA").prop("checked") && type ==0) correct = 1;
    if($("#QTradioB").prop("checked") && type == 0) correct = 2;
    if($("#QTradioC").prop("checked") && type == 0) correct = 3;
    if($("#QTradioD").prop("checked") && type == 0) correct = 4;
    if($("#QIradioA").prop("checked") && type ==1) correct = 1;
    if($("#QIradioB").prop("checked") && type ==1) correct = 2;
    if($("#QIradioC").prop("checked") && type ==1) correct = 3;
    if($("#QIradioD").prop("checked") && type ==1) correct = 4;
    if(question == "" && type == 0) {
        $("#createQuestionTextError").css("display","block");
        $("#createQuestionTextError").html("Please feel question text");
        return;
    }
    if(correct == 0 && type == 0) {
        $("#createQuestionTextError").css("display","block");
        $("#createQuestionTextError").html("Please select the correct answer");
        return;
    }
    if((answer1 == "" || answer2 == "" || answer3 == "" || answer4 == "") && type == 0) {
        $("#createQuestionTextError").css("display","block");
        $("#createQuestionTextError").html("Please select the fill all answers");
        return;
    }
    if(question == "" && type == 1) {
        $("#createQuestionImageError").css("display","block");
        $("#createQuestionImageError").html("Please upload image for question");
        return;
    }
    if(correct == 0 && type == 1) {
        $("#createQuestionImageError").css("display","block");
        $("#createQuestionImageError").html("Please select the correct answer");
        return;
    }
    if((answer1 == "" || answer2 == "" || answer3 == "" || answer4 == "") && type == 1) {
        $("#createQuestionImageError").css("display","block");
        $("#createQuestionImageError").html("Please upload images for all answers");
        return;
    }
    $.ajax({
        type: 'POST',
        url: Flask.url_for('main.create_question'),
        data: JSON.stringify({question_type: type,question:question,answer1:answer1,answer2:answer2,answer3:answer3,answer4:answer4,correct:correct,subtopic_id:current_subtopic_id,number:question_count + 1}),
        contentType: "application/json",
        dataType: 'json',
        success: function(response) {
            console.log(response);
            question_count = response.question_number;
            $(".question-number").html("Question "+(question_count+1));
            modalClose();
        },
        error: function(response) {
            document.write(response);
        }
   });
}
var resetQuestionField = function() {
    $("#textQuestion").val("");
    $("#QTradioA").prop("checked",false);
    $("#QTradioB").prop("checked",false);
    $("#QTradioC").prop("checked",false);
    $("#QTradioD").prop("checked",false);
    $("#QToptionA").val("");
    $("#QToptionB").val("");
    $("#QToptionC").val("");
    $("#QToptionD").val("");
    $("#createQuestionTextError").css("display","none");

    $("#imageQuestion").attr("src","");
    $("#QIradioA").prop("checked",false);
    $("#QIradioB").prop("checked",false);
    $("#QIradioC").prop("checked",false);
    $("#QIradioD").prop("checked",false);
    $("#imageA").attr("src","");
    $("#imageB").attr("src","");
    $("#imageC").attr("src","");
    $("#imageD").attr("src","");
    $("#createQuestionImageError").css("display","none");
}
var uploadCourse = function(){

    var brequest = false;
    var selectedA = "off";
    var selectedB = "off";
    var selectedC = "off";
    var selectedD = "off";
    var correctanswer = 0;
    selectedA = $("input:radio[name=radioA]:checked").val();
    selectedB = $("input:radio[name=radioB]:checked").val();
    selectedC = $("input:radio[name=radioC]:checked").val();
    selectedD = $("input:radio[name=radioD]:checked").val();

    if(selectedA == "on" || selectedB == "on" || selectedC == "on" || selectedD == "on")
               brequest = true;  
    if(!brequest)
      alert("Please select the option!"); 

    if($('#imageQuestion').src != "")
     {
        var ncnt = 0;
        if($('#imageA').attr('src') != "")
            ncnt++;
        if($('#imageB').attr('src') != "")
            ncnt++;
        if($('#imageC').attr('src') != "")
            ncnt++;
        if($('#imageD').attr('src') != "")
            ncnt++;
        if(ncnt == 4)
        {
            if(selectedA == "on") correctanswer = 1;
            if(selectedB == "on") correctanswer = 2;
            if(selectedC == "on") correctanswer = 3;
            if(selectedD == "on") correctanswer = 4;    
        }
        else if(ncnt < 4)
        {
            if(brequest)
                alert("Please insert an image in the blank!");
            else
                alert("Please select the option!");
        }
        
     }
    if(brequest == false)
        return;

    var jsonData = {};
    jsonData.subtopic_id = current_subtopic_id;
    var imgQuestion = $('#imageQuestion').attr('src');
    jsonData.correct_answer = correctanswer;
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
             console.log(response);
             modalClose();
             $("#modal").attr("aria-hidden", "false").attr("aria-hidden", "true");
             $("#modal").removeClass('show').css('display', 'none');
             $(".modal-backdrop").hide();
             $(".jvectormap-tip").show();
             $('body').removeClass('modal-open').attr('style', '');
             $('.modal-backdrop').remove();
             $('#modalbtn').hide();
             var txt = 'Question: ' + correctanswer;
             $('#Questionbtn').show().text(txt);
         },
         error: function(response) {
             document.write(response);
         }
    });
}

var joinCourse = function(user_id,user_role) {
    var course = $("#searchCourse").val();
    if( course == "")
    {
        $("#joinCourseError").css("display","block");
        $("#joinCourseError").html("Please fill the class name");
        return;
    }
    $.ajax({
        type: 'POST',
        url: Flask.url_for('main.joinCourse'),
        data: JSON.stringify({"course" : course}),
        contentType: "application/json",
        dataType: 'json',
        success: function(response) {
            if(response.exist) {
                window.location=Flask.url_for('main.course', {user_id:user_id, course:course, user_role:user_role});
            } else {
                $("#joinCourseError").css("display","block");
                $("#joinCourseError").html("There is no existing class");
                $("#searchCourse").val("");
            }
        },
        error: function(response) {
            document.write(response);
        }
   });
}

var delCourse = function(user_id, course_id, user_role) {
    var r = confirm("Do you really want to delete this course?");
    if( r == false) return;
    $.ajax({
        type: 'POST',
        url: Flask.url_for('main.delCourse'),
        data: JSON.stringify({"user_id" : user_id,"course_id": course_id}),
        contentType: "application/json",
        dataType: 'json',
        success: function(response) {
            window.location=Flask.url_for('main.home', {user_id:user_id, user_role:user_role});
        },
        error: function(response) {
            document.write(response);
        }
   });
}
