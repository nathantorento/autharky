/* ------------------------------------ Click on login and Sign Up to  changue and view the effect
---------------------------------------
*/

// function cambiar_login() {
//   document.querySelector('.cont_forms').className = "cont_forms cont_forms_active_login";
// document.querySelector('.cont_form_login').style.display = "block";
// document.querySelector('.cont_form_sign_up').style.opacity = "0";

// setTimeout(function(){  document.querySelector('.cont_form_login').style.opacity = "1"; },400);

// setTimeout(function(){
// document.querySelector('.cont_form_sign_up').style.display = "none";
// },200);
//   }

// function cambiar_sign_up(at) {
//   document.querySelector('.cont_forms').className = "cont_forms cont_forms_active_sign_up";
//   document.querySelector('.cont_form_sign_up').style.display = "block";
// document.querySelector('.cont_form_login').style.opacity = "0";

// setTimeout(function(){  document.querySelector('.cont_form_sign_up').style.opacity = "1";
// },100);

// setTimeout(function(){   document.querySelector('.cont_form_login').style.display = "none";
// },400);


// }



// function ocultar_login_sign_up() {

// document.querySelector('.cont_forms').className = "cont_forms";
// document.querySelector('.cont_form_sign_up').style.opacity = "0";
// document.querySelector('.cont_form_login').style.opacity = "0";

// setTimeout(function(){
// document.querySelector('.cont_form_sign_up').style.display = "none";
// document.querySelector('.cont_form_login').style.display = "none";
// },500);

//   }


(function ($) {

    "use strict";

    /*==================================================================
    [ Validate ]*/
    var input = $('.validate-input .input100');

    $('.validate-form').on('submit',function(){
        var check = true;
        if($('#pass').val() != $('#repeat'))

        for(var i=0; i<input.length; i++) {
            if(validate(input[i]) == false){
                showValidate(input[i]);
                check=false;
            }
        }
        if($('#passw').val() != $('#repeat').val())
        {
        	if($('#repeat').val() == "")
        		$('#repeat').parent().addClass('alert-validate').attr('data-validate', 'Please re-enter your password.');
        	else
        		$('#repeat').parent().addClass('alert-validate').attr('data-validate', 'Passwords do not match.');
        	check = false;
        }
        else
        	check = true;
        return check;
    });


    $('.validate-form .input100').each(function(){
        $(this).focus(function(){
           hideValidate(this);
        });
    });

    function validate (input) {
        if($(input).attr('type') == 'email' || $(input).attr('name') == 'email') {
            if($(input).val().trim().match(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/) == null) {
                return false;
            }
        }
        else {
            if($(input).val().trim() == ''){
                return false;
            }
        }
    }

    function showValidate(input) {
        var thisAlert = $(input).parent();

        $(thisAlert).addClass('alert-validate');
    }

    function hideValidate(input) {
        var thisAlert = $(input).parent();

        $(thisAlert).removeClass('alert-validate');
    }
    
    

})(jQuery);


