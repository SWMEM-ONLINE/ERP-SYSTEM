/**
 * Created by HyunJae on 2015. 12. 23..
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

    $.post('/duty/loadMyPointHistory', sendData , function(res){
        generateHtml(res);
    });

});


$.post('/duty/getUser', function(res){

    var htmlString = res.name + "님은 총 ";
    $('#name').html(htmlString);
    htmlString = res.name + "님은 이번 달에  ";
    $('#name2').html(htmlString);

    $("#total").html("상당직 "+ res.good_duty_point + "개, " + "벌당직 " + res.bad_duty_point +"개, 운영실 벌당직 "
        + res.manager_bad_duty_point +"개 ");

    htmlString = "받으셨습니다";
    $('#foot').html(htmlString);
    $('#foot2').html(htmlString);

});

var goodDutyPoint = 0;
var badDutyPoint = 0;
var managerBadDutyPoint = 0;

var date = new Date();
var sendData ={
    year : date.getFullYear(),
    month : date.getMonth() +1
};

$.post('/duty/loadMyPointHistory', sendData , function(res){
     generateHtml(res);
});



function generateHtml(response){

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

            htmlString += '<tr>';

            htmlString += "<td>"
            htmlString +=  "" + data.month +"월 " + data.date+ "일 "
            htmlString += "</td>"

            htmlString += "<td>"
            htmlString +=  "" + data.send_user;
            htmlString += "</td>"

            htmlString += "<td>"
            if(data.mode == 0 ){
                htmlString +=  "상당직";
                goodDutyPoint += data.point;
            }else if (data.mode == 1){
                htmlString += "벌당직";
                badDutyPoint += data.point;
            }else if(data.mode ==2){
                htmlString += "운영실벌당직";
                managerBadDutyPoint += data.point;
            }

            htmlString += "</td>"

            htmlString += "<td>"
            htmlString +=  "" + data.point;
            htmlString += "</td>"

            htmlString += "<td>"
            htmlString +=  "" + data.reason;
            htmlString += "</td>"

            htmlString += '</tr>';

        });


    }
    $("#point_status").html("상당직 "+ goodDutyPoint + "개, " + "벌당직 " + badDutyPoint +"개, 운영실 벌당직 "
    + managerBadDutyPoint +"개 ");


    $('#history').html(htmlString);

}