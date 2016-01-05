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

var currentPW = $('#currentPW');
var newPW = $('#newPW');
var confirmPW = $('#confirmPW');
var newPhone = $('#newPhone');
var newMail = $('#newMail');

$('#deleteDevice').click(function () {
    $.ajax({
        type:'post',
        url:'/user/info/deleteDevice',
        contentType:'application/json',
        success: function(){
            document.getElementById('device').innerHTML = '등록된 디바이스 정보가 없습니다';
            $('table #deleteDevice').remove();
        }
    });
});

$('input[type=file]').change(function(e) {
    var fn = $(this);
    if(fn.val() != ''){
        var fileName = fn.val().split( '\\' ).pop();
        $('label[id = changeimg]').text(fileName);
    }
    else{
        $('label[id = changeimg]').text('사진 선택');
    }
});

$('#form').submit(function(){
    var emailReg =  /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/;
    var phoneReg = /^01[0-9]{1}[0-9]{4}[0-9]{4}$/;
    var editSuccess = true;

    if(currentPW.val() == ''){
        toastr['error']('기존 비밀번호를 입력하세요');
        editSuccess = false;
    }
    if(newMail.val() != '') {
        console.log(newMail.val());
        if (!emailReg.test(newMail.val())) {
            toastr['error']('메일주소를 확인하세요');
            editSuccess = false;
        }
    }

    if(newPhone.val() != ''){
        console.log(newPhone.val());
        if(!phoneReg.test(newPhone.val())){
            toastr['error']('전화번호 형식을 확인하세요');
            editSuccess = false;
        }
    }

    if(editSuccess == false){
        toastr['error']('입력을 확인하세요');
    }
    else if(newPW.val() != confirmPW.val() && newPW.val().length < 4) {
        toastr['error']('새 비밀번호를 확인하세요');
        editSuccess = false;
    }
    return editSuccess;
});