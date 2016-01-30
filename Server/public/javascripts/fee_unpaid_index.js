/**
 * Created by KIMDONGWON on 2016-01-29.
 */
$.post('/fee/unpaid',function(response) {
    var tbodyString = '';
    console.log(response);
    if(response.length == 0){
        tbodyString += '<tr><td colspan="4"><h4>미납내역이 없습니다</h4></td></tr>';
    }
    else{
        for(var i = 0;i<response.length;i++){
            tbodyString += '<tr>';
            tbodyString += '<td>'+response[i].f_date+'</td>';
            if(response[i].f_type == 1){
                tbodyString += '<td>회비</td>';
            }
            else if(response[i].f_type == 2){
                tbodyString += '<td>삼과비</td>';
            }
            else if(response[i].f_type == 3){
                tbodyString += '<td>기타</td>';
            }
            tbodyString += '<td>'+response[i].f_content+'</td>';
            tbodyString += '<td>'+response[i].f_price.toLocaleString()+'</td>';
            tbodyString += '</tr>';
        }
    }
    $('#unpaidList tbody').empty();
    $('#unpaidList tbody').append(tbodyString);
});