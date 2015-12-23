/**
 * Created by jung-inchul on 2015. 12. 23..
 */

loadmissingBook();

function loadmissingBook(){
    var htmlString = '<thead><tr><th>신고자</th><th>도서</th><th>신고일</th></tr></thead><tbody>';
    $.post('/book/manage/loadmissingBook', function(response){
        $.each(response, function(idx, data){
            htmlString += '<tr><td>' + data.u_name + '</td><td>' + data.b_name + ' ( ' + data.b_publisher + ', ' + data.b_author + ')</td><td>' + data.brl_loss_date + '</td></tr>';
        });
        htmlString += '</tbody>';
        $('#missingbookTable').html(htmlString);
    });
}