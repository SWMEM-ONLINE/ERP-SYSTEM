/**
 * Created by KIMDONGWON on 2015-12-31.
 */
toastr.options = {
    'closeButton': false,
    'debug': false,
    'newestOnTop': false,
    'progressBar': false,
    'positionClass': 'toast-top-right',
    'preventDuplicates': false,
    'onclick': null,
    'showDuration': '300',
    'hideDuration': '1000',
    'timeOut': '5000',
    'extendedTimeOut': '1000',
    'showEasing': 'swing',
    'hideEasing': 'linear',
    'showMethod': 'fadeIn',
    'hideMethod': 'fadeOut'
};

var editSuccess = true;
var currentPW = $('#currentPW');
var newPW = $('#newPW');
var confirmPW = $('#confirmPW');
var newPhone = $('#newPhone');
var newMail = $('#newMail');

newPhone.on('blur',function(){
    var phoneReg = /^01[0-9]-[0-9]{4}-[0-9]{4}$/;
    if(!phoneReg.test($(this).val())){
        toastr['error']('전화번호 형식을 확인하세요');
        editSuccess = false;
    }
    else{
        toastr['success']('good phone number');
        editSuccess = true;
    }
});

newMail.on('blur',function(){
    var emailReg =  /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/;
    if(!emailReg.test($(this).val())){
        toastr['error']('메일주소를 확인하세요');
        editSuccess = false;
    }
    else{
        toastr['success']('good mail');
        editSuccess = true;
    }
});

$('#save').click(function(){
    if(editSuccess == false){
        toastr['error']('입력을 확인하세요');
    }
    else if(newPW.val() != confirmPW.val()) {
        toastr['error']('새 비밀번호를 확인하세요');
    }
    else{
        var send = {
            currentPW:currentPW.val(),
            newPW:newPW.val(),
            newPhone:newPhone.val(),
            newMail:newMail.val()
        };
        $.ajax({
            type:'post',
            url:'/user/info/edit',
            data:JSON.stringify(send),
            contentType:'application/json',
            success: function(data){

            }
        })
    }
});