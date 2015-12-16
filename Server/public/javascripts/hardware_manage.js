/**
 * Created by jung-inchul on 2015. 12. 16..
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

$('ul.nav-pills li').click(function(){
    var index = $(this).index();
    $('ul.nav-pills li').removeClass('active');
    $(this).addClass('active');
    if(index === 0) {
        $('div#addhardwareForm').removeClass('hidden');
        $('table#alterhardwareTable').addClass('hidden');
        $('table#deletehardwareTable').addClass('hidden');
        addHardware();
    }else if(index === 1){
        $('div#addhardwareForm').addClass('hidden');
        $('table#alterhardwareTable').removeClass('hidden');
        $('table#deletehardwareTable').addClass('hidden');
        alterHardware();
    }else{
        $('div#addhardwareForm').addClass('hidden');
        $('table#alterhardwareTable').addClass('hidden');
        $('table#deletehardwareTable').removeClass('hidden');
        deleteHardware();
    }
});

addHardware();

function addHardware(){
    $('button#enroll').unbind().click(function(){
        var name = $('#add_hardwareName').val();
        var amount = $('#add_hardwareAmount').val();
        var serial = $('#add_hardwareSerial').val();

        if(name.length >= 100){
            toastr['error']('하드웨어 이름은 100자 이내여야 합니다');
            return;
        }
        if(!($.isNumeric(amount))){
            toastr['error']('수량은 숫자만 기입하세요');
            return;
        }
        if(serial.length >= 100){
            toastr['error']('시리얼넘버는 100자 이하여야합니다');
            return;
        }
        $.post('/hardware/manage/enroll', {name: name, amount: amount, serial: serial}, function(response){
        });
        toastr['info']('등록성공');
        $('#add_hardwareName').val('');
        $('#add_hardwareAmount').val('');
        $('#add_hardwareSerial').val('');
    });
}

function alterHardware(){
    $.post('/hardware/manage/alter', function(data){

    });
}


function deleteHardware(){

}