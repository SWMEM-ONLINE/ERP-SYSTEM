/**
 * Created by HyunJae on 2015. 12. 23..
 */




//$('#tmp').click(function(){
//
//    $.post('/duty/loadMyDuty', function(res){
//        generateHtml(res);
//    });
//
//});


$.post('/duty/getUser', function(res){

    var htmlString = res.name + "님은";
    $('#name').html(htmlString);

    htmlString = "입니다";
    $('#foot').html(htmlString);

});


$.post('/duty/loadMyDuty', function(res){
    generateHtml(res);
});


function generateHtml(datas){

    var htmlString = '<div>';


    if(datas.length === 0){
        htmlString += '<p> ';
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