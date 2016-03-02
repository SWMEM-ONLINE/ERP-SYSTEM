/**
 * Created by HyunJae on 2015. 12. 23..
 */
/*
 hr
 #name2.gray
 #point_status.point
 #foot2.gray


 */
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
    if(month < 10){
        month = '0' + month;
    }
    console.log(month);
    var sendData ={
        year : year,
        month : month
    };

    if(flag==0){
        getPersonPoint(year,month);

    }
    else{
        getAllPoint(year,month);
    }


});

var goodDutyPoint = 0;
var badDutyPoint = 0;
var managerBadDutyPoint = 0;
var date = new Date();


$.post('/duty/getUser', function(res){
    var htmlString = " 지금까지 총 ";
    $('#name').html(htmlString);
    $("#total").html("상당직 "+ res.good_duty_point + "개, " + "벌당직 " + res.bad_duty_point +"개, 운영실 벌당직 "
        + res.manager_bad_duty_point +"개 ");
    htmlString = "받으셨습니다";
    $('#foot').html(htmlString);

});

getPersonPoint(date.getFullYear(),date.getMonth()+1);


// 0 이면 person
// 1 이면 ALL
var flag = 0 ;

$('#toggle').unbind().click(function(){

    // ALL 보기
    if(flag==0){
        flag=1;
        $("#person").addClass("hidden");
        $("#all").removeClass("hidden");
        $(this).html("상벌당직조회");
        getAllPoint(date.getFullYear(),date.getMonth()+1);
    }

    // 개인적 보기
    else{
        $("#all").addClass("hidden");
        $("#person").removeClass("hidden");
        $(this).html("전체회원조회");
        getPersonPoint(date.getFullYear(),date.getMonth()+1);
        flag=0;
    }

});


function getAllPoint(year, month){

    var sendData ={
        year : year,
        month : month
    };


    $('.datepicker').val(year+"년 "+ month+"월");

    $.post('/duty/getAllPoint', sendData ,function(res){
        //console.log(res);
        generateAllHtml(res);
    });

    $.post('/duty/getAllPointHistory', sendData, function(res){
        //console.log(res);
        generateAllHistoryHtml(res)
    });
}

function generateAllHtml(response){
    var htmlString ='';
    var sum = 0;
    var prev = "";
    if(response.length === 0){
        htmlString += '<p>';
        htmlString += '</p>';
    }

    else{

        $.each(response, function (idx, data) {

            if(prev != data.u_period){
                prev = data.u_period;
                htmlString += "<tr>";
                htmlString += "<td colspan='5' class='period' >";
                htmlString += prev +"기";
                htmlString += "</td>";
                htmlString += "</tr>";
            }

            htmlString += '<tr>';

            htmlString += "<td>";
            htmlString +=  "" + data.u_name ;
            htmlString += "</td>";

            htmlString += "<td>";
            htmlString +=  "" + data.good_point;
            htmlString += "</td>";

            htmlString += "<td>";
            htmlString +=  "" + data.bad_point;
            htmlString += "</td>";

            htmlString += "<td>";
            htmlString +=  "" + data.manager_bad_point;
            htmlString += "</td>";

            sum = data.good_point - data.bad_point - data.manager_bad_point;


            htmlString += "<td>";
            htmlString +=  "" + sum;
            htmlString += "</td>";

            htmlString += '</tr>';

        });


    }

    $('#allPoint').html(htmlString);


}


function generateAllHistoryHtml(response){
    var htmlString ='';

    if(response.length === 0){
        htmlString += '<p>';
        htmlString += '</p>';
    }

    else{

        $.each(response, function (idx, data) {

            if(data.reason =="POINT_INIT") {
                return true;
            }

            htmlString += '<tr>';

            htmlString += "<td>";
            htmlString +=  "" + data.month +"월 " + data.date+ "일 ";
            htmlString += "</td>";

            htmlString += "<td>";
            htmlString +=  "" + data.send_name;
            htmlString += "</td>";

            htmlString += "<td>";
            for(var i=0;i<data.receive_name.length;i++){
                if(i==0){
                    htmlString += data.receive_name[i];
                }else{
                    htmlString += ', '+  data.receive_name[i];
                }
            }
            htmlString += "</td>";

            if(data.mode == 0 ){
                htmlString += "<td style='color:#009926'>";
                htmlString +=  "상당직";
            }else if (data.mode == 1){
                htmlString += "<td style='color: #8B0000'>";
                htmlString += "벌당직";
            }else if(data.mode ==2){
                htmlString += "<td style='color: #8B0000'>";
                htmlString += "운영실벌당직";
            }
            htmlString += "</td>";

            htmlString += "<td>";
            htmlString +=  "" + data.point;
            htmlString += "</td>";

            htmlString += "<td>";
            htmlString +=  "" + data.reason;
            htmlString += "</td>";
            htmlString += '</tr>';

        });


    }

    $('#allPointHistory').html(htmlString);

}



function getPersonPoint(year, month){

    $('.datepicker').val(year+"년 "+ month+"월");

    var sendData ={
        year : year,
        month : month
    };

    $.post('/duty/loadMyPointHistory', sendData , function(res){

        generatePersonHtml(res);
    });

}


function generatePersonHtml(response){

    goodDutyPoint = 0;
    badDutyPoint = 0;
    managerBadDutyPoint = 0;
    var htmlString ='';

    if(response.length === 0){
        htmlString += '<p> ';
        htmlString += '</p>';
    }

    else{

        $.each(response, function (idx, data) {

            if(data.reason =="POINT_INIT") {
                return true;
            }

            htmlString += '<tr>';

            htmlString += "<td>";
            htmlString +=  "" + data.month +"월 " + data.date+ "일 ";
            htmlString += "</td>";

            htmlString += "<td>";
            htmlString +=  "" + data.send_user;
            htmlString += "</td>";

            if(data.mode == 0 ){
                htmlString += "<td style='color:#009926'>";
                htmlString +=  "상당직";
                goodDutyPoint += data.point;
            }else if (data.mode == 1){
                htmlString += "<td style='color:#8B0000'>";
                htmlString += "벌당직";
                badDutyPoint += data.point;
            }else if(data.mode ==2){
                htmlString += "<td style='color:#8B0000'>";
                htmlString += "운영실벌당직";
                managerBadDutyPoint += data.point;
            }

            htmlString += "</td>";

            htmlString += "<td>";
            htmlString +=  "" + data.point;
            htmlString += "</td>";

            htmlString += "<td>";
            htmlString +=  "" + data.reason;
            htmlString += "</td>";

            htmlString += '</tr>';

        });


    }


    $('#history').html(htmlString);

}