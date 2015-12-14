/**
 * Created by jung-inchul on 2015. 12. 7..
 */
$('ul.nav-pills li').click(function(){
    var index = $(this).index();
    $('ul.nav-pills li').removeClass('active');
    $(this).addClass('active');
    if(index === 0) {
        $('table#myNormalHardware').removeClass('hidden');
        $('table#mySpecialHardware').addClass('hidden');
        loadMynormalHardware();
    }else {
        $('table#myNormalHardware').addClass('hidden');
        $('table#mySpecialHardware').removeClass('hidden');
        loadMyspecialHardware();
    }
});

loadMynormalHardware();

var temp = 0;
var today = new Date();
today.setHours(9);
var overtime = 0;

function loadMynormalHardware(){
    $.post('/hardware/myhardware/normal', function(datalist){
        if(datalist.length === 0){
            $('div#myNormalHardware').html('<br><br><h4 class="text-center">예약한 일반 하드웨어가 없습니다.</h4>');
            return;
        }
        var htmlString = '<tbody>';
        $.each(datalist, function(idx, data){
            htmlString += '<tr><td>';
            htmlString += '<h5 class="hardwareTitle">' + data.h_name + '</h5><p><span class="label label-info">반납일 : ' + data.hr_due_date + '</span>&nbsp&nbsp<span class="label label-warning">연장횟수 : ' + data.hr_extension_cnt + '</span>';
            htmlString += makeProgressbar(today, data.hr_rental_date, data.hr_due_date);
            htmlString += '</td><td width="5%">';
            htmlString += '<div class="btn-group-vertical">';
            htmlString += '<button id="turnIn" type="button" class="btn btn-primary btn-sm"> 기기반납 </button>';
            htmlString += '<button id="postpone" type="button" class="btn btn-success btn-sm"> 대여연장 </button>';
            htmlString += '</td></tr>';
            temp++;
        });
        htmlString += '</tbody>';
        $('#myNormalHardware').html(htmlString);
        $('button#turnIn').each(function(index){
            $(this).unbind().click(function(event){
                $.post("/hardware/myhardware/turnIn", {rental_id: datalist[index].hr_id, hardware_id: datalist[index].hr_hardware_id, rental_date: datalist[index].hr_rental_date, due_date: datalist[index].hr_due_date}, function (data) {
                    console.log(data);
                });
                window.location.reload();
            });

        });
        $('button#postpone').each(function(index){
            $(this).unbind().click(function(){
                $.post("/hardware/myhardware/postpone", {rental_id: datalist[index].hr_id, due_date: datalist[index].hr_due_date}, function (data) {
                    console.log(data);
                });
                window.location.reload();
            });
        });

    });
}

function loadMyspecialHardware(){
    $.post('/hardware/myhardware/special', function(datalist){
        if(datalist.length === 0){
            $('div#mySpecialHardware').html('<br><br><h4 class="text-center">예약한 운영실 하드웨어가 없습니다.</h4>');
            return;
        }
        var htmlString = '<tbody>';
        $.each(datalist, function(idx, data){
            htmlString += '<tr><td>';
            htmlString += '<h5 class="hardwareTitle">' + data.h_name + '</h5><p><span class="label label-info">반납일 : ' + data.hr_due_date + '</span>&nbsp&nbsp<span class="label label-warning">연장횟수 : ' + data.hr_extension_cnt + '</span>';
            htmlString += makeProgressbar(today, data.hr_rental_date, data.hr_due_date);
            htmlString += '</td><td width="5%">';
            htmlString += '<div class="btn-group-vertical">';
            htmlString += '<button id="turnIn" type="button" class="btn btn-primary btn-sm"> 기기반납 </button>';
            htmlString += '<button id="postpone" type="button" class="btn btn-success btn-sm"> 대여연장 </button>';
            htmlString += '</td></tr>';
        });
        htmlString += '</tbody>';
        $('#mySpecialHardware').html(htmlString);
        $('button#turnIn').each(function(index){
            index = index-temp;
            $(this).unbind().click(function(event){
                $.post("/hardware/myhardware/turnIn", {rental_id: datalist[index].hr_id, hardware_id: datalist[index].hr_hardware_id, rental_date: datalist[index].hr_rental_date, due_date: datalist[index].hr_due_date}, function (data) {
                    console.log(data);
                });
                window.location.reload();
            });

        });
        $('button#postpone').each(function(index){
            index = index-temp;
            $(this).unbind().click(function(){
                $.post("/hardware/myhardware/postpone", {rental_id: datalist[index].hr_id, due_date: datalist[index].hr_due_date}, function (data) {
                    console.log(data);
                });
                window.location.reload();
            });
        });
    });
}

function makeProgressbar(t1, t2, t3){
    var string = '';
    var text = '';
    var now = new Date(t1);
    var borrow_date = new Date(t2);
    var due_date = new Date(t3);
    if(due_date.getTime() <= now.getTime()){
        var gap = parseInt(now.getTime() - due_date.getTime()) / (3600000 * 24);
        overtime = gap;
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