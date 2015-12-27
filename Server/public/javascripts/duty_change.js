/**
 * Created by HyunJae on 2015. 12. 27..
 */

var endDate;

var currentDate = new Date();

function numberOfDays(year, month) {
    var d = new Date(year, month, 0);
    return d.getDate();
}


endDate =  numberOfDays(currentDate.getFullYear(), currentDate.getMonth()+1) - currentDate.getDate();


var sendData ={};
sendData.year = currentDate.getFullYear();
sendData.month = currentDate.getMonth() +1;


$.post('/duty/loadMyDuty', sendData , function(res){
    $("#tmp").val(res);
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

    if(month < 10){
        month = '0' + month;
    }
    var sendData ={
        year : year,
        month : month,
        date : date
    };

    console.log("happeeenn");

    $.post('/duty/loadDuty', sendData , function(res){

        var user_id1 = res.user_id1;
        var user_id2 = res.user_id2;
        var user_id3 = res.user_id3;
        var user_id4 = res.user_id4;

        if(user_id1 !=null){
            $.post('/duty/getName', {id : user_id1} , function(response) {

                $("#user_1").html("<p>" + response + "</p>");
                $("#user_1").removeClass("hidden");

            });
        }
        if(user_id2 !=null){
            $.post('/duty/getName', {id : user_id2} , function(response) {

                $("#user_2").html("<p>" + response + "</p>");
                $("#user_2").removeClass("hidden");

            });
        }

        if(user_id3 !=null){
            $.post('/duty/getName', {id : user_id3} , function(response) {

                $("#user_3").html("<p>" + response + "</p>");
                $("#user_3").removeClass("hidden");

            });
        }


        if(user_id4 !=null){
            $.post('/duty/getName', {id : user_id4} , function(response) {

                $("#user_4").html("<p>" + response + "</p>");
                $("#user_4").removeClass("hidden");

            });
        }



    });

});


$('#user_1').click(function(){
    $(this).toggleClass('warning');
});


$('#user_2').click(function(){
    $(this).toggleClass('warning');
});


$('#user_3').click(function(){
    $(this).toggleClass('warning');
});


$('#user_4').click(function(){
    $(this).toggleClass('warning');
});




function generateMyDuty(response){


    if(response.length ==0){
        $("#noduty").val("변경할수 없는 당직이 없습니다");
    }else{
        var htmlString ="";

        $.each(response, function (idx, data) {

            if(data.date >= new Date().getDate()){

                htmlString += '<tr> <td>';
                htmlString += data.month + "월 " + data.date +  "일 ";

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




function clickEvent(response){



    $('#memberList tr').click(function(){
        $(this).toggleClass('warning');

        $('#tmp').val("sdf");
    });



    $('tr').click(function() {

        var index = $(this).index();        // catch 'index' which user clicked
        var htmlString = '';
        var data = response[index];


        //
        //
        //$('button#modify').unbind().click(function(){
        //    $('div.modal').modal('hide');
        //
        //    data.modify_mode = select_mode;
        //    data.modify_point = $("#modal-pointnumber").val();
        //    data.modify_reason = $("#modal-reason").val();
        //    $.post('/duty/modifyPointHistoty', data, function(res){
        //
        //        // success 가 온다. 성공하면
        //        console.log(res);
        //        window.location.reload();
        //    });
        //
        //});
        //
        //// 선택한 항목 벌당직 취소
        //$('button#cancel').unbind().click(function(){
        //    $('div.modal').modal('hide');
        //
        //    $.post('/duty/removePointHistory', data, function(res){
        //
        //        // success 가 온다. 성공하면
        //        console.log(res);
        //        window.location.reload();
        //    });
        //
        //});
        //
        //$('div.modal').modal();

    });
}


