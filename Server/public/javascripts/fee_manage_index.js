/**
 * Created by KIMDONGWON on 2015-12-17.
 */
var selectTerm;
var selectFee;
var selectPaid;
var searchName;

toastr.options = {
    'closeButton': false,
    'debug': false,
    'newestOnTop': false,
    'progressBar': false,
    'positionClass': 'toast-top-right',
    'preventDuplicates': false,
    'onclick': null,
    'showDuration': '300',
    'hideDuration': '1000',
    'timeOut': '5000',
    'extendedTimeOut': '1000',
    'showEasing': 'swing',
    'hideEasing': 'linear',
    'showMethod': 'fadeIn',
    'hideMethod': 'fadeOut'
};

function selectCondition(string){
    var name = string.substr(0,4);
    var type = 'button#'+name;
    var drop = '#'+string;
    $(type).html($(drop).children('a').html());

    if(name == 'term'){
        if($(type).html() == '전체'){
            selectTerm = 4;
        }
        else if($(type).html() == '1개월'){
            selectTerm = 1;
        }
        else if($(type).html() == '2개월'){
            selectTerm = 2;
        }
        else if($(type).html() == '3개월'){
            selectTerm = 3;
        }
        else{
            selectTerm = null;
        }
    }
    else if(name == 'type'){
        if($(type).html() == '전체'){
            selectFee = 4;
        }
        else if($(type).html() == '회비'){
            selectFee = 1;
        }
        else if($(type).html() == '삼과비'){
            selectFee = 2;
        }
        else if($(type).html() == '기타'){
            selectFee = 3;
        }
        else{
            selectFee = null;
        }
    }
    else if(name == 'paid'){
        if($(type).html() == '전체'){
            selectPaid = 2;
        }
        else if($(type).html() == '미납'){
            selectPaid = 0;
        }
        else if($(type).html() == '납부'){
            selectPaid = 1;
        }
        else{
            selectPaid = null;
        }
    }
}

function reloadList(data){
    $.ajax({
        type:'post',
        url:'/fee/manage/search',
        data:data,
        contentType:'application/json',
        success: function(rows) {
            if (rows.status == 'fail') {
                toastr['error']('리스트 로딩 실패');
            }
            else {

                var tbodyString = '';
                $('#memberList tbody').empty();
                if (rows.length == 0) {
                    tbodyString += '<tr class="empty"><td colspan="4"><h4>내역이 없습니다</h4></td></tr>';
                }
                else {
                    for (var i = 0; i < rows.length; i++) {
                        var row = rows[i];
                        var type;
                        var state;
                        tbodyString += '<tr>';
                        tbodyString += '<td class="hidden">' + row.f_id + '</td>';
                        tbodyString += '<td>' + row.f_date + '</td>';
                        if (row.f_type == 1)
                            type = '회비';

                        else if (row.f_type == 2) {
                            type = '삼과비';
                        }
                        else if (row.f_type == 3) {
                            type = '기타';
                        }
                        tbodyString += '<td>' + type + '</td>';
                        tbodyString += '<td>' + row.u_name + '</td>';
                        if (row.f_state == 0) {
                            state = '미납';
                            tbodyString += '<td class="text-danger">' + state + '</td>';
                        }
                        else if (row.f_state == 1) {
                            state = '납부';
                            tbodyString += '<td>' + state + '</td>';
                        }

                        tbodyString += '<td class="hidden">' + row.u_id + '</td>';
                        tbodyString += '<td class="hidden">' + row.u_period + '</td>';
                        tbodyString += '<td class="hidden">' + row.f_content + '</td>';
                        tbodyString += '<td class="hidden">' + row.f_price + '</td>';
                        tbodyString += '<td class="hidden">' + row.f_write_date + '</td>';
                        tbodyString += '</tr>';
                    }
                }
                $('#memberList tbody').append(tbodyString);
            }
        }
    });
}

$('#search').unbind().click(function(){
    var arr = new Array();
    searchName = $('#searchName').val();
    arr.push(selectTerm);
    arr.push(selectFee);
    arr.push(selectPaid);
    arr.push(searchName);
    reloadList(JSON.stringify(arr));
});

$('#memberList tbody').on('click','tr:not(.empty)',function () {
    var period;
    var type;
    var paid;
    var name;
    var fid;
    var uid;
    var date;
    var content;
    var price;
    var modalHead = '';
    var modalBody = '';
    var arr = new Array();  //
    $(this).children('td').map(function () {
        arr.push($(this).text());
    });

    fid = arr[0];
    date = arr[1];
    type = arr[2];
    name = arr[3];
    paid = arr[4];
    uid = arr[5];
    period = arr[6];
    content = arr[7];
    price =arr[8];
    modalHead += name+'('+ period +')';
    modalBody += '<table class="table" id="'+fid+'">';
    modalBody += '<tr>';
    modalBody += '<th>날짜</th>';
    modalBody += '<td>'+ date +'</td>';
    modalBody += '</tr>';
    modalBody += '<tr>';
    modalBody += '<th>구분</th>';
    modalBody += '<td>'+ type +'</td>';
    modalBody += '</tr>';
    modalBody += '<tr>';
    modalBody += '<th>내용</th>';
    modalBody += '<td>'+ content +'</td>';
    modalBody += '</tr>';
    modalBody += '<tr>';
    modalBody += '<th>금액</th>';
    modalBody += '<td>'+ price +'</td>';
    modalBody += '</tr>';
    modalBody += '<tr>';
    modalBody += '<th>상태</th>';
    if(paid == '미납'){
        modalBody += '<td class="text-danger">'+ paid +'</td>';
    }
    else{
        modalBody += '<td>'+ paid +'</td>';
    }
    modalBody += '</tr>';
    if(paid == '미납'){
        $('#pay').removeClass('disabled');
    }
    else{
        $('#pay').addClass('disabled');
    }
    $('div.modal .modal-title').html(modalHead);
    $('div.modal .modal-body').html(modalBody);
    $('div.modal').modal();
});

$('#pay').unbind().click(function(){
    if(!$('#pay').hasClass('disabled')) {
        var payId = $('.modal-body table').attr('id');
        var data = {id: payId};
        $.ajax({
            type: 'post',
            data: JSON.stringify(data),
            url: '/fee/manage/paid',
            contentType: 'application/json',
            success: function (data) {
                if (data.status == '0') {
                    var arr = new Array();
                    searchName = $('#searchName').val();
                    arr.push(selectTerm);
                    arr.push(selectFee);
                    arr.push(selectPaid);
                    arr.push(searchName);
                    reloadList(JSON.stringify(arr));
                    $('div.modal').modal('hide');
                    toastr['success']('납부완료 성공');
                }
                else{
                    toastr['error']('납부완료 실패');
                }
            }
        });
    }
});

$('#delete').unbind().click(function(){
    var deleteId = $('.modal-body table').attr('id');
    var data = {id:deleteId};
    $.ajax({
        type: 'post',
        data:JSON.stringify(data),
        url: '/fee/manage/delete',
        contentType: 'application/json',
        success: function (data) {
            if(data.status == '0'){
                var arr = new Array();
                searchName = $('#searchName').val();
                arr.push(selectTerm);
                arr.push(selectFee);
                arr.push(selectPaid);
                arr.push(searchName);
                reloadList(JSON.stringify(arr));
                $('div.modal').modal('hide');
                toastr['success']('삭제 성공');
            }
            else{
                toastr['success']('삭제 실패');
            }
        }
    });
});