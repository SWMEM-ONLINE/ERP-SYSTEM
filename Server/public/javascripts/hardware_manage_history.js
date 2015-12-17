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
    if(index === 0) {
        $('table#nowhistoryTable').removeClass('hidden');
        $('table#pasthistoryTable').addClass('hidden');
        loadnowHistory();
    }else if(index === 1){
        $('table#nowhistoryTable').addClass('hidden');
        $('table#pasthistoryTable').removeClass('hidden');
        loadpastHistory();
    }
});

loadnowHistory();

function loadnowHistory(){
    $.post('/hardware/manage/loadNow', function(response){

    });
}

function loadpastHistory(){
    $.post('/hardware/manage/loadPast', function(response){

    });
}