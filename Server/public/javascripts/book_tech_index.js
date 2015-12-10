/**
 * Created by jung-inchul on 2015. 11. 30..
 */
var flag_category = 0;
var category = ['b_name', 'b_author', 'b_publisher'];

$('#categoryDropdown li a').click(function(){
    $('#seriesDropdown').on("hide.bs.dropdown");
    $('#bookSearchCategory').html($(this).html());
    flag_category = $(this).parent().index();
});

$.post('/book/loadNewTechbook', function(data){
    settingHTML(data);
    clickEvent(data);
});

$('#bookSearchWords').keydown(function(){
    if(event.keyCode == 13){
        event.preventDefault();
        $('#bookSearchBtn').trigger('click');
        return false;
    }
});

$('#bookSearchBtn').click(function() {
    var bookSearchWords = $('#bookSearchWords').val();
    if (bookSearchWords.length == 0) {
        alert('검색어를 입력해주세요 ^^');
        return false;
    }else{
        $('#noti').remove();
        $.post('/book/searchBook', {category : category[flag_category], searchword : bookSearchWords, flag : 'tech'}, function(data){
            settingHTML(data);
            clickEvent(data);
        });
    }
});

function settingHTML(datalist){
    var htmlString = '<tbody>';
    $.each(datalist, function(idx, data){
        if(idx % 2 == 0){
            htmlString += '<tr class="even">';
        }else{
            htmlString += '<tr>';
        }
        htmlString += '<td><img class="bookSmallImg" src="' + data.b_photo_url + '"></td>';
        htmlString += '<td><div class="bookInfo">';
        htmlString += '<h4 class="bookTitle">' + data.b_name;
        if(data.b_state === 1)  htmlString += '&nbsp<span class="label label-primary">대여중</span>';
        else if(data.b_state === 2) htmlString += '&nbsp<span class="label label-primary">대여중</span>&nbsp<span class="label label-warning">예약중</span>';
        else if(data.b_state === 3) htmlString += '&nbsp<span class="label label-danger">분실도서</span>';
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
        string += '<h4 class="bookTitle">' + datalist[index].b_name + '</h4>';
        string += '<p>' + '저자 : ' + datalist[index].b_author + '</p><p>출판사 : ' + datalist[index].b_publisher + '</p>';
        if(datalist[index].b_state != 0){
            $('#request').addClass('disabled');
            $('#request').text('대여불가');
        }else{
            $('#request').removeClass('disabled');
            $('#request').text('대여');
        }
        $('div.modal-body').html(string);
        $('button#request').unbind().click(function(){
            if(datalist[index].b_state === 0){
                $.post("/book/borrowBook", {id : datalist[index].b_id, name: datalist[index].b_name}, function (data) {
                    alert(data);
                });
                $('div.modal').modal('hide');
                window.location.reload();
            }
        });

        $('button#reserve').unbind().click(function(){
            $.post("/book/reserveBook", {id : datalist[index].b_id, name: datalist[index].b_name}, function (data) {
                alert(data);
            });
            $('div.modal').modal('hide');
            window.location.reload();
        });

        $('button#missing').unbind().click(function(){
            $.post("/book/missingBook", function (data) {
                alert(data);
            });
            $('div.modal').modal('hide');
            window.location.reload();
        });

        $('div.modal').modal();
    });
}