/**
 * Created by HyunJae on 2016. 1. 2..
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

var currentDate = new Date();

var selected_days = [];
var duty_count = null;
var bad_duty_count = 0;
var year = currentDate.getFullYear();
var month = currentDate.getMonth()+1;
$(document).ready(function() {

    $('#calendar').fullCalendar({
        dayClick: day_click,
        defaultDate : currentDate,
        header: false,
        height: 720
    })

    $('.datepicker').val(year+"년 "+ month+"월");


});



$('.datepicker').datepicker({
    format: "yyyy년 m월",
    minViewMode: 1,
    defaultDate : currentDate,
    keyboardNavigation : false,
    todayHighlight: true,
    startView: 1,
    startDate: '+0d',
    endDate: '+7d',
    autoclose: true
});

$('.datepicker').on('changeDate',function(event){
    year = event.date.getFullYear();
    month = event.date.getMonth() + 1;
    selected_days = [];
    $("#selected_days").html(""+selected_days.length);
    $("#calendar").fullCalendar( 'gotoDate' , new Date(year,month-1,1) );

});


$("#setting").unbind().click(function (){

    $("#setting").addClass("hidden");

    var sendData = {};

    sendData.selected_days = selected_days;
    sendData.duty_count = duty_count;
    sendData.bad_duty_count = bad_duty_count;
    sendData.year = year;
    sendData.month = month;
    console.log(sendData);

    toastr['warning']('잠시 기다려주십시오.');

    $.post("/duty/loadAllDuty",sendData, function(res){
        if(res=="no data"){
            $.post("/duty/initLastDuty", function(res){
                if(res =="success"){
                    $.post("/duty/updateMemberPoint", function(res){
                        if(res != 'success'){
                            toastr['error']('멤버 정렬에 실패하였습니다.');
                        }
                        $.post("/duty/autoMakeDuty", sendData, function(res){

                            if(res == "success"){
                                toastr['success']('당직 설정 완료');

                                setTimeout('redirectToManage()', 500);

                            }
                            else{
                                toastr['error']('당직 설정 에러');
                            }
                        });
                    });
                }
                else{
                    toastr['error']('last_duty초기화가 실패하였습니다.');
                }
            });
        }

        else{
            toastr['error']('이미 당직이 설정되었습니다.');
        }

    });


});


$('#duty_count li a').unbind().click(function(){
    duty_count = $(this).parent().index()+1;
    $('#duty_button').html(duty_count +"");
    isSelected();
});

$('#bad_duty_count li a').unbind().click(function(){
    bad_duty_count = $(this).parent().index();
    $('#bad_duty_button').html(bad_duty_count+"");
    isSelected();
});

function redirectToManage(){

    location.href='/duty/manage';
}

function isSelected(){
    if(duty_count !=null && bad_duty_count!=null){
        $("#setting").removeClass("hidden");
    }
}

function day_click(date) {
    var flag = 1;
    for(var i=0 ; i<selected_days.length; i++){
        if(selected_days[i] == date.format()){
            flag = 0;
            selected_days.splice(i,1);
            $("#selected_days").html(""+selected_days.length);
            $(this).css('background-color', 'white');
        }
    }
    if(flag){
        selected_days.push(date.format());
        $("#selected_days").html(""+selected_days.length);
        // change the day's background color just for fun
        $(this).css('background-color', '#00bcd4');
    }
}
