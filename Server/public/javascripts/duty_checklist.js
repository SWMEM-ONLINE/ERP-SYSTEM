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
var flag= 0;

loadNormalCheckList();

$("#toggleButton").click(function(){

    // 벌당직 소환
    if(flag ==0){
        flag=1;
        $(this).html("일반당직 체크리스트");
        loadBadCheckList();

    }
    // 일반당직 소환
    else{
        flag=0;
        $(this).html("벌당직 체크리스트");
        loadNormalCheckList();
    }


});

function loadBadCheckList(){

    $("#checkList").addClass("hidden");
    $("#badcheckList").removeClass("hidden");

    $.post('/duty/inquireBadCheckList', { day : getDay() } , function(res){

        badGenarateHtml(res);
        addClickEvent(res);
        console.log(res);
        console.log(flag);

    });
}

function loadNormalCheckList(){
    $("#badcheckList").addClass("hidden");
    $("#checkList").removeClass("hidden");


    $.post('/duty/getRecentGrade',function(res){


        if(res == "error"){
            toastr['error']('전달 생활등급 로딩 실패');
        }
        else {
            var grade = res;
            $.post('/duty/inquireCheckList',{grade :grade} , function(res){

                normalGenarateHtml(res);
                addClickEvent(res);
                console.log(res);
                console.log(flag);

            });

        }
    });



}




function addClickEvent(res){

    $('tbody tr').click(function(){

        $(this).toggleClass("warning");
    });

    $('tfoot tr').click(function(){

        $(this).toggleClass("warning");
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
    htmlString+="<thead>";
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
    htmlString+="</thead>";

    htmlString+="<tbody>";
    for(var i = 0 ; i< res.length; i++){

        data = res[i];
        content = data.content;
        section = data.section;
        grade = data.grade;
        index = data.index;

        if(section != "탕비실" && section != "라커룸" && section != "샤워실" && section != "수면실")
            continue;

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
    htmlString+="</tbody>";


    htmlString+="<tfoot>";
    for(var i = 0 ; i< res.length; i++){

        data = res[i];
        content = data.content;
        section = data.section;
        grade = data.grade;
        index = data.index;

        if(section == "탕비실" || section == "라커룸" || section == "샤워실" || section == "수면실")
            continue;

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
    htmlString+="</tfoot>";



    $("#checkList").html(htmlString);
}
function badGenarateHtml(res){

    var data;
    var content;
    var section;
    var day = getDay();
    var index;
    var htmlString = "";
    htmlString+="<thead>";
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
    htmlString+="</thead>";


    htmlString+="<tbody>";
    for(var i = 0 ; i< res.length; i++){

        data = res[i];
        content = data.content;
        section = data.section;
        index = data.index;

        if(i==0){
            htmlString+="<tr id = normal" + index +" class='solidtd'>";
        }else{
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

    htmlString+="</tbody>";

    $("#badcheckList").html(htmlString);
}


function getDay(){

    var days = ["일","월","화","수","목","금","토"];
    var day  = new Date().getDay();

    return days[day];

}
