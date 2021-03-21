var selectid = 0;
var beforeid = 0;
var Max = 0;
var b = false;
$(document).ready(function() {
    $('#Number_topic').on('input', function() {
        if($('#Number_topic').val() > 0)
        {
            $('#topic').removeClass('disabled');
            $('#topic').addClass('active');
        }
    });
   
    $('body').on('mousedown', '.create-text-input-topic', function() {
        selectid = this.id;
     });
});
var nTopic_Count = 0;

var addTopicButtons = function() {
    if($('#Number_topic').val() > 0)
    {
        $('#add_topic_container').html("");
        $('#add_topic_container').append('\
            <a onclick="addSubTopic()"><u class = "disabled"  id = "subtopic">Add subtopic</u></a>\
            <br>\
            <a onclick="addTopic()"><u class = "active" id = "topic">Add topic</u></a>');
    }
    else if($('#Number_topic').val() == 0)
    {
        $('#add_topic_container').html("");
        $('#add_topic_container').append('\
            <a onclick="addSubTopic()"><u class = "disabled"  id = "subtopic">Add subtopic</u></a>\
            <br>\
            <a onclick="addTopic()"><u class = "disabled" id = "topic">Add topic</u></a>');
    }
}

var addTopic = function() {
    if($("#topic").attr('class').indexOf('disabled') >= 0){
        console.log('disabled add Topic');
        return;
    }
    $("#topic").removeClass('active');
    $("#topic").addClass('disabled');
    $("#subtopic").removeClass('disabled');
    $("#subtopic").addClass('active');
    if(b)
    {
       if($('#Number_topic').val() > nTopic_Count)
        {
            $('#topic_content').append(
                '<br><br><h6 class="title-font-size">Topic name</h6>\
                <input type="text" name="curse_name" class="create-text-input-topic topic"/>'
            );

            nTopic_Count++;
        } 
        b = false;
    }
    else if($('#Number_topic').val() > nTopic_Count)
    {
        $('#topic_content').append(
            '<h6 class="title-font-size">Topic name</h6>\
            <input type="text" name="curse_name" class="create-text-input-topic topic"/>'
        );

        nTopic_Count++;
    }
    if(nTopic_Count >= $('#Number_topic').val())
    {
        $("#topic").removeClass('active');
        $("#topic").addClass('disabled');
    }
}

var addSubTopic = function() {
    if($("#subtopic").attr('class').indexOf('disabled') >= 0)
        return;
    b = true;
    if(nTopic_Count > 0)
    {       
        $('#topic_content').append(
            '\<h6 class="title-font-size">Subtopic name</h6>\
            <input type="text" name="curse_name" class="create-text-input subtopic"/>'
        );
        $("#topic").removeClass('disabled');
        $("#topic").addClass('active');
    }
    if(nTopic_Count >= $('#Number_topic').val())
    {
        $("#CreateCourse").removeClass('disabled');
    }
}

var createCourse = function() {
    if($("#CreateCourse").attr('class').indexOf('disabled') >= 0)
        return;
    if($('#course_title').val() == "")
    {
        $('#course_title').focus();
        $('#invalidCoursenName').css('display', 'block');
        $('#course_title').css('border-color', '#ff1a1a');
       
    }
    else
    {
        $('#invalidCoursenName').css('display', 'none');
        $('#course_title').css('border-color', '#000');
    }
    if($('#Number_topic').val() == "")
    {
        $('#Number_topic').focus();
        $('#invalidNumbertopic').css('display', 'block');
        $('#Number_topic').css('border-color', '#ff1a1a');
        return;
    }
    else
    {
        $('#invalidNumbertopic').css('display', 'none');
        $('#Number_topic').css('border-color', '#000');
    }

     if($('#course_title').val() == "" || $('#Number_topic').val() == "")
         return;

     var jsonData = {};
     jsonData.title = $('#course_title').val();
     jsonData.topic = [];
     var c = $('#topic_content');
     $('.topic_content').each(function(i,a) {
        
         // jsonTopic.title = $(a).val();

         $(a).find('.create-text-input-topic.topic').each(function(j, b){
             var jsonTopic = {};
             jsonTopic.title = $(b).val();
             jsonTopic.subtopic = [];

             var next = $(b).next();
             while(true){
                 var className = $(next).attr('class');
                 if (className == 'create-text-input-topic topic' || typeof className == 'undefined')
                 {
                     break;
                 }
                 else if (className == 'create-text-input subtopic')
                 {
                     var jsonSubTopic = {};
                     jsonSubTopic.title = $(next).val();
                     jsonTopic.subtopic.push(jsonSubTopic);
                 }
                 next = $(next).next();
             }

             jsonData.topic.push(jsonTopic);
         });
        
     });

 //    $.post(Flask.url_for('main.create_course'), jsonData);

 //    $.ajax({
 //        type: 'POST',
 //        contentType: 'application/json',
 //        data: jsonData,
 //        dataType: 'json',
 //        url: Flask.url_for('main.create_course'),
 //        success: function(error) {
 //            console.log(e);
 //        },
 //        error: function(error) {
 //            console.log(error);
 //        }
 //    });

     $.ajax({
         type: 'POST',
         url: Flask.url_for('main.create_course'),
         data: JSON.stringify(jsonData),
         contentType: "application/json",
         dataType: 'json',
         success: function(response) {
             window.location=Flask.url_for('main.course', {user_id:response.user_id, course:response.course, user_role:"instructor"});
         },
         error: function(response) {
             document.write(response);
         }
     });
     // stop link reloading the page
 //    event.preventDefault();

}



