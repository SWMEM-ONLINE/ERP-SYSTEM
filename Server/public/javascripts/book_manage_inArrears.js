/**
 * Created by jung-inchul on 2015. 12. 24..
 */


$.post('/book/manage/loadinArrears', function(datalist){
    var htmlString = '';
    $.each(datalist, function(idx, data){
        htmlString += '<tr><td>' + data.b_rental_username + '</td>';
        htmlString += '<td>' + data.b_name + '</td>';
        htmlString += '<td>' + data.b_due_date + '</td>';
        htmlString += '<td>' + data.diff + '</td></tr>';
    });
    $('#inarrearsTable tbody').html(htmlString);
});
