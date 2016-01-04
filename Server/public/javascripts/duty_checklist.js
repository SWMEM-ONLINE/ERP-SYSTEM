/**
 * Created by HyunJae on 2016. 1. 4..
 */

$.post('/duty/inquireCheckList', { type : "normal"} , function(res){

    var type = "normal";

    genarateHtml(res,type);

    console.log(res);

});

$("#pushButton").click(function(){



});



var flag= 0;
$("#toggleButton").click(function(){

    // 일반당직
    if(flag ==0){
        $(this).html("일반당직 체크리스트");
        $("#checkList").addClass("hidden");
        $("#badcheckList").removeClass("hidden");
        $.post('/duty/inquireCheckList', { type : "bad"} , function(res){

            flag=1;
            var type = "bad";

            genarateHtml(res,type);

            console.log(res);
            console.log(flag);

        });

    }
    // 벌당직
    else{
        $(this).html("벌당직 체크리스트");
        $("#badcheckList").addClass("hidden");
        $("#checkList").removeClass("hidden");
        $.post('/duty/inquireCheckList', { type : "normal"} , function(res){
            flag=0;

            var type = "normal";

            genarateHtml(res,type);

            console.log(res);
            console.log(flag);

        });
    }


});


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

        htmlString+="<tr id = " + index +">";
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

    if(type == "normal"){
        $("#checkList").html(htmlString);
    }else{
        $("#badcheckList").html(htmlString);
    }
}