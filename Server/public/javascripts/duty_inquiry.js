/**
 * Created by HyunJae on 2015. 12. 23..
 */


$(document).ready(function() {

    $('#calendar').fullCalendar({
        // put your options and callbacks here

        header: false
    })


});

$('.datepicker').datepicker({
    format: "yyyy년 m월",
    minViewMode: 1,
    keyboardNavigation : false,
    todayHighlight: true,
    startView: 1,
    endDate: '+1d',
    autoclose: true
});

$('.datepicker').on('changeDate',function(event){
    var year = event.date.getFullYear();
    var month = event.date.getMonth() + 1;

    if(flag == 0){
        personDuty(year,month);
    }
    else{
        allDuty(year,month);
    }
});

// 0 이면 person
// 1 이면 ALL
var flag = 0 ;
var prevEvent = null;

$('#toggle').click(function(){

    // ALL 보기
    if(flag==0){
        flag=1;
        $("#person").addClass("hidden");
        $("#all").removeClass("hidden");
        $(this).html("내 당직만 보기");
        allDuty(new Date().getFullYear(), new Date().getMonth()+1);
    }

    // 개인적 보기
    else{
        $("#all").addClass("hidden");
        $("#person").removeClass("hidden");
        $(this).html("전체 당직 보기");
        personDuty(new Date().getFullYear(), new Date().getMonth()+1);
        flag=0;
    }


});


personDuty(new Date().getFullYear(), new Date().getMonth()+1);


function personDuty(year, month){

    $.post('/duty/getUser', function(res){

        var htmlString = res.name + "님은";
        $('#name').html(htmlString);

        htmlString = "    ";
        $('#foot').html(htmlString);

    });

    var sendData ={};
    sendData.year = year;
    sendData.month = month;

    $.post('/duty/loadMyDuty', sendData , function(res){
        generateHtml(res);
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

    });

    $("#calendar").fullCalendar( 'gotoDate' , new Date(year,month-1,1) );
}



function generateHtml(datas){

    var htmlString = '<div>';


    if(datas.length === 0){
        htmlString += '<p> ';
        htmlString += '이 달에는 당직이 존재하지 않습니다. ';
        htmlString += '</p>';
    }
    else{

        $.each(datas, function (idx, data) {

            htmlString += '<p>';
            htmlString += data.month + "월 " + data.date +  "일 ";

            if(data.type == 0){
                htmlString += " 일반당직";
            }else if (data.type ==1){
                htmlString += " 벌당직";
            }

            htmlString += '</p>';

        });

    }
    htmlString += '</div>';
    $('#duty').html(htmlString);

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

            var mode1 = data.user1_mode;
            var mode2 = data.user2_mode;
            var mode3 = data.user3_mode;
            var mode4 = data.user4_mode;
            var element;
            if(name1 != null){
                element = setElement(name1,mode1,date);
                event.push(element);
            }
            if(name2 != null){
                element = setElement(name2,mode2,date);
                event.push(element);
            }
            if(name3 != null){
                element = setElement(name3,mode3,date);
                event.push(element);
            }
            if(name4 != null){
                element = setElement(name4,mode4,date);
                event.push(element);
            }
        }
    }
    return event;
}


function setElement(name, mode, date){
    var element ={};
    element.title = name;
    element.allDay = true;
    element.start = date;

    if(mode == 0){
        element.textColor= 'black';
        element.color= 'white';
    }else{
        element.textColor= ' #ffc107';
        element.color= 'white';
    }
    return element;
}