/**
 * Created by jung-inchul on 2016. 1. 1..
 */


loadmyHardware();
loadmyBook();
loadMyDuty();
loadTodayDuty();

// 오늘의 당직자 부르고 - 현재파트

function loadTodayDuty(){
    $.post('/duty/loadTodayDuty' , function(response){
        // type , month , date ,year
        var htmlString = '';
        var data = response;

        if(data.name1!= null){
            htmlString += '<p><label style="text-overflow: ellipsis;">'
                + data.name1 +
            '</label>';
        }
        if(data.name2!= null){
            htmlString += '<p><label style="text-overflow: ellipsis;">'
                + data.name2 +
                '</label>';
        }
        if(data.name3!= null){
            htmlString += '<p><label style="text-overflow: ellipsis;">'
                + data.name3 +
                '</label>';
        }
        if(data.name4!= null){
            htmlString += '<p><label style="text-overflow: ellipsis;">'
                + data.name4 +
                '</label>';
        }

        $('.content-today_duty').html(htmlString);


    });
}


// 나의 마일리지 부르고 - 보류

// 나의 당직일 부르고 - 현재파트

function loadMyDuty(){

    var currentDate = new Date();
    var year = currentDate.getFullYear();
    var month = currentDate.getMonth()+1;
    var date = currentDate.getDate();


    $.post('/duty/loadMyDuty',{month : month , year : year} , function(response){
        // type , month , date ,year
        var htmlString = '';
        var type = "";
        $.each(response, function(idx, data){


            var diff =  date - data.date;

            if(data.type == 0){
                type = "일반당직";
            }else if(data.type == 1){
                type = "벌당직";
            }

            htmlString += '<p><label style="text-overflow: ellipsis;">'
                + data.month + '월 ' + data.date + '일 ' + type
                '</label>';


            if(diff <= -7){
                htmlString += '  <span class="label label-default">D' + diff + '</span>';
            }else if(diff < 0){
                htmlString += '  <span class="label label-warning">D' + diff + '</span>';
            }else{
                htmlString += '  <span class="label label-danger">D+' + diff + '</span>';
            }
        });

        $('.content-my_duty').html(htmlString);


    });
}


// 나의 하드웨어 대여 현황 부르고 - 인철파트
function loadmyHardware(){
    $.post('/main/loadmyHardware', function(datalist){
        var myhardwareHTML = settingHTML(datalist);;
        $('.content-myhardware').html(myhardwareHTML);
    });
}

// 도서 대여 현황 부르고 - 인철파트
function loadmyBook(){
    $.post('/main/loadmyBook', function(datalist){
        var mybookHTML = settingHTML(datalist);
        $('.content-mybook').html(mybookHTML);
    });
}

function settingHTML(datalist){
    var htmlString = '';
    $.each(datalist, function(idx, data){
        htmlString += '<p><label>' + data.name + '</label>';
        var diff = parseInt(data.diff);

        if(diff <= -7){
            htmlString += '  <span class="badge">D' + data.diff + '</span>';
        }else if(diff < 0){
            htmlString += '  <span class="badge">D' + data.diff + '</span>';
        }else{
            htmlString += '  <span class="badge">D+' + data.diff + '</span>';
        }
        htmlString += '</p>';
    });
    return htmlString;
}