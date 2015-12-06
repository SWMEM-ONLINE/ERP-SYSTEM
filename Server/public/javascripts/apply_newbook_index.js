/*
 * Created by jung-inchul on 2015. 11. 12..
 */

var mode = 0;
var category = ['title', 'author', 'publisher'];

$('#categoryDropdown li a').click(function(){               // Select Category to Search.
    $('#bookSearchCategory').html($(this).html());
    mode = $(this).parent().index();
});

$('#newbookSearchWords').keydown(function(){
    if(event.keyCode == 13){
        event.preventDefault();
        $('#newbookSearchBtn').trigger('click');
        return false;
    }
});


$('#newbookSearchBtn').click(function() {
    var s_searchWords = $('#newbookSearchWords').val();
    if (s_searchWords.length == 0) {
        alert('검색어를 입력해주세요 ^^');
        return false;
    }
    else{
        getInterparklist(1, s_searchWords, category[mode]);
    }
});

$('#loadMyapplication').click(function(){
    var user = 'temp';
    $.post('/apply_newbook/loadMyapply', {userId : user}, function(res){
        settingHTML(res, 1);
        clickEvent(res, 1);
    });
});

function settingHTML(datalist, flag){
    if(datalist.length === 0){
        if(flag === 0){
            alert('검사 결과가 없습니다 ㅎㅎ');
        }else{
            alert('신청하신 책이 없습니다 ^^;;');
        }
    }
        var htmlString = '<tbody>';
        $.each(datalist, function(idx, data){
            if(idx % 2 == 0){
                htmlString += '<tr class="even">';
            }else{
                htmlString += '<tr>';
            }
            if(flag === 0){
                htmlString += '<td><img class="bookSmallImg" src="' + data.coverLargeUrl + '"></td>';
                htmlString += '<td><div class="bookInfo">';
                htmlString += '<h4 class="bookTitle">' + data.title + '</h4>';
                htmlString += '<p>' + ' 저자 : ' + data.author + '</p><p>' + " 출판사 : " + data.publisher + '</p><p>' + "정가 : " + data.priceStandard + '원</p></div></td>';
                htmlString += '</tr>';
            }else{
                htmlString += '<td><img class="bookSmallImg" src="' + data.b_img + '"></td>';
                htmlString += '<td><div class="bookInfo">';
                htmlString += '<h4 class="bookTitle">' + data.b_name + '</h4>';
                htmlString += '<p>' + ' 저자 : ' + data.b_author + '</p><p>' + " 출판사 : " + data.b_publisher + '</p><p>' + "정가 : " + data.b_price + '원</p></div></td>';
                htmlString += '</tr>';
            }
        });
        htmlString += '</tbody>';
        $('#newbooklist').html(htmlString);
        if(flag === 0){             // flag가 0인경우. 신청요청을 넣었을 때
            var pagination_string = '';
            var number = parseInt(datalist.totalResults / datalist.maxResults) + 1;
            for(var i = 1; i <= number; i++){
                pagination_string += '<li><a href="#">' + i + '</a></li>';
            }
            $('.pagination').html(pagination_string);
            $('.modal-title').text('도서 신청하기');
            $('#request').text('신청');
        }else{                      // flag 가 1인경우. 신청 취소를 넣었을 경우이다.
            $('.modal-title').text('도서신청 취소하기');
            $('#request').text('신청 취소');
            $('.pagination').html('');
        }
}

function clickEvent(datalist, flag){
    $('tr').click(function() {
        var index = $(this).index();
        var string = '';
        if (flag === 0) {            // flag가 0인 경우 신청하는 곳.
            string += '<p> 도서를 신청하시려면 <span style="color:red;font-weight:bold;">하단의 신청버튼</span>을 눌러요 ^^ </p>';
            string += '<img class="bookLargeImg" src="' + datalist[index].coverLargeUrl + '"/>';
            string += '<h4 class="bookTitle">' + datalist[index].title + '</h4>';
            string += '<p>' + '저자 : ' + datalist[index].author + '</p><p>출판사 : ' + datalist[index].publisher + '</p><p>정가 : ' + datalist[index].priceStandard + ' 원</p><p>' + datalist[index].description + '</p>';
        } else {                      // flag가 1인 경우 신청취소하는 곳.
            string += '<p> 신청을 취소하려면 <span style="color:red;font-weight:bold;">하단의 신청취소</span>를 눌러요 ^^ </p>';
            string += '<img class="bookLargeImg" src="' + datalist[index].b_img + '"/>';
            string += '<h4 class="bookTitle">' + datalist[index].b_name + '</h4>';
            string += '<p>' + '저자 : ' + datalist[index].b_author + '</p><p>출판사 : ' + datalist[index].b_publisher + '</p><p>정가 : ' + datalist[index].b_price + ' 원</p><p>';
        }
        $('div.modal-body').html(string);
        $('button#request').unbind().click(function(){
            if(flag == 0){
                $.post("/apply_newbook/request", {b_isbn: datalist[index].isbn, b_name: datalist[index].title, b_author: datalist[index].author, b_publisher: datalist[index].publisher, b_price: datalist[index].priceStandard, b_img: datalist[index].coverLargeUrl}, function(data){
                    alert(data);
                });
            }else{
                $.post("/apply_newbook/deleteMyapply", {b_isbn: datalist[index].b_isbn}, function (data) {
                    alert(data);
                    window.location.reload();
                });
            }
            $('div.modal').modal('hide');
        });
        $('div.modal').modal();
    });
}

function getInterparklist(pageIndex, searchWords, searchCategory) {
    $.ajax({
        url : 'http://book.interpark.com/api/search.api',
        data : {
            key : 'D7B76D09CB67DDA7510E048540EC4E89E0E68172D0D3CFCF88171D40413DC088',
            query : searchWords,
            queryType : searchCategory,
            start : pageIndex,
            maxResults : 50,
            sort : 'salesPoint',
            output : 'json'
        },
        type: 'GET',
        async : true,
        dataType : 'jsonp',
        success:function(response){
            settingHTML(response.item, 0);
            clickEvent(response.item, 0);
            // 여기다가 책 중복검사하는 Function 을 넣어야 한다
            $('.pagination li:nth-child(' + pageIndex + ')').addClass('active');
            $('.pagination li').click(function(){
                var index = $(this).index();
                getInterparklist(index+1, searchWords, searchCategory);
            });
        },
        error:function(response){
            console.log(response);
            alert('검색에 실패하였습니다. 다시 시도해주세요 ㅎㅎ');
        }
    });
}