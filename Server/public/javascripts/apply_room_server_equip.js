/**
 * Created by KIMDONGWON on 2015-12-17.
 */
/**
 * Created by KIMDONGWON on 2015-11-27.
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

$('.push-equipment').on('click', function () {
    if(!$('.push-equipment').hasClass('disabled')) {
        $.post('/apply/equipment',function(data){
            if(data.status == 'success'){
                toastr['success']('신청되었습니다');
            }
            else{
                toastr['error']('에러가 발생했습니다');
            }
        });
    }
});

$('.push-room').on('click', function () {
    $.post('/apply/room',function(data){
        if(data.status == 'success'){
            toastr['success']('신청되었습니다');
        }
        else{
            toastr['error']('에러가 발생했습니다');
        }
    });
});

$('.push-server').on('click', function () {
    if(!$('.push-server').hasClass('disabled')) {
        $.post('/apply/server',function(data){
            if(data.status == 'success'){
                toastr['success']('신청되었습니다');
            }
            else{
                toastr['error']('에러가 발생했습니다');
            }
        });
    }
});