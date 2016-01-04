/**
 * Created by HyunJae on 2016. 1. 4..
 */

var flag= 0;


$.post('/duty/inquireCheckList', { type : "normal"} , function(res){

    var type = "normal";
    genarateHtml(res,type);
    addClickEvent(res, type);
    console.log(res);

});


$("#toggleButton").click(function(){

    // 일반당직
    if(flag ==0){
        flag=1;
        loadNormalCheckList();

    }
    // 벌당직
    else{
        flag=0;
        loadBadCheckList();
    }


});

function loadNormalCheckList(){
    $(this).html("일반당직 체크리스트");
    $("#checkList").addClass("hidden");
    $("#badcheckList").removeClass("hidden");
    $.post('/duty/inquireCheckList', { type : "bad"} , function(res){

        var type = "bad";

        genarateHtml(res,type);
        addClickEvent(res,type);

        console.log(res);
        console.log(flag);

    });
}

function loadBadCheckList(){
    $(this).html("벌당직 체크리스트");
    $("#badcheckList").addClass("hidden");
    $("#checkList").removeClass("hidden");
    $.post('/duty/inquireCheckList', { type : "normal"} , function(res){


        var type = "normal";

        genarateHtml(res,type);
        addClickEvent(res,type);
        console.log(res);
        console.log(flag);

    });
}




function addClickEvent(res, type){

    $('table tr').click(function(){

        $(this).toggleClass("warning");
    });

    //var data;
    //var id;
    //for(var i = 0 ; i< res.length; i++){
    //
    //    data = res[i];
    //
    //    if(type == "normal")
    //    {
    //        id = "normal" + data.index;
    //    }
    //    else{
    //
    //        id = "bad" + data.index;
    //    }
    //
    //    $(document).on('click', "#"+id, function(){
    //
    //        $(this).toggleClass("warning");
    //
    //    });
    //}

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
            htmlString+="<tr id = normal" + index +">";
        }
        else{
            htmlString+="<tr id = bad" + index +">";
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