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
            if(data.h_remaining === 0){
                htmlString += '<tr class="danger"><td>';
                htmlString += '<h6 class="hardwareTitle">' + data.h_name;
                htmlString += '<span class="label label-danger pull-right">' + '0개남음' + '</span></h6></td></tr>'
            }else{
                htmlString += '<tr><td>';
                htmlString += '<h6 class="hardwareTitle">' + data.h_name;
                htmlString += '<span class="label label-success pull-right">' + data.h_remaining + '개남음' + '</span></h6></td></tr>'
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
            if(data.h_remaining === 0){
                htmlString += '<tr class="danger"><td>';
                htmlString += '<h6 class="hardwareTitle">' + data.h_name;
                htmlString += '<span class="label label-danger pull-right">' + '0개남음' + '</span></h6></td></tr>'
            }else{
                htmlString += '<tr><td>';
                htmlString += '<h6 class="hardwareTitle">' + data.h_name + ' ';
                htmlString += '<span class="label label-success pull-right">' + data.h_remaining + '개남음' + '</span></h6></td></tr>'
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
        if(datalist[index].h_remaining === 0){
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
        string += '<h4 class="bookTitle">' + datalist[index].h_name + '</h4>';
        string += '<p>' + '총 수량 : ' + datalist[index].h_total + '</p><p>남은수량 : ' + datalist[index].h_remaining + '</p>';
        $.post('/hardware/lender', {hardware_id: datalist[index].h_id}, function(response){
            if(response.length > 0){
                string += '<table class="table table-striped">';
                string += '<tr class="warning"><th>대여자</th><th>대여일</th><th>반납일</th></tr>';
                string += '<tbody>';
                for(var i = 0; i < response.length; i++){
                    string += '<tr><td>' + response[i].u_name + '</td><td>' + response[i].hr_rental_date + '</td><td>' + response[i].hr_due_date + '</td></tr>';
                }
                string += '</tbody>';
            }
            $('div.modal-body').html(string);
            $('button#request').unbind().click(function(){
                if(datalist[index].h_remaining != 0){         // 신청하는 부분
                    $.post("/hardware/borrow", {hardware_id: datalist[index].h_id}, function (data) {
                    });
                    $('div.modal').modal('hide');
                    window.location.reload();
                }
            });
            $('div.modal').modal();
        });
    });
}