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
    header: false,
    editable: false,
    eventLimit: true,
    height: 720,
    dayClick: function(date, jsEvent, view) {
        getClickedEvents(date);
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


function getClickedEvents(date){
    var newdate = new Date(date).getTime();
    var clickedTitle = [];
    var i ;

    for(i=0;i<prevEvent.length;i++){
        var event = prevEvent[i];
        if((new Date(event.start).getTime() <= newdate && new Date(event.end).getTime()>= newdate) ||
            (new Date(event.start).getTime() < (newdate+ 24 * 60 * 60 * 1000) && new Date(event.start).getTime() >=newdate) ){

            clickedTitle.push(event.title);
        }
    }

    if(clickedTitle.length !=0){
        makeModal(date,clickedTitle);
    }

}

function makeModal(date,clickedTitle){

    var i;
    var htmlString = "";
    $('.modal-title').text(date.format());

    for(i=0;i<clickedTitle.length;i++){
        htmlString+="<p>";
        htmlString+=clickedTitle[i];
        htmlString+="</p>";
    }
    $('#modal-table').empty();
    $('#modal-table').append(htmlString);
    $('div.modal').modal();

}


function loadSchedule(year, month){
    var sendData = {};
    sendData.year = year;
    sendData.month = month;

    $.post("/schedule/getEvents", sendData ,function(res){


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