/**
 * Created by jung-inchul on 2015. 12. 4..
 */

toastr.options = {
    "closeButton": false,
    "debug": false,
    "newestOnTop": false,
    "progressBar": false,
    "positionClass": "toast-top-right",
    "preventDuplicates": false,
    "onclick": null,
    "showDuration": "300",
    "hideDuration": "1000",
    "timeOut": "5000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
};

$('ul.nav-pills li').click(function(){
    var index = $(this).index();
    $('ul.nav-pills li').removeClass('active');
    $(this).addClass('active');
    switch(index){
        case 0:                                                             // case 0: show my book borrowed
            $('table#myBorrowedBook').removeClass('hidden');
            $('table#myReservedBook').addClass('hidden');
            $('table#myAppliedBook').addClass('hidden');
            loadBorrowedBooklist();
            break;
        case 1:                                                             // case 1: show my book reserved
            $('table#myBorrowedBook').addClass('hidden');
            $('table#myReservedBook').removeClass('hidden');
            $('table#myAppliedBook').addClass('hidden');
            loadReservedBooklist();
            break;
        default:                                                            // default: show my book applied
            $('table#myBorrowedBook').addClass('hidden');
            $('table#myReservedBook').addClass('hidden');
            $('table#myAppliedBook').removeClass('hidden');
            loadAppliedBooklist();
            break;
    }
});
loadBorrowedBooklist();

/*
    Load my book borrowed function.
 */
function loadBorrowedBooklist(){
    $.post('/book/mybook/borrowed', function(datalist){
        if(datalist.length === 0){
            $('#myBorrowedBook').html('<tr><th>대여한 도서가 없습니다.</th></tr>');
            return;
        }
        var htmlString = '<tbody>';
        $.each(datalist, function(idx, data){
            htmlString += '<tr>';
            htmlString += '<td><h4 class="bookTitle">' + data.b_name + '</h4><p><span class="label label-info">반납일 : ' + data.b_due_date + '</span></p><p><span class="label label-warning">연장횟수 : ' + data.br_extension_cnt + '</span></p><p><span class="label label-primary">예약자 : ' + data.b_reserved_cnt + '명</span></p>';
            htmlString += makeProgressbar(data.br_rental_date, data.b_due_date);
            htmlString += '</td><td width="5%">';
            htmlString += '<div>';
            htmlString += '<button id="turnIn" type="button" class="btn">도서반납</button>';
            if(data.br_extension_cnt === 0 && data.b_reserved_cnt === 0 && data.diff <= 0)   htmlString += '<button id="postpone" type="button" class="btn">대여연장</button>';
            else    htmlString += '<button id="postpone" type="button" class="btn disabled">대여연장</button>';
            htmlString += '<button id="missing" type="button" class="btn cancel">분실신고</button></div>';
            htmlString += '</td></tr>';
        });
        htmlString += '</tbody>';
        $('#myBorrowedBook').html(htmlString);
        $('button#turnIn').each(function(index){                            // turnIn button function.
            $(this).unbind().click(function(event){
                $.post('/book/mybook/turnIn', {reserved_cnt: datalist[index].b_reserved_cnt, rental_id: datalist[index].br_id, book_id: datalist[index].br_book_id, rental_date: datalist[index].br_rental_date, due_date: datalist[index].b_due_date}, function(response){
                    if(response==='success'){
                        toastr['success']('반납 성공');
                    }
                    else if(response === 'failed'){
                        toastr['error']('반납 실패');
                    }
                    else{
                        toastr['info']('반납성공\n벌당직' + response + '일 부여');
                    }
                });
                loadBorrowedBooklist();
            });
        });
        $('button#postpone').each(function(index){                          // postpone button function
            if(datalist[index].br_extension_cnt === 0 && datalist[index].b_reserved_cnt === 0 && datalist[index].diff <= 0) {
                $(this).unbind().click(function (event) {
                    $.post('/book/mybook/postpone', {rental_id: datalist[index].br_id, book_id: datalist[index].b_id}, function (response) {
                        if(response === 'success'){
                            toastr['success']('연장 성공');
                        }
                        else{
                            toastr['error']('연장 실패');
                        }
                    });
                    loadBorrowedBooklist();
                });
            }
        });
        $('button#missing').each(function(index){                           // missing button function
            $(this).unbind().click(function(event){
                $.post('/book/mybook/missing', {book_id : datalist[index].b_id}, function(response){
                    if(response === 'success'){
                        toastr['success']('분실신고 성공');
                    }
                    else{
                        toastr['error']('분실등록 실패');
                    }
                });
                loadBorrowedBooklist();
            });
        });
    });
}

/*
    Load my book reserved function.
*/
function loadReservedBooklist(){
    $.post('/book/mybook/reserved', function(datalist){
        if(datalist.length === 0){
            $('#myReservedBook').html('<tr><th>예약한 도서가 없습니다.</th></tr>');
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
        $('button#cancelReservation').each(function(index){                 // cancelReservation button function
            $(this).unbind().click(function(event){
                $.post('/book/mybook/cancelReservation', {reserve_id: datalist[index].bre_id, book_id: datalist[index].b_id, reserved_cnt: datalist[index].b_reserved_cnt}, function(response){
                    if(response === 'success'){
                        toastr['success']('예약취소 성공');
                    }
                    else{
                        toastr['error']('에약취소 실패');
                    }
                });
                loadReservedBooklist();
            });
        });
    });
}

/*
    Load my book applied function.
*/
function loadAppliedBooklist(){
    $.post('/book/mybook/applied', function(datalist){
        if(datalist.length === 0){
            $('#myAppliedBook').html('<tr><th>신청한 도서가 없습니다.</th></tr>');
            return;
        }
        var htmlString = '<tbody>';
        $.each(datalist, function(idx, data){
            htmlString += '<tr>';
            htmlString += '<td><h4 class="bookTitle">' + data.ba_name + '</h4><div><p><span class="label label-info"> 저자 : ' + data.ba_author + '</span></p><p><span class="label label-warning">출판사 : ' + data.ba_publisher + '</span></p>';
            htmlString += '</td><td width="5%">';
            htmlString += '<button id="cancelAppliedbook" type="button" class="btn cancel">신청취소</button></div>';
            htmlString += '</td></tr>';
        });
        htmlString += '</tbody>';
        $('#myAppliedBook').html(htmlString);
        $('button#cancelAppliedbook').each(function(index){
            $(this).unbind().click(function(event){
                $.post('/book/mybook/cancelAppliedbook', {apply_id: datalist[index].ba_id}, function(response){
                    if(response === 'success'){
                        toastr['success']('도서신청 취소 성공');
                    }
                    else{
                        toastr['error']('도서신청 취소 실패');
                    }
                });
                loadAppliedBooklist();
            });
        });
    });
}

function makeProgressbar(t2, t3){
    var string = '';
    var text = '';
    var today = new Date();

    var borrow_date = new Date(t2);
    var due_date = new Date(t3);
    today.setHours(9);
    borrow_date.setHours(9);
    due_date.setHours(9);
    if(due_date.getTime() <= today.getTime()){
        var gap = parseInt(today.getTime() - due_date.getTime()) / (3600000* 24) + 1;
        if(gap === 0) text = '대여 기한이 오늘까지입니다.';
        else text = gap + '일 지났습니다.';
        string += '<div class="progress progress-striped active">';
        string += '<div class="progress-bar progress-bar-danger" role="progressbar" style="width: 100%">' + text;
        string += '</div></div>';
    }
    else{
        var numerator = parseInt((due_date.getTime() - today.getTime()) / (3600000 * 24)) + 1;
        var denominator = parseInt((due_date.getTime()-borrow_date.getTime()) / ( 3600000 * 24 ));
        var percent = (100 - (numerator / denominator * 100));
        console.log(numerator);
        text = numerator + '일 남았습니다.';
        string += '<div class="progress progress-striped active">';
        string += '<div class="progress-bar ' + (numerator > 7 ? 'progress-bar' : 'progress-bar-danger' ) + '" role="progressbar" style="width:' + percent + '%">' + text;
        string += '</div></div>';
    }
    return string;
}