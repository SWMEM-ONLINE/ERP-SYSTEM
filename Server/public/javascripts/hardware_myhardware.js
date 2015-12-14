/**
 * Created by jung-inchul on 2015. 12. 7..
 */
$('ul.nav-pills li').click(function(){          // Divide Normal or Special Hardware
    var index = $(this).index();
    $('ul.nav-pills li').removeClass('active');
    $(this).addClass('active');
    if(index === 0) {                           // Choose Normal Hardware
        $('table#myNormalHardware').removeClass('hidden');
        $('table#mySpecialHardware').addClass('hidden');
        loadMynormalHardware();
    }else {                                     // Choose Special Hardware
        $('table#myNormalHardware').addClass('hidden');
        $('table#mySpecialHardware').removeClass('hidden');
        loadMyspecialHardware();
    }
});

loadMynormalHardware();

var temp = 0;           // Using for divide normal and special hardware index
var today = new Date();     // Using to express progress bar
today.setHours(9);

/*
    Load Normal Hardware list that user borrowed from database named 'datalist'
    Make html string named 'htmlString' to show with table and waiting click event.
    2 buttons are in this function named 'turnIn', 'postpone'
 */
function loadMynormalHardware(){
    $.post('/hardware/myhardware/normal', function(datalist){
        if(datalist.length === 0){              // If user doesn't borrow anyone.
            $('div#myNormalHardware').html('<tbody><th><tr><td><h4 class="text-center">예약한 일반 하드웨어가 없습니다.</h4></td></tr></th></tbody>');
            return;
        }
        var htmlString = settingHTML(datalist, 0);
        $('#myNormalHardware').html(htmlString);
        turnInButton(datalist, 0);
        postponeButton(datalist, 0);
    });
}

/*
    Load Special Hardware list that user borrowed from database named 'datalist'
    Make html string named 'htmlString' to show with table and waiting click event.
    2 buttons are in this function named 'turnIn', 'postpone'
 */
function loadMyspecialHardware(){
    $.post('/hardware/myhardware/special', function(datalist){
        if(datalist.length === 0){
            $('div#mySpecialHardware').html('<tbody><th><tr><td><h4 class="text-center">예약한 일반 하드웨어가 없습니다.</h4></td></tr></th></tbody>');
            return;
        }
        var htmlString = settingHTML(datalist, 1);
        $('#mySpecialHardware').html(htmlString);
        turnInButton(datalist, 1);
        postponeButton(datalist, 1);
    });
}

function settingHTML(datalist, flag){
    var htmlString = '<tbody>';
    $.each(datalist, function(idx, data){
        htmlString += '<tr><td>';
        htmlString += '<h5 class="hardwareTitle">' + data.h_name + '</h5><p><span class="label label-info">반납일 : ' + data.hr_due_date + '</span>&nbsp&nbsp<span class="label label-warning">연장횟수 : ' + data.hr_extension_cnt + '</span>';
        htmlString += makeProgressbar(today, data.hr_rental_date, data.hr_due_date);
        htmlString += '</td><td width="5%"><div class="btn-group-vertical">';
        htmlString += '<button id="turnIn" type="button" class="btn btn-primary btn-sm"> 기기반납 </button>';
        htmlString += '<button id="postpone" type="button" class="btn btn-success btn-sm"> 대여연장 </button>';
        htmlString += '</td></tr>';
        if(flag === 0) temp++;
    });
    htmlString += '</tbody>';
    return htmlString;
}

function turnInButton(datalist, flag){
    $('button#turnIn').each(function(index){            // Turnin button & function
        if(flag === 1)  index = index - temp;
        $(this).unbind().click(function(event){
            $.post("/hardware/myhardware/turnIn", {rental_id: datalist[index].hr_id, hardware_id: datalist[index].hr_hardware_id, rental_date: datalist[index].hr_rental_date, due_date: datalist[index].hr_due_date}, function (data) {
                console.log(data);              // 대여에 성공했다는 토스트라도 띄워줄까.
            });
            window.location.reload();
        });
    });
}

function postponeButton(datalist, flag){
    $('button#postpone').each(function(index){          // Postpone button & function
        if(flag === 1)  index = index - temp;
        $(this).unbind().click(function(){
            $.post("/hardware/myhardware/postpone", {rental_id: datalist[index].hr_id, due_date: datalist[index].hr_due_date}, function (data) {
                console.log(data);
            });
            window.location.reload();
        });
    });
}

/*
    Make progressbar function use t1 : today, t2 : rental day, t3 : due date
    3600000 * 24 means 1 Day.
*/
function makeProgressbar(t1, t2, t3){
    var string = '';
    var text = '';
    var now = new Date(t1);             // today
    var borrow_date = new Date(t2);     // borrow_date
    var due_date = new Date(t3);        // due_date
    if(due_date.getTime() <= now.getTime()){        // #1.
        var gap = parseInt(now.getTime() - due_date.getTime()) / (3600000 * 24);    // calculate difference from today to due_date
        if(gap == 0) text = '대여 기한이 오늘까지입니다.';
        else text = gap + '일 지났습니다.';
        string += '<div class="progress progress-striped active">';
        string += '<div class="progress-bar progress-bar-danger" role="progressbar" style="width: 100%">' + text;
        string += '</div>';
        string += '</div>';
    }
    else{
        var numerator = parseInt((due_date.getTime() - now.getTime()) / (3600000 * 24));
        var denominator = parseInt((due_date.getTime()-borrow_date.getTime()) / ( 3600000 * 24 ));
        var percent = (100 - (numerator / denominator * 100));
        text = numerator + '일 남았습니다.';
        string += '<div class="progress progress-striped active">';
        string += '<div class="progress-bar ' + (numerator > 7 ? 'progress-bar' : 'progress-bar-danger' ) + '" role="progressbar" style="width:' + percent + '%">' + text;
        string += '</div>';
    }
    return string;
}