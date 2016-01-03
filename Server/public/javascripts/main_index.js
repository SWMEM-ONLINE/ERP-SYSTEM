/**
 * Created by jung-inchul on 2016. 1. 1..
 */


loadmyHardware();
loadmyBook();



// 오늘의 당직자 부르고 - 현재파트

// 나의 마일리지 부르고 - 보류

// 나의 당직일 부르고 - 현재파트

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
        htmlString += '<p><label style="text-overflow: ellipsis;">' + data.name + '</label>';
        var diff = parseInt(data.diff);

        if(diff <= -7){
            htmlString += '  <span class="label label-default">D' + data.diff + '</span>';
        }else if(diff < 0){
            htmlString += '  <span class="label label-warning">D' + data.diff + '</span>';
        }else{
            htmlString += '  <span class="label label-danger">D+' + data.diff + '</span>';
        }
    });
    return htmlString;
}