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

$.post('/book/loadNewest', function(data){
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
    $('#noti').remove();
    if (bookSearchWords.length == 0) {
        alert('검색어를 입력해주세요 ^^');
        return false;
    }else{
        $.post('/book/searchBook', {category : category[mode], searchword : bookSearchWords}, function(data){
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
        htmlString += '<td><img class="bookSmallImg" src="' + data.b_img + '"></td>';
        htmlString += '<td><div class="bookInfo">';
        htmlString += '<h4 class="bookTitle">' + data.b_name + '</h4>';
        htmlString += '<p>' + ' 저자 : ' + data.b_author + '</p><p>' + " 출판사 : " + data.b_publisher + '</p><p>' + "정가 : " + data.b_price + '원</p></div></td>';
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
        //string += '<p> 신청을 취소하려면 <span style="color:red;font-weight:bold;">하단의 신청취소</span>를 눌러요 ^^ </p>';
        string += '<img class="bookLargeImg" src="' + datalist[index].b_img + '"/>';
        string += '<h4 class="bookTitle">' + datalist[index].b_name + '</h4>';
        string += '<p>' + '저자 : ' + datalist[index].b_author + '</p><p>출판사 : ' + datalist[index].b_publisher + '</p><p>정가 : ' + datalist[index].b_price + ' 원</p><p>';

        $('div.modal-body').html(string);
        $('button#request').unbind().click(function(){
            $.post("/book/borrowBook", {b_isbn: datalist[index].b_isbn}, function (data) {
                alert(data);
                window.location.reload();
            });
            $('div.modal').modal('hide');
        });
        $('button#reserve').unbind().click(function(){
            $.post("/book/reserveBook", {b_isbn: datalist[index].b_isbn}, function (data) {
                alert(data);
                window.location.reload();
            });
        });
        $('button#missing').unbind().click(function(){
            $.post("/book/missingBook", {b_isbn: datalist[index].b_isbn}, function (data) {
                alert(data);
                window.location.reload();
            });
        });
        $('div.modal').modal();
    });
}