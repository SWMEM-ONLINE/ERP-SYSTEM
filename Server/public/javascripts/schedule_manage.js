/**
 * Created by HyunJae on 2015. 12. 23..
 */

var flag = 0;
var s_id = 0;
var select_year = new Date().getFullYear();
var select_month = new Date().getMonth()+1;

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
    'hideMethod': 'fadeOut',
};


// Datepicker 관련

$('#monthpicker').val(select_year+"년 "+ select_month+"월");

$('#monthpicker').datepicker({
    format: "yyyy년 mm월",
    minViewMode: 1,
    keyboardNavigation : false,
    todayHighlight: true,
    startView: 1,
    autoclose: true
});

$('#startDate').datepicker({
    format: "yyyy-mm-dd",
    todayHighlight: true,
    autoclose: true
});

$('#endDate').datepicker({
    format: "yyyy-mm-dd",
    autoclose: true
});



$('#monthpicker').on('changeDate',function(event){
    select_year = event.date.getFullYear();
    select_month = event.date.getMonth() + 1;
    loadSchedule(select_year, select_month);
});



// 기본 틀



loadSchedule(select_year, select_month);

function loadSchedule(year, month){
    var sendData ={};
    sendData.year = year;
    sendData.month = month;

    $.post('/schedule/manage/loadSchedule', sendData , function(res){
        generateHtml(res);
        clickEvent(res);
    });
}

enrollButton();
deleteButton();




// HTMl 생성 및 항목 선택




function generateHtml(datalist){
    var htmlString = '';
    if(datalist.length === 0){
        htmlString += '<tr><th colspan="4">';
        htmlString += '이 달의 일정이 없습니다';
        htmlString += '</th></tr>';
    }
    else{
        $.each(datalist, function (idx, data) {
            htmlString += '<tr><td>' + data.s_start_date + '</td>';
            htmlString += '<td>' + data.s_end_date + '</td>';
            htmlString += '<td>' + data.s_title + '</td>';
            htmlString += '<td>' + data.u_name + '</td>';
            htmlString += '</tr>';
        });
    }
    $('table tbody#scheduleList').html(htmlString);
}

function clickEvent(datalist){
    $('table tbody#scheduleList tr').unbind().click(function(){
        var idx = $(this).index();
        flag = 1;
        s_id = datalist[idx].s_id;

        $('.modal-title').text('스케줄 수정');
        $('button#delete').removeClass('hidden');

        $('#title').val(datalist[idx].s_title);
        $('#startDate').val(datalist[idx].s_start_date);
        $('#endDate').val(datalist[idx].s_end_date);

        $('div.modal').modal();
    });
}



// 버튼 이벤트




$('button#addSchedule').unbind().click(function(){
    flag = 0;

    $('.modal-title').text('스케줄 등록');
    $('button#delete').addClass('hidden');

    $('#title').val('');
    $('#startDate').val('');
    $('#endDate').val('');

    $('div.modal').modal();
});

function enrollButton(){
    $('button#enroll').unbind().click(function(){
        var content = $('#title').val();
        var start = $('#startDate').val();
        var end = $('#endDate').val();

        var sendData = {
            flag : flag,
            schedule_id : s_id,
            title : content,
            start_date : start,
            end_date : end
        };

        $.post('/schedule/manage/enrollSchedule', sendData, function(response){
            if(response === 'enroll')  toastr['success']('스케줄등록 성공');
            else if(response === 'alter')   toastr['success']('스케줄변경 성공');
            else if(response === 'enroll_failed')    toastr['error']('스케줄등록 실패');
            else     toastr['error']('스케줄변경 실패');
            loadSchedule(select_year, select_month);
        });
        $('div.modal').modal('hide');
    });
}

function deleteButton(){
    $('button#delete').unbind().click(function(){
        var sendData = {
            schedule_id : s_id
        };
        $.post('/schedule/manage/deleteSchedule', sendData, function(response){
            if(response === 'success')  toastr['success']('스케줄삭제 성공');
            else    toastr['error']('스케줄삭제 실패');
            loadSchedule(select_year, select_month);
        });
        $('div.modal').modal('hide');
    });
}