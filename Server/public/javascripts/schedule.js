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
$('.datepicker').val(year+"년 "+ month+"월");
$('#calendar').fullCalendar({
    header: {
        left :'',
        right: 'month,agendaWeek'
    },
    lang: 'ko',
    editable: false,
    eventLimit: true
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

    $.post("/schedule/getEvents", sendData ,function(res){

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

        console.log(res);

    });


}