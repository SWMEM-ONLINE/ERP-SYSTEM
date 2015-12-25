/**
 * Created by HyunJae on 2015. 12. 23..
 */


var name;
$.post('/duty/getUser', function(res){
     name = res.name;

});

$.post('/duty/getAddPoint', function(res){
    generateHtml(res);
    clickEvent(res);
});


function generateHtml(response){

    var htmlString;


    if(response.length === 0){
        htmlString += '<p> ';
        htmlString += '</p>';
    }

    else{

        $.each(response, function (idx, data) {

            htmlString += '<tr>';

                htmlString += "<td>"

                htmlString +=  "" + data.year +"년 " + data.month +"월 " + data.date+ "일 "
                htmlString += "</td>"

                htmlString += "<td>"
                htmlString +=  "" + name;
                htmlString += "</td>"

                htmlString += "<td>"
                htmlString +=  "" + data.receive_name;
                htmlString += "</td>"

                htmlString += "<td>"

                if(data.mode==0){
                    htmlString +=  "상당직";
                }else if(data.mode==1){
                    htmlString +=  "벌당직";
                }else if(data.mode ==2){
                    htmlString +=  "운영실 벌당직";
                }

                htmlString += "</td>"

                htmlString += "<td>"
                htmlString +=  "" + data.point;
                htmlString += "</td>"
                //
                //htmlString += "<td>"
                //htmlString +=  "" + data.reason;
                //htmlString += "</td>"

            htmlString += '</tr>';

        });


    }

    $('#history').html(htmlString);

}

function clickEvent(response){
    $('tr').click(function() {

        var index = $(this).index();        // catch 'index' which user clicked
        var htmlString = '';
        var data = response[index];

        $('#modify').addClass('btn-primary');
        $('#modify').text('수정');
        $('#cancel').addClass('btn-primary');
        $('#cancel').text('삭제');


        $(".modal-header").html("상 벌당직 수정");


        htmlString+="<div>";
        htmlString +=  "" + data.year +"년 " + data.month +"월 " + data.date+ "일 "
        htmlString+="</div>";
        htmlString+="<div>";
        htmlString+=" 등록자 " + name;
        htmlString+="</div>";
        htmlString+="<div>";
        htmlString+=" 대상자 " ;
        for(var i =0 ; i< data.receive_name.length;i++){
            var user = data.receive_name[i];
            htmlString+= user + "  ";
        }
        //htmlString+=" 대상자 " +data.receive_name;
        htmlString+="</div>";
        htmlString+="<div>";

        if(data.mode==0){
            htmlString +=  "상당직";
        }else if(data.mode==1){
            htmlString +=  "벌당직";
        }else if(data.mode ==2){
            htmlString +=  "운영실 벌당직";
        }
        htmlString+="</div>";


        htmlString+="<div>";
        htmlString+="  " +data.point + " 일";

        htmlString+="</div>";


        htmlString+="";
        htmlString+="";
        htmlString+="";
        htmlString+="";


        $('div.modal-body').html(htmlString);


        $('button#modify').unbind().click(function(){
            $('div.modal').modal('hide');
            window.location.reload();
        });

        // 선택한 항목 벌당직 취소
        $('button#cancel').unbind().click(function(){
            $('div.modal').modal('hide');



            $.post('/duty/removePointHistory', data, function(res){

                // success 가 온다. 성공하면
                console.log(res);

                window.location.reload();
            });

        });

        $('div.modal').modal();

    });
}
