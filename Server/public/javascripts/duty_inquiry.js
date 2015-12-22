/**
 * Created by HyunJae on 2015. 12. 23..
 */




//$('#tmp').click(function(){
//
//    $.post('/duty/loadMyDuty', function(res){
//        generateHtml(res);
//    });
//
//});


$.post('/duty/getUser', function(res){

    var htmlString = res.name + "님은";
    $('#name').html(htmlString);

    htmlString = "입니다";
    $('#foot').html(htmlString);

});


$.post('/duty/loadMyDuty', function(res){
    generateHtml(res);
});


function generateHtml(datas){

    var htmlString = '<div>';


    if(datas.length === 0){
        htmlString += '<p> ';
        htmlString += '</p>';
    }else{


        $.each(datas, function (idx, data) {

            htmlString += '<p>';
            htmlString += data.month + "월 " + data.date +  "일 ";

            if(data.type == 0){
                htmlString += " 일반당직";
            }else if (data.type ==1){
                htmlString += " 벌당직";
            }

            htmlString += '</p>';

        });


    }
    htmlString += '</div>';
    $('#duty').html(htmlString);

}



function settingHTML(datalist, flag){
    if(datalist.length === 0){
        if(flag === 0){
            // infor 하늘 success 녹색 error 빨강
            toastr['info']('검사 결과가 없습니다');
        }else{
            toastr['info']('신청하신 책이 없습니다');
        }
    }else {
        $.post('/apply/newbook/checkDuplication', function(response){
            var htmlString = '<tbody>';
            $.each(datalist, function (idx, data) {
                if (idx % 2 == 0) {
                    htmlString += '<tr class="even">';
                } else {
                    htmlString += '<tr>';
                }
                if (flag === 0) {
                    htmlString += '<td><img class="bookSmallImg" src="' + data.coverLargeUrl + '"></td>';
                    htmlString += '<td><div class="bookInfo">';
                    htmlString += '<h4 class="bookTitle">' + data.title;
                    for(var i = 0; i < response.length; i++){
                        if(response[i].b_isbn === data.isbn){
                            htmlString += '&nbsp<span class="label label-danger">' + response[i].b_total + '권 존재</span>';
                        }else if(response[i].b_total === data.isbn){
                            htmlString += '&nbsp<span class="label label-primary">신청중</span>';
                            break;
                        }
                    }
                    htmlString += '</h4><p>' + ' 저자 : ' + data.author + '</p><p>' + " 출판사 : " + data.publisher + '</p><p>' + "정가 : " + data.priceStandard + '원</p></div></td>';
                    htmlString += '</tr>';
                } else {
                    htmlString += '<td><img class="bookSmallImg" src="' + data.ba_photo_url + '"></td>';
                    htmlString += '<td><div class="bookInfo">';
                    htmlString += '<h4 class="bookTitle">' + data.ba_name + '</h4>';
                    htmlString += '<p>' + ' 저자 : ' + data.ba_author + '</p><p>' + " 출판사 : " + data.ba_publisher + '</p><p>' + "정가 : " + data.ba_price + '원</p></div></td>';
                    htmlString += '</tr>';
                }
            });

            htmlString += '</tbody>';
            $('#newbooklist').html(htmlString);
            if (flag === 0) {             // flag가 0인경우. 신청요청을 넣었을 때
                var pagination_string = '';
                var number = parseInt(datalist.totalResults / datalist.maxResults) + 1;
                for (var i = 1; i <= number; i++) {
                    pagination_string += '<li><a href="#">' + i + '</a></li>';
                }
                $('.pagination').html(pagination_string);
                $('.modal-title').text('도서 신청하기');
                $('#request').text('신청');
            } else {                      // flag 가 1인경우. 신청 취소를 넣었을 경우이다.
                $('.modal-title').text('도서신청 취소하기');
                $('#request').text('신청 취소');
                $('.pagination').html('');
            }
            clickEvent(datalist, flag);
        });
    }
}