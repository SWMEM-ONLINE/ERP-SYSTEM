/**
 * Created by KIMDONGWON on 2016-01-08.
 */

/**
 *
 * Event 객체 생성자
 *
 * @param title
 * @param start
 * @param end
 * @param flag
 * @constructor
 */

var currentDate = new Date();
var year = currentDate.getFullYear();
var month = currentDate.getMonth()+1;
var prevEvent = null;


loadSchedule(year,month);
loadTodayDuty();
$('.datepicker').val(year+"년 "+ month+"월");

$('#calendar').fullCalendar({
    header: false,
    editable: false,
    displayEventTime: false,
    eventLimit: true,
    eventOrder : "color",
    height: 720,
    googleCalendarApiKey: "AIzaSyCG7BMZu2LiHu-nitkEU-io4GlhqdTCiKo",
    events: {
        googleCalendarId: "suwonmem@gmail.com"
    }
});

$('.datepicker').datepicker({
    format: "yyyy년 m월",
    minViewMode: 1,
    keyboardNavigation : false,
    todayHighlight: true,
    startView: 1,
    autoclose: true
});

$('.datepicker').on('changeDate',function(event){
    var year = event.date.getFullYear();
    var month = event.date.getMonth() + 1;
    loadSchedule(year, month);
});



function loadSchedule(year, month){
    var sendData = {};
    sendData.year = year;
    sendData.month = month;

    $.post("/schedule/getBoardEvents", sendData ,function(res){


        console.log(res);
        var event = res;
        if(prevEvent ==null){
            prevEvent = event;
        }
        else{
            $("#calendar").fullCalendar( 'removeEventSource', prevEvent );
            prevEvent = event;
        }

        $("#calendar").fullCalendar( 'addEventSource', event );
        $("#calendar").fullCalendar( 'gotoDate' , new Date(year,month-1,1) );



    });
}

function loadTodayDuty(){

    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth()+1;
    var date = date.getDate();

    var html = year+"."+month+"."+date;

    $('#today').html(html);

    $.post('/duty/loadTodayDuty' , function(response){
        // type , month , date ,year
        console.log(response);
        var htmlString = '';
        var data = response;
        console.log(data);

        if(data.name1!= null){
            flag=0;
            htmlString += '<p><label style="text-overflow: ellipsis;">'
                + data.name1 +
                '</label>';
        }
        if(data.name2!= null){
            flag=0;
            htmlString += '<p><label style="text-overflow: ellipsis;">'
                + data.name2 +
                '</label>';
        }
        if(data.name3!= null){
            flag=0;
            htmlString += '<p><label style="text-overflow: ellipsis;">'
                + data.name3 +
                '</label>';
        }
        if(data.name4!= null){
            flag=0;
            htmlString += '<p><label style="text-overflow: ellipsis;">'
                + data.name4 +
                '</label>';
        }

        if(data === "no data"){
            console.log("ddd");
            htmlString = '<p><label style="text-overflow: ellipsis;">'
                + '오늘의 당직이 없습니다.' +
                '</label>';
            console.log(htmlString);
        }

        $('#content-today_duty').html(htmlString);

    });
}