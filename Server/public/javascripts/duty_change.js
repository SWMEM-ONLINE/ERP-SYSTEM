/**
 * Created by HyunJae on 2015. 12. 27..
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

var user_id;


$.post("/duty/getID",function(res){
   user_id =res;
});


endDate =  numberOfDays(currentDate.getFullYear(), currentDate.getMonth()+1) - currentDate.getDate();
var request_user_name2 = [];
var request_user_id2 = [];
var request_date1;
var request_date2;

var dates = [];
var selected = null;
var selected_my_duty =null;

var request2_year;
var request2_month;
var request2_date;


var sendData ={};

sendData.year = currentDate.getFullYear();
sendData.month = currentDate.getMonth() +1;



$("#showresult").click(function(){

    $.post("showChangeDutyHistrory", function(res){


        var htmlString = "";
        var count = 0;
        var buttonList = [];

        $.each(res, function (idx, data) {
            var accept_button_id;
            var decline_button_id;
            var rq_time = new Date(data.request_time);
            var rq_date1 = new Date(data.request_date1);
            var rq_date2 = new Date(data.request_date2);
            var rq_id1 = data.request_userid1;
            var rq_name1 = data['(select u_name from t_user where u_id = request_userid1)'];
            var rq_id2 = data.request_userid2;
            var rq_name2 = data['(select u_name from t_user where u_id = request_userid2)'];
            var index = data.index;
            var accept = data.accepted;


            htmlString += "<tr>";
            htmlString += "<td>";

            var request1 = "" + rq_date1.getFullYear() + "-" +(rq_date1.getMonth()+1)+"-" + rq_date1.getDate() +" / " +
                rq_name1;
            htmlString += request1;
            htmlString += "</td>";

            htmlString += "<td>";

            var request2 = "" + rq_date2.getFullYear() + "-" +(rq_date2.getMonth()+1)+"-" + rq_date2.getDate() +" / " +
                rq_name2;
            htmlString += request2;
            htmlString += "</td>";


            // wait
            if(accept==0 && rq_id1==user_id){

                htmlString += "<td>";

                htmlString += "대기";

                htmlString += "</td>";


            }

            else if(accept==0 && rq_id1 != user_id){
                accept_button_id = "accept" + count;
                decline_button_id = "decline" + count;
                buttonList.push(idx);
                htmlString += "<td>";

                htmlString += '<button id= "' +accept_button_id + '" type="button" class="btn" >수락</button>';
                htmlString += '<button id= "' +decline_button_id + '" type="button" class="btn" >거절</button>';
                $(document).on('click', "#accept"+count, function(){

                    var sendData = {};
                    sendData.index = index;
                    sendData.request_date1 = rq_date1;
                    sendData.request_date2 = rq_date2;
                    sendData.rq_id1 = rq_id1;
                    sendData.rq_id2 = rq_id2;


                    $.post('/duty/acceptChangeDuty', sendData , function(res){

                        if(res == "success"){
                            $('div.modal').modal('hide');
                            toastr['success']('맞변경 수락 완료');

                        }
                        else{
                            toastr['error']('맞변경 수락 에러');

                        }



                    });
                    console.log(data);
                });

                $(document).on('click', "#decline"+count, function(){

                    var sendData = {};
                    sendData.index = index;
                    sendData.request_date1 = rq_date1;
                    sendData.request_date2 = rq_date2;
                    sendData.rq_id1 = rq_id1;
                    sendData.rq_id2 = rq_id2;


                    $.post('/duty/declineChangeDuty', sendData , function(res){

                        if(res == "success"){
                            $('div.modal').modal('hide');
                            toastr['success']('맞변경 거부 완료');

                        }
                        else{
                            toastr['success']('맞변경 거부 에러');

                        }



                    });
                    console.log(data);
                });

                htmlString += "</td>";
                count++;

            }
            // accept or decline
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



$("#request").unbind().click(function() {

    var sendData ={};

    sendData.request_date1 = request_date1;
    sendData.request_date2 = request_date2;
    sendData.requset_id1 = null;
    sendData.request_id2 = request_user_id2[selected];


    $(" #memberinfo").addClass("hidden");

    $.post('/duty/requestChangeDuty',sendData, function(res){
        if(res.length ==0){
            toastr['error']('맞변경 신청 실패');
        }else{
            toastr['success']('맞변경 신청 완료');

        }
    });

});


$.post('/duty/loadMyDuty', sendData , function(res){
    generateMyDuty(res);
    clickEvent(res);
});



$('#date_picker').datepicker({
    format : "yyyy/mm/dd",
    keyboardNavigation : false,
    todayHighlight : true,
    startDate :"d",
    endDate : "+" + endDate +"d",
    autoclose : true
});



$('.datepicker').on('changeDate',function(event){
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

        $("#user_1").addClass("hidden");
        $("#user_2").addClass("hidden");
        $("#user_3").addClass("hidden");
        $("#user_4").addClass("hidden");


        var user_id1 = res.user_id1;
        var user_id2 = res.user_id2;
        var user_id3 = res.user_id3;
        var user_id4 = res.user_id4;

        if(user_id1 !=null){
            $.post('/duty/getName', {id : user_id1} , function(response) {
                request_user_id2[0] = user_id1;
                request_user_name2[0] = response;
                $("#user_1").html("<p>" + response + "</p>");
                $("#user_1").removeClass("hidden");

            });
        }
        if(user_id2 !=null){
            $.post('/duty/getName', {id : user_id2} , function(response) {
                request_user_id2[1] = user_id2;
                request_user_name2[1] = response;
                $("#user_2").html("<p>" + response + "</p>");
                $("#user_2").removeClass("hidden");

            });
        }

        if(user_id3 !=null){
            $.post('/duty/getName', {id : user_id3} , function(response) {
                request_user_id2[2] = user_id3;
                request_user_name2[2] = response;
                $("#user_3").html("<p>" + response + "</p>");
                $("#user_3").removeClass("hidden");

            });
        }


        if(user_id4 !=null){
            $.post('/duty/getName', {id : user_id4} , function(response) {
                request_user_id2[3] = user_id3;
                request_user_name2[3] = response;
                $("#user_4").html("<p>" + response + "</p>");
                $("#user_4").removeClass("hidden");

            });
        }
    });

});





$('#user_1').unbind().click(function(){
    $(this).toggleClass('warning');
    $('#user_2').removeClass('warning');
    $('#user_3').removeClass('warning');
    $('#user_4').removeClass('warning');
    selected = 0;
    getrequest_date2();
    isAllSelected();
});


$('#user_2').unbind().click(function(){
    $(this).toggleClass('warning');
    $('#user_1').removeClass('warning');
    $('#user_3').removeClass('warning');
    $('#user_4').removeClass('warning');
    selected = 1;
    getrequest_date2();
    isAllSelected();
});


$('#user_3').unbind().click(function(){
    $(this).toggleClass('warning');
    $('#user_1').removeClass('warning');
    $('#user_2').removeClass('warning');
    $('#user_4').removeClass('warning');
    selected = 2;
    getrequest_date2();
    isAllSelected();
});


$('#user_4').unbind().click(function(){
    $(this).toggleClass('warning');
    $('#user_1').removeClass('warning');
    $('#user_2').removeClass('warning');
    $('#user_3').removeClass('warning');
    selected = 3;
    getrequest_date2();
    isAllSelected();
});



function generateMyDuty(response){


    if(response.length ==0){
        $("#noduty").val("변경할수 없는 당직이 없습니다");
    }else{
        var htmlString ="";
        var count = 0;
        $.each(response, function (idx, data) {

            if(data.date >= new Date().getDate()){

                htmlString += '<tr> <td>';
                htmlString += data.month + "월 " + data.date +  "일 ";
                dates[count++] = data.date;
                if(data.type == 0){
                    htmlString += " 일반당직";
                }else if (data.type ==1){
                    htmlString += " 벌당직";
                }

                htmlString += '</td></tr>';
            }

        });

        $("#memberList").html(htmlString);


    }
}

/*

 // The parameters are year, month, day, hours, minutes, seconds.
 var dtB = new Date(2009, 7, 24, 14, 52, 10);

 */


function clickEvent(response){

    $('#memberList tr').unbind().click(function(){
        $('#memberList tr').removeClass('warning');
        $(this).toggleClass('warning');
        var index = $(this).index();
        selected_my_duty = index;
        //$(this).text(index+"");
        request_date1 = new Date(currentDate.getFullYear(), currentDate.getMonth(), dates[index]);
        console.log(request_date1);
        isAllSelected();

    });

}

function isAllSelected(){
    if(selected_my_duty!==null && selected!==null){
        if(request_date1 !==null && request_date2!==null){
            $('#requestmember2').html(request_user_name2[selected]);
            $("#memberinfo").removeClass('hidden');
        }
    }
}
// 그달의 날짜수를 리턴해준다
function numberOfDays(year, month) {
    var d = new Date(year, month, 0);
    return d.getDate();
}

function getrequest_date2(){
    request_date2 = new Date(request2_year,request2_month-1,request2_date);
    return true;
}