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
                htmlString +=  "" + data.mode;
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

function clickEvent(datalist){
    $('tr').click(function() {
        var index = $(this).index();        // catch 'index' which user clicked
        var htmlString = '';
        var data = datalist[index];
        $('#modify').addClass('btn-primary');
        $('#modify').text('수정');
        $('#cancel').addClass('btn-primary');
        $('#cancel').text('삭제');


        $(".modal-header").html("상 벌당직 수정");


        htmlString+="<div>";
        htmlString+=" 날짜 " + data.date;
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

        $('button#cancel').unbind().click(function(){
            $('div.modal').modal('hide');
            window.location.reload();
        });

        $('div.modal').modal();

    });
}
