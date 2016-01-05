/**
 * Created by HyunJae on 2016. 1. 4..
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


var gradeList = ["A","B","C"];
var dayList = ["일","월","화","수","목","금","토"];

loadNormalCheckList();

$('ul.nav-pills li').click(function(){          // Divide Normal or Special Hardware
    var index = $(this).index();
    $('ul.nav-pills li').removeClass('active');
    $(this).addClass('active');
    // 일반당직
    if(index === 0) {                           //            // Choose Special Hardware
        $('table#checkList').removeClass('hidden');
        $("#add_normal_duty").removeClass('hidden');
        $('table#badcheckList').addClass('hidden');
        $('#add_bad_duty').addClass('hidden');
        loadNormalCheckList();
    }
    // 벌당직
    else{
        $('table#badcheckList').removeClass('hidden');
        $('#add_bad_duty').removeClass('hidden');
        $("#add_normal_duty").addClass('hidden');
        $('table#checkList').addClass('hidden');
        loadBadCheckList();
    }
});

$('#add_normal_duty').click(function(){
    addNormalDuty("normal");

});

$('#add_bad_duty').click(function(){
    addNormalDuty("bad");

});





function addNormalDuty(type){

    $("#add").removeClass("hidden");
    $("#modify").addClass("hidden");
    $("#delete").addClass("hidden");
    $("#cancel").removeClass("hidden");
    var grade_day = null;
    var idx = 0;
    var sendData = {};

    if(type == "normal"){
        $('#modal_Button').html("A");
        $(".bad").addClass("hidden");
        $("#drop0").html("A");
        $("#drop1").html("B");
        $("#drop2").html("C");
        $("#grade_or_day").html("등급");
        grade_day = "A";
    }
    else{
        $(".bad").removeClass("hidden");
        $('#modal_Button').html("일");
        $("#drop0").html("일");
        $("#drop1").html("월");
        $("#drop2").html("화");
        $("#drop3").html("수");
        $("#drop4").html("목");
        $("#drop5").html("금");
        $("#drop6").html("토");
        $("#grade_or_day").html("요일");
        grade_day = "일";
    }


    $("#modal_section").val("");
    $("#modal_content").val("");


    $('#modal_dropdown li a').click(function(){
        $('#modal_Button').html($(this).html());
        idx = $(this).parent().index();
        if(type == "normal"){
            grade_day = gradeList[idx];
        }
        else{
            grade_day = dayList[idx];
        }

    });

    $("#add").click(function(){

        sendData.section = $("#modal_section").val();
        sendData.content = $("#modal_content").val();




        if(!isAllSet(sendData.section, sendData.content)){
            return;
        }


        if(type == "normal"){

            sendData.grade = grade_day;
            $.post("/duty/insertCheckList", sendData, function(res){
                $(".modal").modal('hide');

                if(res == "success"){
                    toastr['success']('CheckList 추가 성공');
                    loadNormalCheckList();
                }
                else{
                    toastr['error']('CheckList 추가 실패');
                }

            });
        }
        else{

            sendData.day = grade_day;
            $.post("/duty/insertBadCheckList", sendData, function(res){
                $(".modal").modal('hide');

                if(res == "success"){
                    toastr['success']('CheckList 추가 성공');
                    loadBadCheckList();
                }
                else{
                    toastr['error']('CheckList 추가 실패');
                }

            });
        }

        $("#add").unbind("click");
        $("#delete").unbind("click");
        $("#modify").unbind("click");
    });


    $("#cancel").click(function(){

        $(".modal").modal('hide');
        $("#delete").unbind("click");
        $("#add").unbind("click");
        $("#modify").unbind("click");
    });

    $(".modal").modal();


}


function isAllSet(section , content){

    if(section ==""){
        toastr['error']('구역을 설정해주세요.');
        return false;
    }
    if(content ==""){
        toastr['error']('내용을 설정해주세요.');
        return false;
    }

    return true;
}

function loadBadCheckList(){

    $.post('/duty/inquireALLBadCheckList' , function(res){

        var type ="bad";
        badGenarateHtml(res);
        addClickEvent(res,type);
        console.log(res);

    });
}

function loadNormalCheckList(){
    $.post('/duty/inquireAllCheckList' , function(res){

        var type ="normal";
        normalGenarateHtml(res);
        addClickEvent(res,type);
        console.log(res);

    });
}


function normalGenarateHtml(res){

    var data;
    var content;
    var section;
    var grade;
    var index;
    var prev = "";
    var htmlString = "";
    htmlString+="<tr>";
    htmlString+="<th>";
    htmlString+="등급";
    htmlString+="</th>";
    htmlString+="<th>";
    htmlString+="구역";
    htmlString+="</th>";
    htmlString+="<th>";
    htmlString+="내용";
    htmlString+="</th>";
    htmlString+="</tr>";

    for(var i = 0 ; i< res.length; i++){

        data = res[i];
        content = data.content;
        section = data.section;
        grade = data.grade;
        index = data.index;

        if(prev != section){
            prev = section;
            htmlString+="<tr id = normal" + index +" class='solidtd'>";
        }
        else{
            htmlString+="<tr id = normal" + index +">";
        }


        htmlString+="<td>";
        htmlString+=grade;
        htmlString+="</td>";
        htmlString+="<td>";
        htmlString+=section;
        htmlString+="</td>";
        htmlString+="<td>";
        htmlString+=content;
        htmlString+="</td>";
        htmlString+="</tr>";
    }

    $("#checkList").html(htmlString);
}

function badGenarateHtml(res){

    var data;
    var content;
    var section;
    var day;
    var index;
    var prev = "";
    var htmlString = "";
    htmlString+="<tr>";
    htmlString+="<th>";
    htmlString+="요일";
    htmlString+="</th>";
    htmlString+="<th>";
    htmlString+="구역";
    htmlString+="</th>";
    htmlString+="<th>";
    htmlString+="내용";
    htmlString+="</th>";
    htmlString+="</tr>";

    for(var i = 0 ; i< res.length; i++){

        data = res[i];
        content = data.content;
        section = data.section;
        index = data.index;
        day = data.day;

        if(prev != section){
            prev = section;
            htmlString+="<tr id = normal" + index +" class='solidtd'>";
        }
        else{
            htmlString+="<tr id = normal" + index +">";
        }

        htmlString+="<td>";
        htmlString+=day;
        htmlString+="</td>";
        htmlString+="<td>";
        htmlString+=section;
        htmlString+="</td>";
        htmlString+="<td>";
        htmlString+=content;
        htmlString+="</td>";
        htmlString+="</tr>";
    }

    $("#badcheckList").html(htmlString);
}


function addClickEvent(res,type){

    $('.list tr').click(function(){

        var index = $(this).index() - 1;
        var data = res[index];

        console.log(data);

        genarateModal(data,type);

    });
}

function genarateModal(data, type){
    $("#add").addClass("hidden");
    $("#modify").removeClass("hidden");
    $("#delete").removeClass("hidden");
    $("#cancel").removeClass("hidden");
    var grade_day;
    if(type == "normal"){
        grade_day = data.grade;
        $(".bad").addClass("hidden");
        $("#drop0").html("A");
        $("#drop1").html("B");
        $("#drop2").html("C");
        $("#grade_or_day").html("등급");
    }
    else{
        grade_day = data.day;
        $(".bad").removeClass("hidden");
        $("#drop0").html("일");
        $("#drop1").html("월");
        $("#drop2").html("화");
        $("#drop3").html("수");
        $("#drop4").html("목");
        $("#drop5").html("금");
        $("#drop6").html("토");
        $("#grade_or_day").html("요일");
    }
    var section = data.section;
    var content = data.content;
    var index = data.index;
    var idx = null;
    var sendData = {};


    $("#modal_Button").html(grade_day).val(grade_day);
    $("#modal_section").val(section);
    $("#modal_content").val(content);

    $('#modal_dropdown li a').click(function(){
        $('#modal_Button').html($(this).html());
        idx = $(this).parent().index();
        if(type == "normal"){
            grade_day = gradeList[idx];
        }
        else{
            grade_day = dayList[idx];
        }

    });

    $("#modify").click(function(){



        sendData.index = index;
        sendData.type = type;
        sendData.section = $("#modal_section").val();
        sendData.content = $("#modal_content").val();

        if(type == "normal"){

            sendData.grade = grade_day;
            $.post("/duty/modifyCheckList", sendData, function(res){
                $(".modal").modal('hide');

                if(res == "success"){
                    toastr['success']('CheckList 수정 성공');
                    loadNormalCheckList();
                }
                else{
                    toastr['error']('CheckList 수정 실패');
                }

            });
        }
        else{
            sendData.day = grade_day;
            $.post("/duty/modifyBadCheckList", sendData, function(res){
                $(".modal").modal('hide');

                if(res == "success"){
                    toastr['success']('CheckList 수정 성공');
                    loadBadCheckList();
                }
                else{
                    toastr['error']('CheckList 수정 실패');
                }

            });
        }

        $("#delete").unbind("click");
        $("#add").unbind("click");
        $("#modify").unbind("click");
    });


    $("#delete").click(function(){

        sendData.index = index;

        if(type == "normal"){
            $.post("/duty/deleteCheckList", sendData, function(res){
                $(".modal").modal('hide');

                if(res == "success"){
                    toastr['success']('CheckList 삭제 성공');
                    loadNormalCheckList();
                }
                else{
                    toastr['error']('CheckList 삭제 실패');
                }
            });
        }
        else{
            $.post("/duty/deleteBadCheckList", sendData, function(res){
                $(".modal").modal('hide');

                if(res == "success"){
                    toastr['success']('CheckList 삭제 성공');
                    loadBadCheckList();
                }
                else{
                    toastr['error']('CheckList 삭제 실패');
                }
            });
        }
        $("#delete").unbind("click");
        $("#add").unbind("click");
        $("#modify").unbind("click");
    });

    $("#cancel").click(function(){

        $(".modal").modal('hide');
        $("#add").unbind("click");
        $("#modify").unbind("click");
        $("#delete").unbind("click");
    });

    $(".modal").modal();

}

