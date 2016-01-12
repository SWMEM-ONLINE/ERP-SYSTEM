/*
 * Created by jung-inchul on 2015. 11. 12..
 */

var mode = 0;
var category = ['title', 'author', 'publisher'];

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
        toastr['info']('검색어를 입력해주세요');
        return false;
    }
    else{
        getInterparklist(1, s_searchWords, category[mode]);
    }
});

function settingHTML(datalist, pageIndex, totalResults, searchWords, searchCategory){

    if(datalist.length === 0){
        toastr['info']('검사 결과가 없습니다');
    }else {
        $.post('/apply/newbook/checkDuplication', function(response){
            var htmlString = '<tbody>';
            $.each(datalist, function (idx, data) {
                if (idx % 2 == 0) {
                    htmlString += '<tr class="even">';
                } else {
                    htmlString += '<tr>';
                }
                htmlString += '<td><img class="bookSmallImg" src="' + data.coverLargeUrl + '"></td>';
                htmlString += '<td><div class="bookInfo">';
                htmlString += '<h4 class="bookTitle">' + data.title + '</h4>';
                if(data.saleStatus != '판매중'){
                    htmlString += '<p><span class="label label-danger">' + data.saleStatus + '</span>';
                    for(var i = 0; i < response.length; i++){
                        if(response[i].b_isbn === data.isbn){
                            htmlString += ' ' + '<span class="label label-primary">' + response[i].cnt + '권 존재</span></p>';
                        }else if(response[i].cnt === data.isbn){
                            htmlString += ' ' + '<p><span class="label label-success">신청중</span></p>';
                            break;
                        }
                    }
                }else{
                    for(var i = 0; i < response.length; i++){
                        if(response[i].b_isbn === data.isbn){
                            htmlString += '<p><span class="label label-primary">' + response[i].cnt + '권 존재</span></p>';
                        }else if(response[i].cnt === data.isbn){
                            htmlString += '<p><span class="label label-success">신청중</span></p>';
                            break;
                        }
                    }
                }
                htmlString += '<p>' + ' 저자 : ' + data.author + '</p><p>' + " 출판사 : " + data.publisher + '</p><p>' + "정가 : " + data.priceStandard + '원</p></div></td>';
                htmlString += '</tr>';
            });

            htmlString += '</tbody>';
            $('#newbooklist').html(htmlString);


            var pagination_string = '';
            var number = parseInt(totalResults / 20) + 1;

            for (var i = 1; i <= number; i++) {
                pagination_string += '<li><a href="#">' + i + '</a></li>';
            }

            $('.pagination').html(pagination_string);

            $('.pagination li:nth-child(' + pageIndex + ')').addClass('active');

            $('.pagination li').click(function(){
                var index = $(this).index();
                getInterparklist(index+1, searchWords, searchCategory);
            });


            $('.modal-title').text('도서 신청하기');
            $('#request').text('신청');
            clickEvent(datalist, pageIndex, totalResults, searchWords, searchCategory);
        });
    }
}

function clickEvent(datalist, pageIndex, totalResults, searchWords, searchCategory){
    $('tr').click(function() {
        var index = $(this).index();
        var string = '';
        string += '<img class="bookLargeImg" src="' + datalist[index].coverLargeUrl + '"/>';
        string += '<h5 class="bookTitle">' + datalist[index].title + '</h5>';
        string += '<p>' + '저자 : ' + datalist[index].author + '</p><p>출판사 : ' + datalist[index].publisher + '</p><p>정가 : ' + datalist[index].priceStandard + ' 원</p>';

        $('div.modal-body').html(string);

        $('button#request').unbind().click(function(){
            $.post("/apply/newbook/request", datalist[index], function(data){
                if(data === 'failed'){
                    toastr['error']('이미 누군가 신청한 책입니다');
                }
                else{
                    toastr['info']('도서신청에 성공했습니다');
                    settingHTML(datalist, pageIndex, totalResults, searchWords, searchCategory);
                }
            });
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
            maxResults : 20,
            sort : 'salesPoint',
            output : 'json'
        },
        type: 'GET',
        async : true,
        dataType : 'jsonp',
        success:function(response){
            settingHTML(response.item, pageIndex, response.totalResults, searchWords, searchCategory);
        },
        error:function(response){
            toastr['info']('검색에 실패하였습니다. 다시 시도해주세요');
        }
    });
}