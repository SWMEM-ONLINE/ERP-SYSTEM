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

function loadBorrowedBooklist(){
    $.post('/book/mybook/borrowed', function(datalist){
        if(datalist.length === 0){
            $('div#myBorrowedBook').html('<br><br><h4 class="text-center">대여한 도서가 없습니다.</h4>');
            return;
        }
        var date = new Date();      // 이걸 조회하는 날의 날짜
        var htmlString = '<tbody>';
        $.each(datalist, function(idx, data){
            htmlString += '<tr>';
            htmlString += '<td><h4 class="bookTitle">' + data.br_book_name + '</h4><br>';
            htmlString += calReturnDate(date, data.br_due_date);
            htmlString += '</td><td width="5%">';
            htmlString += '<div class="btn-group-vertical">';
            htmlString += '<button id="turnIn" type="button" class="btn btn-primary btn-sm"> 도서반납 </button>';
            if(data.br_extension_cnt === 0 && data.br_reserved_cnt === 0)   htmlString += '<button id="postpone" type="button" class="btn btn-success btn-sm disabled"> 대여연장 </button>';
            else    htmlString += '<button id="postpone" type="button" class="btn btn-success btn-sm"> 대여연장 </button>';
            htmlString += '<button id="missing" type="button" class="btn btn-danger btn-sm"> 분실신고 </button></div>';
            htmlString += '</td></tr>';
        });
        htmlString += '</tbody>';
        $('#myBorrowedBook').html(htmlString);
        // 도서반납, 대여연장, 분실도서 등록 클릭펑션
    });
}

function loadReservedBooklist(){
    $.post('/book/mybook/reserved', function(datalist){
        if(datalist.length === 0){
            $('div#myReservedBook').html('<br><br><h4 class="text-center">예약한 도서가 없습니다.</h4>');
            return;
        }
        var htmlString = '<tbody>';
        $.each(datalist, function(idx, data){
            htmlString += '<tr>';
            htmlString += '<td><h4 class="bookTitle">' + data.bre_book_name + '</h4><div> 0번째 중 0번째 예약자입니다</div>';
            // 몇번째 중 몇번째 예약자인지 정확하게 찾아내서 해야할 것이다.
            htmlString += '</td><td width="5%">';
            htmlString += '<button id="turnIn" type="button" class="btn btn-warning btn-sm"> 예약취소 </button>';
            htmlString += '</td></tr>';
        });
        htmlString += '</tbody>';
        $('#myReservedBook').html(htmlString);
    });
}

function loadAppliedBooklist(){
    $.post('/book/mybook/applied', function(datalist){
        if(datalist.length === 0){
            $('div#myAppliedBook').html('<br><br><h4 class="text-center">신청한 도서가 없습니다.</h4>');
            return;
        }
        var htmlString = '<tbody>';
        $.each(datalist, function(idx, data){
            htmlString += '<tr>';
            htmlString += '<td><h4 class="bookTitle">' + data.ba_name + '</h4><div>저자 : ' + data.ba_author + '&nbsp&nbsp&nbsp | &nbsp&nbsp&nbsp출판사 : ' + data.ba_publisher;
            htmlString += '</td><td width="5%">';
            htmlString += '<button id="turnIn" type="button" class="btn btn-info btn-sm"> 신청취소 </button></div>';
            htmlString += '</td></tr>';
        });
        htmlString += '</tbody>';
        $('#myAppliedBook').html(htmlString);
        // 도서신청 취소 펑션
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
        string += '</div>';
        string += '</div>';
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