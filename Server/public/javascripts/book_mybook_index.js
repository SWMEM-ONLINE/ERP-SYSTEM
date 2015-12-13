/**
 * Created by jung-inchul on 2015. 12. 4..
 */
$('ul.nav-pills li').click(function(){
    var index = $(this).index();
    $('ul.nav-pills li').removeClass('active');
    $(this).addClass('active');
    switch(index){
        case 0:
            $('table#myBorrowedBook').removeClass('hidden');
            $('table#myReservedBook').addClass('hidden');
            $('table#myAppliedBook').addClass('hidden');
            loadBorrowedBooklist();
            break;
        case 1:
            $('table#myBorrowedBook').addClass('hidden');
            $('table#myReservedBook').removeClass('hidden');
            $('table#myAppliedBook').addClass('hidden');
            loadReservedBooklist();
            break;
        default:
            $('table#myBorrowedBook').addClass('hidden');
            $('table#myReservedBook').addClass('hidden');
            $('table#myAppliedBook').removeClass('hidden');
            loadAppliedBooklist();
            break;
    }
});
loadBorrowedBooklist();
var today = getDate();
var overtime = 0;

function loadBorrowedBooklist(){
    overtime = 0;
    $.post('/book/mybook/borrowed', function(datalist){
        if(datalist.length === 0){
            $('div#myBorrowedBook').html('<tr><td><h4 class="text-center">대여한 도서가 없습니다.</h4></td></tr>');
            return;
        }
        var htmlString = '<tbody>';
        $.each(datalist, function(idx, data){
            htmlString += '<tr>';
            htmlString += '<td><h4 class="bookTitle">' + data.b_name + '</h4><p><span class="label label-info">반납일 : ' + data.b_due_date + '</span>&nbsp&nbsp<span class="label label-warning">연장횟수 : ' + data.br_extension_cnt + '</span>&nbsp&nbsp<span class="label label-primary">예약자 : ' + data.b_reserved_cnt + '명</span></p>';
            htmlString += makeProgressbar(today,data.br_rental_date, data.b_due_date);
            htmlString += '</td><td width="5%">';
            htmlString += '<div class="btn-group-vertical">';
            htmlString += '<button id="turnIn" type="button" class="btn btn-primary btn-sm"> 도서반납 </button>';
            if(data.br_extension_cnt === 0 && data.b_reserved_cnt === 0)   htmlString += '<button id="postpone" type="button" class="btn btn-success btn-sm"> 대여연장 </button>';
            else    htmlString += '<button id="postpone" type="button" class="btn btn-success btn-sm disabled"> 대여연장 </button>';
            htmlString += '<button id="missing" type="button" class="btn btn-danger btn-sm"> 분실신고 </button></div>';
            htmlString += '</td></tr>';
        });
        htmlString += '</tbody>';
        $('#myBorrowedBook').html(htmlString);
        $('button#turnIn').each(function(index){
            $(this).unbind().click(function(event){
                $.post('/book/mybook/turnIn', {rental_id: datalist[index].br_id, book_id: datalist[index].br_book_id, rental_date: datalist[index].br_rental_date, return_date: today, over: overtime, reserved_cnt: datalist[index].b_reserved_cnt}, function(data){
                    console.log(data);
                });
                window.location.reload();
            });
        });
        $('button#postpone').each(function(index){
            if(datalist[index].br_extension_cnt === 0 && datalist[index].b_reserved_cnt === 0) {
                $(this).unbind().click(function (event) {
                    var due_date = new Date(datalist[index].b_due_date);
                    due_date.setDate(due_date.getDate() + 14);
                    var changedDate = due_date.getFullYear()+ '-'+(due_date.getMonth()+1)+'-'+due_date.getDate();
                    console.log(changedDate);
                    $.post('/book/mybook/postpone', {rental_id: datalist[index].br_id, book_id: datalist[index].b_id, changed_due_date: changedDate}, function (data) {
                        console.log(data);
                    });
                    window.location.reload();
                });
            }
        });
        $('button#missing').each(function(index){
            $(this).unbind().click(function(event){
                $.post('/book/mybook/missing', {rental_id: datalist[index].br_id, book_id : datalist[index].b_id, loss_date: today}, function(data){
                    console.log(data);
                });
                window.location.reload();
            });
        });
    });
}

function loadReservedBooklist(){
    $.post('/book/mybook/reserved', function(datalist){
        if(datalist.length === 0){
            $('div#myReservedBook').html('<tr><td><h4 class="text-center">예약한 도서가 없습니다.</h4></td></tr>');
            return;
        }
        var htmlString = '<tbody>';
        $.each(datalist, function(idx, data){
            htmlString += '<tr>';
            htmlString += '<td><h4 class="bookTitle">' + data.b_name + '</h4><p>' + data.b_reserved_cnt + '명 중 ' + data.bre_myturn + '번째 예약중입니다.</p>';
            htmlString += '</td><td width="5%">';
            htmlString += '<button id="cancelReservation" type="button" class="btn btn-warning btn-sm"> 예약취소 </button>';
            htmlString += '</td></tr>';
        });
        htmlString += '</tbody>';
        $('#myReservedBook').html(htmlString);
        $('button#cancelReservation').each(function(index){
            $(this).unbind().click(function(event){
                $.post('/book/mybook/cancelReservation', {reserve_id: datalist[index].bre_id, book_id: datalist[index].b_id, reserved_cnt: datalist[index].b_reserved_cnt}, function(data){
                    console.log(data);
                });
                window.location.reload();
            });
        });
    });
}

function loadAppliedBooklist(){
    $.post('/book/mybook/applied', function(datalist){
        if(datalist.length === 0){
            $('div#myAppliedBook').html('<tr><td><h4 class="text-center">신청한 도서가 없습니다.</h4></td></tr>');
            return;
        }
        var htmlString = '<tbody>';
        $.each(datalist, function(idx, data){
            htmlString += '<tr>';
            htmlString += '<td><h4 class="bookTitle">' + data.ba_name + '</h4><div>저자 : ' + data.ba_author + '&nbsp&nbsp&nbsp | &nbsp&nbsp&nbsp출판사 : ' + data.ba_publisher;
            htmlString += '</td><td width="5%">';
            htmlString += '<button id="cancelAppliedbook" type="button" class="btn btn-info btn-sm"> 신청취소 </button></div>';
            htmlString += '</td></tr>';
        });
        htmlString += '</tbody>';
        $('#myAppliedBook').html(htmlString);
        $('button#cancelAppliedbook').each(function(index){
            $(this).unbind().click(function(event){
                $.post('/book/mybook/cancelAppliedbook', {apply_id: datalist[index].ba_id}, function(data){
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
        var gap = parseInt(now.getTime() - due_date.getTime()) / (3600000* 24);
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

function getDate(){
    var date = new Date();
    date.setHours(9);
    var result = date.getFullYear()+ '-'+(date.getMonth()+1)+'-'+date.getDate();
    return result;
}