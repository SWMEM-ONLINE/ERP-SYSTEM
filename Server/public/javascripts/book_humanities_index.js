/*
 * Created by jung-inchul on 2015. 11. 30..
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

var flag_category = 0;                                                  // This variable means index of category which user selected
var category = ['b_name', 'b_author', 'b_publisher'];                   // Dropdown contents

$('#categoryDropdown li a').click(function(){
    $('#seriesDropdown').on("hide.bs.dropdown");
    $('#bookSearchCategory').html($(this).html());
    flag_category = $(this).parent().index();
});

$.post('/book/loadNewHumanitiesbook', function(data){                   // Load new Humanities booklist
    settingHTML(data);
    clickEvent(data);
});

$('#bookSearchWords').keydown(function(){
    if(event.keyCode == 13){                                            // 'keycode==13' means Enter
        event.preventDefault();
        $('#bookSearchBtn').trigger('click');                           // Force to event to click if user push Enter
        return false;
    }
});

$('#bookSearchBtn').click(function() {
    var searchWords = $('#bookSearchWords').val();                      // Get typing data in textbox
    if (searchWords.length == 0) {                                  // type nothing situation
        toastr['error']('검색어를 입력해주세요 ^^');
        return false;
    }else{
        $('#noti').remove();                                            // remove '이번달 들어온 인문도서 목록입니다' content
        $.post('/book/searchBook', {category : category[flag_category], searchWords : searchWords, flag : 'humanities'}, function(data){
            settingHTML(data);
            clickEvent(data);
        });
    }
});


function settingHTML(datalist){
    var htmlString = '<tbody>';
    $.each(datalist, function(idx, data){
        if(idx % 2 == 0){                                               // Seperate idx to even and odd
            htmlString += '<tr class="even">';
        }else{
            htmlString += '<tr>';
        }
        htmlString += '<td><img class="bookSmallImg" src="' + data.b_photo_url + '"></td>';
        htmlString += '<td><div class="bookInfo"><h4 class="bookTitle">' + data.b_name;
        if(data.b_state === 1)  htmlString += '&nbsp<span class="label label-primary">대여중</span>';
        else if(data.b_state === 3) htmlString += '&nbsp<span class="label label-danger">분실도서</span>';
        if(data.b_reserved_cnt > 0) htmlString += '&nbsp<span class="label label-warning">예약중</span>';
        htmlString += '</h4><p>' + ' 저자 : ' + data.b_author + '</p><p>' + " 출판사 : " + data.b_publisher + '</p></div></td>';
        htmlString += '</tr>';
    });
    htmlString += '</tbody>';
    $('#booklist').html(htmlString);
    $('.modal-title').text('도서 대여하기');
}

function clickEvent(datalist){
    $('tr').click(function() {
        var index = $(this).index();
        var string = '';
        string += '<img class="bookLargeImg" src="' + datalist[index].b_photo_url + '"/>';
        string += '<h4 class="bookTitle">' + datalist[index].b_name + '&nbsp<span class="label label-info">' + datalist[index].b_location + '</span></h4>';
        string += '<p>' + '저자 : ' + datalist[index].b_author + '</p><p>출판사 : ' + datalist[index].b_publisher + '</p>';
        if(datalist[index].b_state === 1)   string += '<p>반납예정일 : ' + datalist[index].b_due_date + '&nbsp&nbsp|&nbsp&nbsp대여자 : '+datalist[index].b_rental_username + '</p>';
        if(datalist[index].b_reserved_cnt != 0) string += '<p>예약자 : ' + datalist[index].b_reserved_cnt + '명</p>';
        if(datalist[index].b_state != 0){                               // Add disabled class to request button not in waiting state
            $('#request').addClass('disabled');
            $('#request').text('대여불가');
        }else{
            $('#request').removeClass('disabled');
            $('#request').text('대여');
        }
        $('div.modal-body').html(string);

        $('button#request').unbind().click(function(){                  // Request button to borrow book.
            if(datalist[index].b_state === 0){
                $.post("/book/borrowBook", {book_id : datalist[index].b_id}, function (data) {
                    if(data === 'failed')   toastr['error']('책 대여 실패');
                    else    toastr['info']('책 대여 성공');
                });
                $('div.modal').modal('hide');
                //window.location.reload();
            }
        });
        $('button#reserve').unbind().click(function(){                  // Reserve button to reserve book.
            $.post("/book/reserveBook", {book_id : datalist[index].b_id, reserve_cnt: datalist[index].b_reserved_cnt}, function (data) {
                $('div.modal').modal('hide');
                if(data === 'failed_2') {
                    toastr['error']('이미 대여했거나 예약중이시므로, 추가예약이 불가능합니다.');
                }else if(data === 'failed_1'){
                    toastr['error']('대여중인 책이 아니므로 예약이 불가능합니다');
                }else{
                    toastr['info']('책 예약 성공');
                }
            });
            //window.location.reload();
        });
        $('button#missing').unbind().click(function(){                  // Missing button to enroll missingbook list.
            $.post("/book/missingBook", {book_id : datalist[index].b_id}, function (data) {
                if(data === 'success')  toastr['info']('분실도서 등록 완료');
                else    toastr['error']('분실도서 등록 실패');
            });
            $('div.modal').modal('hide');
            //window.location.reload();
        });
        $('div.modal').modal();
    });
}