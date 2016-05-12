/**
 * Created by HyunJae on 2016. 5. 12..
 */
//
var date = new Date();

var dir = '/../images/qrcode/' + date.getFullYear() + '-' + (date.getMonth()+1) +"/";

$.post('/book/manage/makeQRcodePage' , function(response){
    // type , month , date ,year
    console.log(response);

    if(response=="fail"){

    }else if(response == "empty"){

    }else{
        var data = response;
        maketable(data,dir);
        console.log("Success");

    }

});

function maketable(data,dir){
    var htmlString ='';
    var count = data.length;
    if(count === 0){
        htmlString += "요번달 새로운 책이 존재하지 않습니다.";
        console.log("요번달 새로운 책이 존재하지 않습니다.");
    }else{

        var page = parseInt((count / 18) + 1);
        console.log(page);
        for(var j = 0; j < page ;j++){

            htmlString+="<table class = 'a4'>";

            for(var i =0;i<18;i++){
                if(i%3===0){
                    htmlString+="<tr class = 'template'>";
                }
                htmlString+="<td class = 'template'>";

                htmlString+="<div>";
                htmlString+="<table>";
                htmlString += "<tr>";
                htmlString +="<td class = 'bookTitle'>";
                if(i + (j*18) < count){
                    htmlString += data[i + (j*18)].title;
                }
                htmlString +="</td>";
                htmlString +="<td>";
                if(i + (j*18) < count){
                    htmlString +="<img src='" + dir+ data[i + (j*18)].ISBN +".png' class = 'image' >";
                }
                htmlString +="</td>";
                htmlString += "</tr>";

                htmlString+="</table>";

                htmlString+="</div>";

                htmlString+="</td>";

                if(i%3===2){
                    htmlString+="</tr>";
                }
            }
            htmlString+="</table>";
        }
    }

    $('#qr').html(htmlString);
}
