/**
 * Created by HyunJae on 2015. 12. 23..
 */



var date = new Date();

var dateHtml = date.getFullYear() + "년 " + (date.getMonth()+1)  + "월 " + date.getDate() +"일";

$("#date").html(dateHtml);

$.post('/duty/getMemberList', function(res){

    generateMemberTable(res);
});

$("#send").click(function(){


    var currentDate = new Date();

    var sendData = {
        year : currentDate.getFullYear(),
        month : currentDate.getMonth()+1,
        date : currentDate.getDate(),
        recieveUserList : ["1111","2222"],
        point : 2,
        mode : 1,
        reason : "dd"
    };
    //data.currentDate = new Date();
    //data.recieveUserList = ["1111","2222"];
    //data.point = 2;
    //data.mode = 1;
    //data.reason = "한번 줘봤어 세캬"


    $.post('/duty/addPoint' , sendData , function(res){
        var result = res;
        $("#result").html(result);
    });

});


$('#memberList tr').click(function(){
    $(this).toggleClass('warning');
});


function generateMemberTable(res){

    var periods = [];
    var period;
    var row;
    var flag=1;
    for(var i=0;i<res.length;i++){
        row = res[i];
        period = row.u_period;

        flag = 1;
        for(var j=0; j<periods.length;j++){
            if(periods[j] == period){
                flag = 0;
            }
        }
        if(flag == 1){
            periods.push(period);
        }

    }
    periods.sort();
    periods.reverse();
   // $("#tmp").html(periods);


    var htmlString ="";
    var len = periods.length;

    if(len ==0){

    }
    else{
        for(var i=0;i< len;i++){

            period = periods[i];
            htmlString += "<tr>";
            htmlString += "<th class ='period'>";
            htmlString += period +"기";
            htmlString += "</th>";
            htmlString += "</tr>";

            var count =0;
            var member;
            for(var j=0;j<res.length;j++){

                member = res[j];

                if(period == member.u_period){
                    if(count%5 ==0){
                        htmlString += "<tr>";
                    }
                    htmlString += "<td class ='member'>";

                    htmlString += member.u_name;

                    htmlString += "</td>";

                    count++;
                    if(count%5 ==0){
                        htmlString += "</tr>";
                    }
                }
            }

        }
    }


    $("#memberList").html(htmlString);

}
