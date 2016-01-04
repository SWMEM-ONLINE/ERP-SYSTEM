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


var type = "";
var duty_index = null;
var grade_index= null;
var dutyList = ["normal","bad"];
var gradeList = ["A","B","C"];

$('ul.nav-pills li').click(function(){          // Divide Normal or Special Hardware
    var index = $(this).index();
    $('ul.nav-pills li').removeClass('active');
    $(this).addClass('active');
    if(index === 0) {                           // Choose Normal Hardware
        $('table#addlist').removeClass('hidden');
        $('table#checkList').addClass('hidden');
        $('table#badcheckList').addClass('hidden');

    }else if(index === 1){                                     // Choose Special Hardware
        $('table#addlist').addClass('hidden');
        $('table#checkList').removeClass('hidden');
        $('table#badcheckList').addClass('hidden');


        type = "normal";
        loadNormalCheckList();
    }else{
        $('table#addlist').addClass('hidden');
        $('table#checkList').addClass('hidden');
        $('table#badcheckList').removeClass('hidden');



        type = "bad";
        loadBadCheckList();
    }
});


$('#dropdown li a').click(function(){
    $('#gradeButton').html($(this).html());
    grade_index = $(this).parent().index();
});

$('#dutyDropDown li a').click(function(){
    $('#dutyButton').html($(this).html());
    duty_index = $(this).parent().index();
});


$("#add").click(function(){
    if(!isAllSet()){
        return;
    }

    var sendData = {};
    var type = dutyList[duty_index];
    var grade = gradeList[grade_index];
    var section = $('#section').val();
    var content = $('#content').val();

    sendData.type =type;
    sendData.grade =grade;
    sendData.section =section;
    sendData.content =content;


    $.post("/duty/insertCheckList", sendData ,function(res){

        if(res == "success")
        {
            $('#section').val("");
            $('#content').val("");
            $('#gradeButton').html("등급");
            $('#dutyButton').html("당직");
            duty_index = null;
            grade_index= null;
            toastr['success']('CheckList 추가 성공');
        }
        else
        {
            toastr['error']('CheckList 추가 실패');
        }

    });

});


function isAllSet(){
    console.log(grade_index);
    console.log(duty_index);
    console.log($('#section').val());
    console.log($('#content').val());

    if(duty_index == null){
        toastr['error']('당직을 설정해주세요.');
        return false;
    }
    if(grade_index == null){
        toastr['error']('등급을 설정해주세요.');
        return false;
    }

    if($('#section').val() ==""){
        toastr['error']('구역을 설정해주세요.');
        return false;
    }
    if($('#content').val() ==""){
        toastr['error']('내용을 설정해주세요.');
        return false;
    }

    return true;
}


function loadNormalCheckList(){
    $.post('/duty/inquireCheckList', { type : "normal"} , function(res){

        var type = "normal";

        genarateHtml(res,type);
        addClickEvent(res,type);

        console.log(res);
        console.log(flag);

    });
}

function loadBadCheckList(){
    $.post('/duty/inquireCheckList', { type : "bad"} , function(res){

        var type = "bad";

        genarateHtml(res,type);
        addClickEvent(res,type);
        console.log(res);
        console.log(flag);

    });
}


function addClickEvent(res, type){

    $('.list tr').click(function(){

        var index = $(this).index() - 1;
        var data = res[index];

        console.log(data);

        genarateModal(data);


    });
}

function genarateModal(data){

    var grade = data.grade;
    var section = data.section;
    var content = data.content;
    var index = data.index;
    var grade_idx = null;
    var sendData = {};

    $("#modal_grade_Button").html(grade).val(grade);
    $("#modal_section").val(section);
    $("#modal_content").val(content);

    $('#modal_grade_dropdown li a').click(function(){
        $('#modal_grade_Button').html($(this).html());
        grade_idx = $(this).parent().index();
        grade = gradeList[grade_idx];
    });

    $("#modify").click(function(){

        sendData.index = index;
        sendData.grade = grade;
        sendData.type = type;
        sendData.section = $("#modal_section").val();
        sendData.content = $("#modal_content").val();

        $.post("/duty/modifyCheckList", sendData, function(res){
            $(".modal").modal('hide');

            if(res == "success"){
                toastr['success']('CheckList 수정 성공');
                loadBadCheckList();
                loadNormalCheckList();
            }
            else{
                toastr['error']('CheckList 수정 실패');
            }


        });
        $("#modify").unbind("click");
    });


    $("#delete").click(function(){

        sendData.index = index;
        sendData.type = type;

        $.post("/duty/deleteCheckList", sendData, function(res){
            $(".modal").modal('hide');

            if(res == "success"){
                toastr['success']('CheckList 삭제 성공');
                loadBadCheckList();
                loadNormalCheckList();
            }
            else{
                toastr['error']('CheckList 삭제 실패');
            }
        });

        $("#delete").unbind("click");
    });

    $("#cancel").click(function(){

        $(".modal").modal('hide');
        $("#modify").unbind("click");
        $("#delete").unbind("click");
    });

    $(".modal").modal();

}


function genarateHtml(res, type){

    var data;
    var content;
    var section;
    var grade;
    var index;
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

        if(type == "normal")
        {
            htmlString+="<tr id = " + index +">";
        }
        else{
            htmlString+="<tr id = " + index +">";
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

    if(type == "normal")
    {
        $("#checkList").html(htmlString);
    }
    else{
        $("#badcheckList").html(htmlString);
    }
}