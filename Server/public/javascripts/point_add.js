/**
 * Created by HyunJae on 2015. 12. 23..
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

var date = new Date();

var dateHtml = date.getFullYear() + "년 " + (date.getMonth()+1)  + "월 " + date.getDate() +"일";

$("#date").html(dateHtml);

$.post('/duty/getMemberList', function(res){

    generateMemberTable(res);
    clickEvent(res);
});

var periods = [];
var select_user_list = new Array();
var select_mode = 0;

$('#mode-dropdown li a').click(function(){
    //$('#seriesDropdown').on("hide.bs.dropdown");
    $('#mode-button').html($(this).html());
    select_mode = $(this).parent().index();
});


$("#send").click(function(){

    var currentDate = new Date();
    var point  = $("#point").val();
    var reason  = $("#reason").val();
    var mode  = select_mode;

    var sendData = {
        year : currentDate.getFullYear(),
        month : currentDate.getMonth()+1,
        date : currentDate.getDate(),
        recieveUserList : select_user_list,
        point : point,
        mode : mode,
        reason : reason
    };

    if(select_user_list.length == 0){

        toastr['error']('선택된 사람이 없습니다!');

    }else{
        $.post('/duty/addPoint' , sendData , function(res){
            if(res == "fail"){
                toastr['error']('상벌당직 추가 실패');
            }
            else{
                toastr['success']('상벌당직 추가 성공');
            }
        });
    }


});


function generateMemberTable(res){
    /*

         일단 기수별로 정렬

     */
    var period;
    var row;
    var flag=1;
    for(var i=0;i<res.length;i++){
        row = res[i];
        period = row.u_period;

        flag = 1;
        for(var j=0; j<periods.length;j++){
            if(periods[j] == period){
                flag = 0;
            }
        }
        if(flag == 1){
            periods.push(period);
        }

    }
    periods.reverse();

    var htmlString ="";
    var len = periods.length;



    if(len ==0){
        $("#tmp").html("there is no data");
    }
    else{
        for(var i=0;i< len;i++){

            period = periods[i];
            htmlString += "<tr>";
            htmlString += "<th style='text-align: center' colspan='4' class ='" + period +"'>";
            htmlString += period +"기";
            htmlString += "</th>";
            htmlString += "</tr>";

            var count =0;
            var member;
            for(var j=0;j<res.length;j++){

                member = res[j];

                if(period == member.u_period){
                    if(count%5 ==0){
                        htmlString += "<tr>";
                    }

                    htmlString += "<td id ='" +j + "'>";
                    htmlString += member.u_name;
                    htmlString += "</td>";

                    count++;
                    if(count%5 ==0){
                        htmlString += "</tr>";
                    }
                }
            }

        }
    }


    $("#memberList").html(htmlString);

}


function clickEvent(response){

    $("#memberList").on("click", "td", function() {


        var index = $(this).attr('id')
        $(this).toggleClass('warning');


        var data  =  response[index];
        var id = data.u_id;

        var flag = 1;
        for(var i=0;i<select_user_list.length;i++){
            var user = select_user_list[i];
            if(user == id){
                flag = 0;
                select_user_list.splice(i,1);
            }
        }

        if(flag == 1 ){

            select_user_list.push(id);
        }

    });



}