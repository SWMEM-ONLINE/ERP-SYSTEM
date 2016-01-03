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

var name;
$.post('/duty/getUser', function(res){
     name = res.name;

});

$.post('/duty/getAddPoint', function(res){
    generateHtml(res);
    clickEvent(res);
});

var select_mode = 0;

$('#mode-dropdown li a').click(function(){
    //$('#seriesDropdown').on("hide.bs.dropdown");
    $('#mode-button').html($(this).html());
    select_mode = $(this).parent().index();
});

function generateHtml(response){

    var htmlString =" ";


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

        $("#modal-date").html("" + data.year +"년 " + data.month +"월 " + data.date+ "일 ");

        $("#modal-enroller").html(name);

        $("#modal-objects").val(data.receive_name);

        if(data.mode==0){
            select_mode=0;
            $("#mode-button").val("상당직");
        }else if(data.mode==1){
            select_mode=1;
            $("#mode-button").val("벌당직");
        }else if(data.mode ==2){
            select_mode=2;
            $("#mode-button").val("운영실 벌당직");
        }


        $("#modal-pointnumber").val(data.point);

        $(" #modal-reason").val(data.reason);


        $('button#modify').unbind().click(function(){
            $('div.modal').modal('hide');

            data.modify_mode = select_mode;
            data.modify_point = $("#modal-pointnumber").val();
            data.modify_reason = $("#modal-reason").val();
            $.post('/duty/modifyPointHistoty', data, function(res){

                // success 가 온다. 성공하면

                if(res == "success"){
                    toastr['success']('상벌당직 수정 성공');

                    $.post('/duty/getAddPoint', function(res){
                        generateHtml(res);
                        clickEvent(res);
                    });
                }
                else{
                    toastr['error']('상벌당직 수정 실패');

                }
                console.log(res);
            });

        });

        // 선택한 항목 벌당직 취소
        $('button#cancel').unbind().click(function(){
            $('div.modal').modal('hide');

            $.post('/duty/removePointHistory', data, function(res){

                if(res == "success"){
                    toastr['success']('상벌당직 삭제 성공');

                    $.post('/duty/getAddPoint', function(res){
                        generateHtml(res);
                        clickEvent(res);
                    });
                }
                else{
                    toastr['error']('상벌당직 삭제 실패');

                }
                console.log(res);
            });

        });

        $('div.modal').modal();

    });
}
