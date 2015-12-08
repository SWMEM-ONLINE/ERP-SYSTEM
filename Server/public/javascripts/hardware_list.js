/**
 * Created by jung-inchul on 2015. 12. 7..
 */
$('ul.nav-pills li').click(function(){
    var index = $(this).index();
    $('ul.nav-pills li').removeClass('active');
    $(this).addClass('active');
    if(index === 0) {
        $('table#normalHardware').removeClass('hidden');
        $('table#specialHardware').addClass('hidden');
        loadNormalHardware();
    }else {
        $('table#normalHardware').addClass('hidden');
        $('table#specialHardware').removeClass('hidden');
        loadSpecialHardware();
    }
});

loadNormalHardware();

function loadNormalHardware(){
    $.post('/hardware/normal', function(datalist){
        var htmlString = '<tbody>';
        $.each(datalist, function(idx, data){
            if(data.remaining === 0){
                htmlString += '<tr class="danger"><td>';
                htmlString += '<h5 class="hardwareTitle">' + data.name;
                if(data.now === 'InChul')   htmlString += '&nbsp&nbsp<span class="label label-default">내가 대여중</span>'
                htmlString += '<span class="label label-danger pull-right">' + '0개남음' + '</span></h4></td></tr>'
                // 모달창에서 버튼을 disabled 시키는 제이쿼리문 추가
            }else{
                htmlString += '<tr><td>';
                htmlString += '<h5 class="hardwareTitle">' + data.name;
                if(data.now === 'InChul')   htmlString += '&nbsp&nbsp<span class="label label-default">내가 대여중</span>'
                htmlString += '<span class="label label-success pull-right">' + data.remaining + '개남음' + '</span></h4></td></tr>'
            }
        });
        htmlString += '</tbody>';
        $('#normalHardware').html(htmlString);
        $('.modal-header').text('일반 하드웨어 대여');
        clickEvent(datalist);
    });
}

function loadSpecialHardware(){
    $.post('/hardware/special', function(datalist){
        var htmlString = '<tbody>';
        $.each(datalist, function(idx, data){
            if(data.remaining === 0){
                htmlString += '<tr class="danger"><td>';
                htmlString += '<h5 class="hardwareTitle">' + data.name;
                if(data.now === 'InChul')   htmlString += '&nbsp&nbsp<span class="label label-default">내가 대여중</span>'
                htmlString += '<span class="label label-danger pull-right">' + '0개남음' + '</span></h4></td></tr>'
                // 모달창에서 버튼을 disabled 시키는 제이쿼리문 추가
            }else{
                htmlString += '<tr><td>';
                htmlString += '<h5 class="hardwareTitle">' + data.name + ' ';
                if(data.now === 'InChul')   htmlString += '&nbsp&nbsp<span class="label label-default">내가 대여중</span>'
                htmlString += '<span class="label label-success pull-right">' + data.remaining + '개남음' + '</span></h4></td></tr>'
            }
        });
        htmlString += '</tbody>';
        $('#specialHardware').html(htmlString);
        $('.modal-header').text('운영실 하드웨어 대여');
        clickEvent(datalist);
    });
}

function clickEvent(datalist){
    $('tr').click(function() {
        var index = $(this).index();
        var string = '';
        if(datalist[index].remaining === 0){
            $('#request').addClass('disabled');
            $('#request').removeClass('btn-primary');
            $('#request').addClass('btn-danger');
            $('#request').text('대여불가');
        }else{
            $('#request').removeClass('disabled');
            $('#request').removeClass('btn-danger');
            $('#request').addClass('btn-primary');
            $('#request').text('대여신청');
        }
        string += '<h4 class="bookTitle">' + datalist[index].name + '</h4>';
        string += '<p>' + '총 수량 : ' + datalist[index].amount + '</p><p>남은수량 : ' + datalist[index].remaining + '</p><p>대여자 : ' + datalist[index].now + '</p><p>';
        $('div.modal-body').html(string);
        $('button#request').unbind().click(function(){
            if(datalist[index].remaining != 0){         // 신청하는 부분
                $.post("/hardware/borrow", {id: datalist[index].id}, function (data) {
                    console.log(data);
                    window.location.reload();
                });
                $('div.modal').modal('hide');
            }
        });
        $('div.modal').modal();
    });
}