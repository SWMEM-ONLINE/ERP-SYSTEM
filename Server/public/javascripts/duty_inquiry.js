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


$.post('/duty/getUser', function(res){

    var htmlString = res.name + "님은";
    $('#name').html(htmlString);

    htmlString = "입니다";
    $('#foot').html(htmlString);

});


var sendData ={};
sendData.year = new Date().getFullYear();
sendData.month = new Date().getMonth() +1;


$.post('/duty/loadMyDuty', sendData , function(res){
    generateHtml(res);
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

    $.post('/duty/loadMyDuty', sendData , function(res){
        generateHtml(res);
    });

});



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