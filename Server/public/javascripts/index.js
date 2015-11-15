"use strict";

$(document).ready(function(){
    var btn_male = $("#sign_up_male");
    var btn_female = $("#sign_up_female");

    btn_male.on("click",function(){
        var male=$("#sex_male");
        var female=$("#sex_female");
        male.checked = true;
        female.checked = false;
        btn_male.css('backgroundColor','#1E2858');
        btn_female.css('backgroundColor','#fff');
        btn_male.css('color','#fff');
        btn_female.css('color','black');
    });

    btn_female.on("click",function(){
        var male=$("#sex_male");
        var female=$("#sex_female");
        female.checked = true;
        male.checked = false;
        btn_female.css('backgroundColor','#1E2858');
        btn_male.css('backgroundColor','#fff');
        btn_female.css('color','#fff');
        btn_male.css('color','black');
    });

    $('input[type=file]').change(function(e) {
        var fn = $(this);
        if(fn.val() != ''){
            var fileName = fn.val().split( '\\' ).pop();
            $("label[id = sign_up_img_label]").text(fileName);
        }
        else{
            $("label[id = sign_up_img_label]").text('사진 선택');
        }
    });

    var btn_signup = $("#form-second-btn-signup");
    btn_signup.on("click",function() {
        location.href='/signup';
    });
});

