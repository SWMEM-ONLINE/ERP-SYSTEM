/**
 * Created by kimhu on 2016-02-02.
 */


toastr.options = {
    'closeButton': false,
    'debug': false,
    'newestOnTop': false,
    'progressBar': false,
    'positionClass': 'toast-top-right',
    'preventDuplicates': false,
    'onclick': null,
    'showDuration': '100',
    'hideDuration': '500',
    'timeOut': '2000',
    'extendedTimeOut': '1000',
    'showEasing': 'swing',
    'hideEasing': 'linear',
    'showMethod': 'fadeIn',
    'hideMethod': 'fadeOut'
};

$(document).ready(function() {
    $('#calendar').fullCalendar({
        // put your options and callbacks here
        header: false,
        height: 720,
        eventOrder : "-mode",
        editable : true,
        dayClick: function(date, jsEvent, view) {
            DateClick(date,jsEvent,view);

        },
        eventClick: function(calEvent, jsEvent, view) {
            EventClick(calEvent, jsEvent, view);
        },
        eventDrop: function(event, delta, revertFunc) {
            dropDuty(event, delta, revertFunc);
        }
    })
});

$('.datepicker').datepicker({
    format: "yyyy년 m월",
    minViewMode: 1,
    keyboardNavigation : false,
    todayHighlight: true,
    startView: 1,
    endDate: '+5d',
    autoclose: true
});

var memberList = null;
var currentDate = new Date();
var prevEvent = null;
$('.datepicker').on('changeDate',function(event){
    var year = event.date.getFullYear();
    var month = event.date.getMonth() + 1;

    allDuty(year,month);

});


allDuty(new Date().getFullYear(), new Date().getMonth()+1);

getMember(function (result){
    memberList = result;
});

function DateClick(date, jsEvent, view) {


    var sendData={};

    sendData.date = date.format();

    $.post("/duty/loadSpecificDuty",sendData, function(res){

        console.log(res);

        if(res == "empty"){
            init();
            emptyDuty(res);


        }else if(res == "error"){
            toastr['error']('당직 조회 실패');
        }
        else{
            init();
            hasDuty(res);
        }
    });


}

function init(){
    $("#empty").addClass("hidden");
    $("#duties").addClass("hidden");

}

function emptyDuty(res){
    $("#empty").removeClass("hidden");

    var htmlString = "";

    htmlString += "<h3>당직이 존재하지 않습니다.</h3>";



    $('div.modal').modal();

}

function hasDuty(res){
    $("#duties").removeClass("hidden");

    var data = res[0];
    var date = new Date(data.date);
    $("#date").html( date.getFullYear() +  "년 " + (date.getMonth()+1) + "월 "
    + date.getDate() +"일" );

    console.log(data);

    var htmlString = "";


    for(var i=1;i<=4;i++){
        var name = "username"+ i;
        var mode = "user"+i+"_mode";


        if(data[name] != null){

            htmlString += "<tr>";

            if(data[mode] == 0 ){
                htmlString += "<td style='color :#009926'>";
                htmlString +=  "일반당직";
            }else if (data[mode] == 1){
                htmlString += "<td style='color : #8B0000'>";
                htmlString += "벌당직";
            }else if(data[mode] ==2){
                htmlString += "<td style='color : #8B0000'>";
                htmlString += "운영실벌당직";
            }

            htmlString += "</td>";
            htmlString += "<td>";
            htmlString += data[name];
            htmlString += "</td>";
            htmlString += "<td >";
            htmlString += "<button index='"+i+"' id='delete" + i + "' type='button' class ='delete'> 삭제 </buttontype>";
            htmlString += "</td>";
            htmlString += "</tr>";


        }
        else{

            htmlString += "<tr>";
            htmlString += "<td colspan='3'>";
            htmlString += "<button index='"+i+"' type='button' class ='add'> 추가 </button>";
            htmlString += "</td>";
            htmlString += "</tr>";

        }
    }


    $("#tbody").html(htmlString);


    // click Event

    for( var i=1;i<=4;i++){
         name = "username"+ i;


        if(data[name] != null){

            $("#delete"+ i ).click(function(){
                var index = $(this).attr('index');
                console.log(index);
            });

        }
    }

    $('button.add').unbind().click(function(){
        var index = $(this).attr('index');
        console.log(index);

    });

    $('div.modal').modal();

}


function getMember(callback){

    $.post("/duty/getMemberList", function(res){

        console.log(res);
        callback(res);

    });
}



function EventClick(event, jsEvent, view){

    var sendData={};
    sendData.id = event.user_id;
    sendData.mode = event.mode;
    sendData.toDate =event.start.format();

    console.log(sendData);


    $.post("/duty/changeDutyMode",sendData, function(res){
        console.log(res);

        if(res == "success"){
            toastr['success']('당직 변경 성공');

            if(event.mode == 1){
                event.textColor= 'black';
                event.mode = 0;
            }else{
                event.textColor= '#EF6C00';
                event.mode = 1;
            }
            $('#calendar').fullCalendar( 'rerenderEvents' );

        }else if(res == "empty"){
            toastr['error']('당직이 비어있습니다.');

        }else if(res == "notEnough"){
            toastr['error']('벌당직이 모자랍니다!');
        }
        else {
            toastr['error']('당직 변경 실패');
        }
    })

}


function dropDuty(event, delta, revertFunc){

    var sendData={};
    sendData.id = event.user_id;
    sendData.mode = event.mode;
    sendData.fromDate = event.fromDate;
    sendData.toDate =event.start.format();

    $.post("/duty/moveDuty",sendData, function(res){
        console.log(res);

        if(res == "success"){
            toastr['success']('당직 이동 성공');
            event.fromDate = event.start.format();
        }else if(res == "full"){
            toastr['error']('당직 추가 불가능');
            revertFunc();
        }else if(res == "empty"){
            toastr['error']('당직 추가 불가능');
            revertFunc();
        }else if(res == "error"){
            toastr['error']('당직 이동 실패');
            revertFunc();
        }else{
            toastr['error']('당직 이동 실패');
            revertFunc();
        }
    });

}


function allDuty(year, month){

    $.post("/duty/loadAllDuty",{year : year , month : month}, function(res){
        var event = makeEvent(res);
        if(prevEvent ==null){
            prevEvent = event;
        }
        else{
            $("#calendar").fullCalendar( 'removeEventSource', prevEvent );
            prevEvent = event;
        }

        $("#calendar").fullCalendar( 'addEventSource', event );

        $('.datepicker').val(year+"년 "+ month+"월");

    });

    $("#calendar").fullCalendar( 'gotoDate' , new Date(year,month-1,1) );
}


function makeEvent(res){

    var event = [] ;

    if(res.length == 1){
        return event;
    }
    else
    {
        for( var i = 0 ; i < res.length; i++)
        {
            var data = res[i];
            var date = new Date(data.date);
            var name1 = data['(select u_name from t_user where user_id1= u_id)'];
            var name2 = data['(select u_name from t_user where user_id2= u_id)'];
            var name3 = data['(select u_name from t_user where user_id3= u_id)'];
            var name4 = data['(select u_name from t_user where user_id4= u_id)'];

            var id1 = data.user_id1;
            var id2 = data.user_id2;
            var id3 = data.user_id3;
            var id4 = data.user_id4;

            var mode1 = data.user1_mode;
            var mode2 = data.user2_mode;
            var mode3 = data.user3_mode;
            var mode4 = data.user4_mode;
            var element;
            if(name1 != null){
                element = setElement(name1,mode1,date,id1);
                event.push(element);
            }
            if(name2 != null){
                element = setElement(name2,mode2,date,id2);
                event.push(element);
            }
            if(name3 != null){
                element = setElement(name3,mode3,date,id3);
                event.push(element);
            }
            if(name4 != null){
                element = setElement(name4,mode4,date,id4);
                event.push(element);
            }
        }
    }
    return event;
}


function setElement(name, mode, date,id){
    var element ={};
    element.title = name;
    element.allDay = true;
    element.fromDate = date;
    element.start = date;
    element.user_id = id;
    element.mode = mode;

    if(mode == 0){
        element.textColor= 'black';
    }else{
        element.textColor= '#EF6C00';
    }

    if(date.getDate()  == currentDate.getDate() && date.getMonth() == currentDate.getMonth() ){
        element.color = "#FCF8E3";
    }
    else{
        element.color= 'white';
    }
    return element;
}