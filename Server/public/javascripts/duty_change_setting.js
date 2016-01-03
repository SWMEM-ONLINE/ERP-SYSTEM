/**
 * Created by HyunJae on 2016. 1. 1..
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
var endDate;

var currentDate = new Date();

//$.post("/duty/declineChangeDuty", function(res){
//
//});
//$.post("/duty/acceptChangeDuty", function(res){
//
//});
//$.post("/duty/forceChangeDuty", function(res){
//
//});


endDate =  numberOfDays(currentDate.getFullYear(), currentDate.getMonth()+1) - currentDate.getDate();



var request_date1;
var request_user_name1 = [];
var request_user_id1 = [];
var selected1 = null;
var request1_year;
var request1_month;
var request1_date;



var request_date2;
var request_user_name2 = [];
var request_user_id2 = [];
var selected2 = null;
var request2_year;
var request2_month;
var request2_date;


$("#showresult").click(function(){

    $.post("/duty/showChangeDutyHistroryAll", function(res){

        var htmlString = "";

        $.each(res, function (idx, data) {
            var rq_time = new Date(data.request_time);
            var rq_date1 = new Date(data.request_date1);
            var rq_date2 = new Date(data.request_date2);
            var rq_id1 = data.request_userid1;
            var rq_name1 = data['(select u_name from t_user where u_id = request_userid1)'];
            var rq_id2 = data.request_userid1;
            var rq_name2 = data['(select u_name from t_user where u_id = request_userid2)'];
            var index = data.index;
            var accept = data.accepted;


            htmlString += "<tr>";
            htmlString += "<td>";

            var request1 = "" + rq_date1.getFullYear() + "-" +rq_date1.getMonth()+1+"-" + rq_date1.getDate() +" / " +
                rq_name1;
            htmlString += request1;
            htmlString += "</td>";

            htmlString += "<td>";

            var request2 = "" + rq_date2.getFullYear() + "-" +rq_date2.getMonth()+1+"-" + rq_date2.getDate() +" / " +
                rq_name2;
            htmlString += request2;
            htmlString += "</td>";


            // wait
            if(accept==0){

                htmlString += "<td>";

                htmlString += "대기중";

                htmlString += "</td>";


            }
            else if (accept ==1){
                htmlString += "<td>";

                htmlString += "승인";

                htmlString += "</td>";

            }else if(accept == 2){

                htmlString += "<td>";

                htmlString += "거부";

                htmlString += "</td>";
            }

            htmlString += "</tr>";

        });

        $('#resultlist').html(htmlString);
        $('div.modal').modal();


    });

});



$("#change").click(function() {

    var sendData ={};

    sendData.request_date1 = request_date1;
    sendData.request_date2 = request_date2;
    sendData.request_id1 = request_user_id1[selected1];
    sendData.request_id2 = request_user_id2[selected2];

    $.post('/duty/forceChangeDuty',sendData, function(res){
        if(res.length ==0){
            toastr['error']('맞변경 신청 실패');
        }else{
            toastr['success']('맞변경 신청 완료');

        }
    });

});


$('#date_picker1').datepicker({
    format : "yyyy/mm/dd",
    keyboardNavigation : false,
    todayHighlight : true,
    startDate :"d",
    endDate : "+" + endDate +"d",
    autoclose : true
});



$('#date_picker1').on('changeDate',function(event){
    var year = event.date.getFullYear();
    var month = event.date.getMonth() + 1;
    var date = event.date.getDate();

    request1_year = year;
    request1_month = month;
    request1_date = date;


    if(month < 10){
        month = '0' + month;
    }
    var sendData ={
        year : year,
        month : month,
        date : date
    };
    $.post('/duty/loadDuty', sendData , function(res){

        var user_id1 = res.user_id1;
        var user_id2 = res.user_id2;
        var user_id3 = res.user_id3;
        var user_id4 = res.user_id4;

        if(user_id1 !=null){
            $.post('/duty/getName', {id : user_id1} , function(response) {
                request_user_id1[0] = user_id1;
                request_user_name1[0] = response;
                $("#rq_1_user_1").html("<p>" + response + "</p>");
                $("#rq_1_user_1").removeClass("hidden");

            });
        }
        if(user_id2 !=null){
            $.post('/duty/getName', {id : user_id2} , function(response) {
                request_user_id1[1] = user_id2;
                request_user_name1[1] = response;
                $("#rq_1_user_2").html("<p>" + response + "</p>");
                $("#rq_1_user_2").removeClass("hidden");

            });
        }

        if(user_id3 !=null){
            $.post('/duty/getName', {id : user_id3} , function(response) {
                request_user_id1[2] = user_id3;
                request_user_name1[2] = response;
                $("#rq_1_user_3").html("<p>" + response + "</p>");
                $("#rq_1_user_3").removeClass("hidden");

            });
        }


        if(user_id4 !=null){
            $.post('/duty/getName', {id : user_id4} , function(response) {
                request_user_id1[3] = user_id3;
                request_user_name1[3] = response;
                $("#rq_1_user_4").html("<p>" + response + "</p>");
                $("#rq_1_user_4").removeClass("hidden");

            });
        }
    });

});





$('#rq_1_user_1').click(function(){
    $(this).toggleClass('warning');
    $('#rq_1_user_2').removeClass('warning');
    $('#rq_1_user_3').removeClass('warning');
    $('#rq_1_user_4').removeClass('warning');
    selected1 = 0;
    request_date1 = getrequest_date1();
    isAllSelected();
});


$('#rq_1_user_2').click(function(){
    $(this).toggleClass('warning');
    $('#rq_1_user_1').removeClass('warning');
    $('#rq_1_user_3').removeClass('warning');
    $('#rq_1_user_4').removeClass('warning');
    selected1 = 1;
    request_date1 = getrequest_date1();
    isAllSelected();
});


$('#rq_1_user_3').click(function(){
    $(this).toggleClass('warning');
    $('#rq_1_user_1').removeClass('warning');
    $('#rq_1_user_2').removeClass('warning');
    $('#rq_1_user_4').removeClass('warning');
    selected1 = 2;
    request_date1 = getrequest_date1();
    isAllSelected();
});


$('#rq_1_user_4').click(function(){
    $(this).toggleClass('warning');
    $('#rq_1_user_1').removeClass('warning');
    $('#rq_1_user_2').removeClass('warning');
    $('#rq_1_user_3').removeClass('warning');
    selected1 = 3;
    request_date1 = getrequest_date1();
    isAllSelected();
});



$('#date_picker2').datepicker({
    format : "yyyy/mm/dd",
    keyboardNavigation : false,
    todayHighlight : true,
    startDate :"d",
    endDate : "+" + endDate +"d",
    autoclose : true
});



$('#date_picker2').on('changeDate',function(event){
    var year = event.date.getFullYear();
    var month = event.date.getMonth() + 1;
    var date = event.date.getDate();

    request2_year = year;
    request2_month = month;
    request2_date = date;


    if(month < 10){
        month = '0' + month;
    }
    var sendData ={
        year : year,
        month : month,
        date : date
    };
    $.post('/duty/loadDuty', sendData , function(res){

        var user_id1 = res.user_id1;
        var user_id2 = res.user_id2;
        var user_id3 = res.user_id3;
        var user_id4 = res.user_id4;

        if(user_id1 !=null){
            $.post('/duty/getName', {id : user_id1} , function(response) {
                request_user_id2[0] = user_id1;
                request_user_name2[0] = response;
                $("#rq_2_user_1").html("<p>" + response + "</p>");
                $("#rq_2_user_1").removeClass("hidden");

            });
        }
        if(user_id2 !=null){
            $.post('/duty/getName', {id : user_id2} , function(response) {
                request_user_id2[1] = user_id2;
                request_user_name2[1] = response;
                $("#rq_2_user_2").html("<p>" + response + "</p>");
                $("#rq_2_user_2").removeClass("hidden");

            });
        }

        if(user_id3 !=null){
            $.post('/duty/getName', {id : user_id3} , function(response) {
                request_user_id2[2] = user_id3;
                request_user_name2[2] = response;
                $("#rq_2_user_3").html("<p>" + response + "</p>");
                $("#rq_2_user_3").removeClass("hidden");

            });
        }


        if(user_id4 !=null){
            $.post('/duty/getName', {id : user_id4} , function(response) {
                request_user_id2[3] = user_id3;
                request_user_name2[3] = response;
                $("#rq_2_user_4").html("<p>" + response + "</p>");
                $("#rq_2_user_4").removeClass("hidden");

            });
        }
    });

});





$('#rq_2_user_1').click(function(){
    $(this).toggleClass('warning');
    $('#rq_2_user_2').removeClass('warning');
    $('#rq_2_user_3').removeClass('warning');
    $('#rq_2_user_4').removeClass('warning');
    selected2 = 0;
    request_date2 = getrequest_date();
    isAllSelected();
});


$('#rq_2_user_2').click(function(){
    $(this).toggleClass('warning');
    $('#rq_2_user_1').removeClass('warning');
    $('#rq_2_user_3').removeClass('warning');
    $('#rq_2_user_4').removeClass('warning');
    selected2 = 1;
    request_date2 = getrequest_date();
    isAllSelected();
});


$('#rq_2_user_3').click(function(){
    $(this).toggleClass('warning');
    $('#rq_2_user_1').removeClass('warning');
    $('#rq_2_user_2').removeClass('warning');
    $('#rq_2_user_4').removeClass('warning');
    selected2 = 2;
    request_date2 = getrequest_date();
    isAllSelected();
});


$('#rq_2_user_4').click(function(){
    $(this).toggleClass('warning');
    $('#rq_2_user_1').removeClass('warning');
    $('#rq_2_user_2').removeClass('warning');
    $('#rq_2_user_3').removeClass('warning');
    selected2 = 3;
    request_date2 = getrequest_date();
    isAllSelected();
});


/*

 // The parameters are year, month, day, hours, minutes, seconds.
 var dtB = new Date(2009, 7, 24, 14, 52, 10);

 */



function isAllSelected(){
    if(selected2!==null && selected1!==null){
        if(request_date1 !==null && request_date2!==null){
            $('#changeMember1').html(request_user_name1[selected1]);
            $('#changeMember2').html(request_user_name2[selected2]);
            $("#memberinfo").removeClass('hidden');
        }
    }
}
// 그달의 날짜수를 리턴해준다
function numberOfDays(year, month) {
    var d = new Date(year, month, 0);
    return d.getDate();
}

function getrequest_date(){
    var date = new Date(request2_year,request2_month-1,request2_date);
    return date;
}


function getrequest_date1(){
    var date = new Date(request1_year,request1_month-1,request1_date);
    return date;
}