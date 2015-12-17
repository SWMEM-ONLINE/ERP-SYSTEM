/**
 * Created by jung-inchul on 2015. 12. 17..
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
    switch(index){
        case 0:
            $('table#borrowrequestTable').removeClass('hidden');
            $('table#postponerequestTable').addClass('hidden');
            $('table#turninrequestTable').addClass('hidden');
            $('table#applyrequestTable').addClass('hidden');
            borrowRequest();
            break;
        case 1:
            $('table#borrowrequestTable').addClass('hidden');
            $('table#postponerequestTable').removeClass('hidden');
            $('table#turninrequestTable').addClass('hidden');
            $('table#applyrequestTable').addClass('hidden');
            postponeRequest();
            break;
        case 2:
            $('table#borrowrequestTable').removeClass('hidden');
            $('table#postponerequestTable').addClass('hidden');
            $('table#turninrequestTable').addClass('hidden');
            $('table#applyrequestTable').addClass('hidden');
            turninRequest();
            break;
        default:
            $('table#borrowrequestTable').removeClass('hidden');
            $('table#postponerequestTable').addClass('hidden');
            $('table#turninrequestTable').addClass('hidden');
            $('table#applyrequestTable').addClass('hidden');
            applyRequest();
    }
});

function borrowRequest(){

}

function postponeRequest(){

}

function turninRequest(){

}

function applyRequest(){

}
