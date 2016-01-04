/**
 * Created by jung-inchul on 2015. 12. 7..
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

$('ul.nav-pills li').click(function(){          // Divide Normal or Special Hardware
    var index = $(this).index();
    $('ul.nav-pills li').removeClass('active');
    $(this).addClass('active');
    if(index === 0) {                           // Choose Normal Hardware
        $('table#myHardware').removeClass('hidden');
        $('table#myrequestedHardware').addClass('hidden');
        $('table#myappliedHardware').addClass('hidden');
        loadmyHardware();
    }else if(index === 1){                                     // Choose Special Hardware
        $('table#myHardware').addClass('hidden');
        $('table#myrequestedHardware').removeClass('hidden');
        $('table#myappliedHardware').addClass('hidden');
        loadmyRequestedHardware();
    }else{
        $('table#myHardware').addClass('hidden');
        $('table#myrequestedHardware').addClass('hidden');
        $('table#myappliedHardware').removeClass('hidden');
        loadmyappliedHardware();
    }
});

loadmyHardware();

var temp = 0;           // Using for divide normal and special hardware index
var today = new Date();     // Using to express progress bar
today.setHours(9);

/*
    Load Normal Hardware list that user borrowed from database named 'datalist'
    Make html string named 'htmlString' to show with table and waiting click event.
    2 buttons are in this function named 'turnIn', 'postpone'
 */
function loadmyHardware(){
    $.post('/hardware/myhardware/borrowed', function(datalist){
        if(datalist.length === 0){              // If user doesn't borrow anyone.
            $('div#myHardware').html('<tbody><th><tr><td><h4 class="text-center">예약한 일반 하드웨어가 없습니다.</h4></td></tr></th></tbody>');
            return;
        }
        var htmlString = '<tbody>';
        $.each(datalist, function(idx, data){
            htmlString += '<tr><td>';
            htmlString += '<h5 class="hardwareTitle">' + data.h_name + '</h5>';
            htmlString += '<p><span class="label label-info">반납일 : ' + data.hr_due_date + '</span>&nbsp&nbsp<span class="label label-warning">연장횟수 : ' + data.hr_extension_cnt + '</span>';
            htmlString += makeProgressbar(today, data.hr_rental_date, data.hr_due_date);
            htmlString += '</td><td width="5%"><div class="btn-group-vertical">';
            htmlString += '<button id="turnIn" type="button" class="btn btn-primary btn-sm"> 반납신청 </button>';
            htmlString += '<button id="postpone" type="button" class="btn btn-success btn-sm"> 연장신청 </button>';
            htmlString += '</td></tr>';
        });


        htmlString += '</tbody>';
        $('#myHardware').html(htmlString);
        turnInButton(datalist);
        postponeButton(datalist);
    });
}



/*
    Load Special Hardware list that user borrowed from database named 'datalist'
    Make html string named 'htmlString' to show with table and waiting click event.
    2 buttons are in this function named 'turnIn', 'postpone'
 */
function loadmyRequestedHardware(){
    $.post('/hardware/myhardware/requested', function(datalist){
        if(datalist.length === 0){
            $('div#myrequestedHardware').html('<tbody><th><tr><td><h4 class="text-center"> 요청이 없습니다. </h4></td></tr></th></tbody>');
            return;
        }
        var htmlString = '<tbody>';
        $.each(datalist, function(idx, data){
            htmlString += '<tr><td>';
            htmlString += '<h5 class="hardwareTitle">' + data.h_name + '</h5>';
            htmlString += '<p><span class="label label-info">';
            switch(data.hw_kind){
                case 0: htmlString += '대여 신청';  break;
                case 1: htmlString += '연장 신청';  break;
                default:    htmlString += '반납 신청';  break;
            }
            htmlString += '</span>&nbsp&nbsp';
            switch(data.hw_result){
                case 0: htmlString += '<span class="label label-warning">신청결과 : 대기중 </span>';  break;
                case 1: htmlString += '<span class="label label-success">신청결과 : 승인 </span>';   break;
                default:    htmlString += '<span class="label label-danger">신청결과 : 미승인 </span>';   break;
            }
            htmlString += '</p></td><td width="5%"><div class="btn-group-vertical">';
            htmlString += '<button id="deleteRequest" type="button" class="btn btn-danger btn-sm"> 삭제 </button>';
            htmlString += '</td></tr>';
        });
        htmlString += '</tbody>';
        $('#myrequestedHardware').html(htmlString);
        deleteRequestButton(datalist);
    });
}

function loadmyappliedHardware(){               // 미완성된 함수.
    $.post('/hardware/myhardware/applied', function(datalist){
        if(datalist.length === 0){
            $('div#myappliedHardware').html('<tbody><th><tr><td><h4 class="text-center"> 신청한 하드웨어가 없습니다.</h4></td></tr></th></tbody>');
            return;
        }
        var htmlString = '<tbody>';
        $.each(datalist, function(idx, data){
            htmlString += '<tr><td><h5>' + data.ha_item_name + '</h5></td><td width="5%">';
            htmlString += '<button id="showDetail" type="button" class="btn btn-primary btn-sm"> 자세히 </button></td></tr>';
        });
        htmlString += '</tbody>';
        $('#myappliedHardware').html(htmlString);
        showdetailButton(datalist);
    });
}

function turnInButton(datalist){
    $('button#turnIn').each(function(index){            // Turnin button & function
        $(this).unbind().click(function(event){
            $.post("/hardware/myhardware/turnIn", {rental_id: datalist[index].hr_id, hardware_id: datalist[index].hr_hardware_id}, function (response) {
                if(response === 'success')  toastr['success']('반납신청 성공');
                else if(response === 'failed_2')    toastr['error']('반납신청 실패');
                else toastr['error']('이미 연장이나 반납했습니다');
            });
            //window.location.reload();
        });
    });
}

function postponeButton(datalist){
    $('button#postpone').each(function(index){          // Postpone button & function
        $(this).unbind().click(function(){
            $.post("/hardware/myhardware/postpone", {rental_id: datalist[index].hr_id, hardware_id: datalist[index].hr_hardware_id}, function (response) {
                if(response === 'success')  toastr['success']('연장신청 성공');
                else if(response === 'failed_2')    toastr['error']('연장신청 실패');
                else    toastr['error']('이미 연장이나 반납했습니다');
            });
            //window.location.reload();
        });
    });
}

function deleteRequestButton(datalist){
    $('button#deleteRequest').each(function(index){
        $(this).unbind().click(function(){
            $.post('/hardware/myhardware/deleteRequest', {waiting_id: datalist[index].hw_id, hardware_id: datalist[index].hw_hardware_id}, function(response){
                if(response === 'success')  toastr['success']('신청 삭제 성공');
                else    toastr['error']('신청 삭제 실패');
            });
            //window.location.reload();
        });
    });
}

function showdetailButton(datalist){
    $('button#showDetail').each(function(index){
        $(this).unbind().click(function(){
            var string = '<table class="table table-striped table-bordered">';
            string += '<tr class="warning"><th colspan="4">' + datalist[index].ha_item_name + '</th></tr>';
            string += '<tr><td colspan="4">' + datalist[index].ha_project_title + '</td></tr>';
            string += '<tr><td>분류</td><td>' + datalist[index].ha_upper_category + '</td><td>품목</td><td>' + datalist[index].ha_lower_category + '</td></tr>';
            string += '<tr><td>규격</td><td>' + datalist[index].ha_size + '</td><td>수량</td><td>' + datalist[index].ha_amount + '</td></tr>';
            string += '<tr><td>Maker</td><td>' + datalist[index].ha_maker + '</td><td>신청자</td><td>' + datalist[index].u_name + '</td></tr>';
            string += '<tr><td colspan="4"><a href="' +datalist[index].ha_url + '" target="_blank" style="color:blue">URL 이동</a></td></tr>';
            $('div.modal-body').html(string);
            $('div.modal').modal();
            cancelmyApplyButton(datalist[index]);
        });
    });
}


function cancelmyApplyButton(data){
    $('button#cancelmyappliedHardware').unbind().click(function(){
        $.post('/hardware/myhardware/cancelmyApply', {apply_id: data.ha_id}, function(response){
            if(response === 'success')  toastr['success']('신청취소 성공');
            else    toastr['error']('신청취소 실패');
            loadmyappliedHardware();
        });
        $('div.modal').modal('hide');
    });
}

/*
    Make progressbar function use t1 : today, t2 : rental day, t3 : due date
    3600000 * 24 means 1 Day.
*/
function makeProgressbar(t1, t2, t3){
    var string = '';
    var text = '';
    var now = new Date(t1);             // today
    var borrow_date = new Date(t2);     // borrow_date
    var due_date = new Date(t3);        // due_date
    if(due_date.getTime() <= now.getTime()){        // #1.
        var gap = parseInt((now.getTime() - due_date.getTime()) / (3600000 * 24));    // calculate difference from today to due_date
        if(gap == 0) text = '대여 기한이 오늘까지입니다.';
        else text = gap + '일 지났습니다.';
        string += '<div class="progress progress-striped active">';
        string += '<div class="progress-bar progress-bar-danger" role="progressbar" style="width: 100%">' + text;
        string += '</div>';
        string += '</div>';
    }
    else{
        var numerator = parseInt((due_date.getTime() - now.getTime()) / (3600000 * 24));
        var denominator = parseInt((due_date.getTime()-borrow_date.getTime()) / ( 3600000 * 24 ));
        var percent = (100 - (numerator / denominator * 100));
        text = numerator + '일 남았습니다.';
        string += '<div class="progress progress-striped active">';
        string += '<div class="progress-bar ' + (numerator > 7 ? 'progress-bar' : 'progress-bar-danger' ) + '" role="progressbar" style="width:' + percent + '%">' + text;
        string += '</div>';
    }
    return string;
}