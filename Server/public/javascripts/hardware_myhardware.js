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

function loadMynormalHardware(){
    $.post('/hardware/myhardware/normal', function(datalist){
        if(datalist.length === 0){
            $('div#myNormalHardware').html('<br><br><h4 class="text-center">예약한 일반 하드웨어가 없습니다.</h4>');
            return;
        }
        var htmlString = '<tbody>';
        $.each(datalist, function(idx, data){
            htmlString += '<tr><td>';
            htmlString += '<h5 class="hardwareTitle">' + data.h_name + '</h5>';
            htmlString += calReturnDate();
            // 남은 대여일 계산해서 htmlString 안에 넣어주는 내용의 코드
            //htmlString += '</td><td width="20%">';
            htmlString += '<div class="btn-group pull-right">';
            htmlString += '<button id="turnIn" type="button" class="btn btn-primary btn-sm"> 기기반납 </button>';
            htmlString += '<button id="postpone" type="button" class="btn btn-success btn-sm"> 대여연장 </button>';
            htmlString += '</td></tr>';
            temp++;
        });
        htmlString += '</tbody>';
        $('#myNormalHardware').html(htmlString);

        $('button#turnIn').each(function(index){
            $(this).unbind().click(function(event){
                console.log('turnIn: '+datalist[index].name);
                $.post("/hardware/myhardware/turnIn", {id: datalist[index].id}, function (data) {
                    console.log(data);
                });
            });
        });
        $('button#postpone').each(function(index){
            $(this).unbind().click(function(){
                console.log('postpone: '+datalist[index].name);
                $.post("/hardware/myhardware/postpone", {id: datalist[index].id}, function (data) {
                    console.log(data);
                });
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
            htmlString += '<h5 class="hardwareTitle">' + data.name + '</h5>';
            htmlString += calReturnDate();
            // 남은 대여일 계산해서 htmlString 안에 넣어주는 내용의 코드
            //htmlString += '</td><td width="20%">';
            htmlString += '<div class="btn-group pull-right">';
            htmlString += '<button id="turnIn" type="button" class="btn btn-primary btn-sm"> 기기반납 </button>';
            htmlString += '<button id="postpone" type="button" class="btn btn-success btn-sm"> 대여연장 </button>';
            htmlString += '</td></tr>';
        });
        htmlString += '</tbody>';
        $('#mySpecialHardware').html(htmlString);

        $('button#turnIn').each(function(index){            // 이곳에서의 인덱스가.. 위에 normal 장치의 인덱스와 겹쳐져버리네?
            index = index-temp;
            $(this).unbind().click(function(event){
                console.log('turnIn: '+ datalist[index].name);
                $.post("/hardware/myhardware/turnIn", {id: datalist[index].id}, function (data) {
                    console.log(data);
                });
            });
        });
        $('button#postpone').each(function(index){
            index = index-temp;
            $(this).unbind().click(function(){
                console.log('postpone: '+ datalist[index].name);
                $.post("/hardware/my/postpone", {id: datalist[index].id}, function (data) {
                    console.log(data);
                });
            });
        });
    });
}

function calReturnDate(today, duedate){
    var string = '';
    var diffdate;
    //if(duedate.getTime() <= date.getTime()){
    //diffdate = parseInt((date.getTime() - duedate.getTime()) / (1000 * 3600 * 24));
    var warningtext = '임시';
    //if(diffdate == 0) warningtext = '대여 기한이 오늘까지입니다.';
    //else warningtext = '대여 기한이 ' + diffdate + '일 지났습니다.';
    string += '<div class="progress progress-striped active">';
    string += '<span class="progressbar-back-text"></span>';
    string += '<div class="progress-bar progress-bar-danger" role="progressbar" style="width: 100%">';
    string += '<span class="progressbar-front-text" style="width:' + $('div#rentBook').width() + 'px">' + warningtext + '</span>';
    string += '</div></div>';
    //}
    //else{
    //    diffdate = (duedate.getTime() - date.getTime()) / (1000 * 3600 * 24);
    //    string += '<div class="progress progress-striped active">';
    //    string += '<span class="progressbar-back-text"></span>';
    //    string += '<div class="progress-bar' + (diffdate < 4? ' progress-bar-warning' : ' progress-bar-success') + '" role="progressbar" aria-valuenow="8" aria-valuemin="0" aria-valuemax="14" style="width:' + parseInt((1 - diffdate / 14) * 100) + '%">';
    //    string += '<span class="progressbar-front-text" style="width:' + $('div#rentBook').width() + 'px">' + duedate.getFullYear() + '년 ' + (duedate.getMonth()+1) + '월 ' + duedate.getDate() + '일 까지 대여중입니다.</span>';
    //    string += '</div>';
    //    string += '</div>';
    //}
    return string;
}