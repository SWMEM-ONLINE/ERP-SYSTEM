/**
 * Created by jung-inchul on 2015. 12. 23..
 */

$('ul.nav-pills li').unbind().click(function(){
    var index = $(this).index();
    $('ul.nav-pills li').removeClass('active');
    $(this).addClass('active');
    if(index === 0) {
        $('table#nowhistoryTable').removeClass('hidden');
        $('table#pasthistoryTable').addClass('hidden');
        loadnowHistory();
    }else if(index === 1){
        $('table#nowhistoryTable').addClass('hidden');
        $('table#pasthistoryTable').removeClass('hidden');
        loadpastHistory();
    }
});

loadnowHistory();

function loadnowHistory(){
    var htmlString = '<thead><tr><th>이름</th><th>도서</th><th>대여일자</th><th>반납예정일</th></tr></thead><tbody>';
    $.post('/book/manage/loadnowHistory', function(response){
        $.each(response, function(idx, data){
            htmlString += '<tr><td rowspan="2">' + data.u_name + '</td><td>' + data.b_name + '</td><td rowspan="2">' + data.br_rental_date + '</td><td rowspan="2">' + data.b_due_date + '</td></tr><tr><td><span class="label label-info">' + data.b_publisher + '</span><span class="label label-warning">' + data.b_author + '</span></td></tr>';
        });
        htmlString += '</tbody>';
        $('#nowhistoryTable').html(htmlString);
    });
}

function loadpastHistory(){
    var htmlString = '<thead><tr><th>이름</th><th>도서</th><th>대여일자</th><th>반납일</th></tr></thead><tbody>';
    $.post('/book/manage/loadpastHistory', function(response){
        $.each(response, function(idx, data){
            htmlString += '<tr><td rowspan="2">' + data.u_name + '</td><td>' + data.b_name + '</td><td rowspan="2">' + data.brt_rental_date + '</td><td rowspan="2">' + data.brt_return_date + '</td></tr><tr><td><span class="label label-info">' + data.b_publisher + '</span><span class="label label-warning">' + data.b_author + '</span></td></tr>';
        });
        htmlString += '</tbody>';
        $('#pasthistoryTable').html(htmlString);
    });
}