/**
 * Created by KIMDONGWON on 2015-12-23.
 */

myqnaList();

function myqnaList(){
    $.get('/qna/myqnalist',function(data){
        var tbodyString = '';

        if(data.length == 0){
            tbodyString += '<tr>';
            tbodyString += '<td colspan=4>문의 기록이 없습니다</td>';
            tbodyString += '</tr>';
        }
        else{
            for(var i=0;i<data.length;i++){
                var list = data[i];
                tbodyString += '<tr id="'+list.q_id+'">';
                tbodyString += '<td>'+(i+1)+'</td>'+'<td>'+list.q_title+'</td>'+'<td>'+list.q_write_date+'</td>';
                if(list.q_state == 0){
                    tbodyString += '<td>답변대기</td>';
                }
                else if(list.q_state == 1){
                    tbodyString += '<td>답변완료</td>';
                }
                tbodyString += '</tr>';
            }
        }
        $('#history>tbody').empty();
        $('#history>tbody').append(tbodyString);
    });
}

$('#submit').click(function(){
    var title = $('#title').val();
    var qna = $('#qna').val();
    var data = {
        title:title,
        content:qna
    };

    $.ajax({
        type:'post',
        url:'/qna/add',
        data:JSON.stringify(data),
        contentType:'application/json',
        success: function(data){
            if(data.status === '0'){
                toastr['success']('성공');
                myqnaList();
                $('#title').val('');
                $('#qna').val('');
            }
        }
    });
});

$('#history tbody').on('click','tr:not(.empty)',function () {
    var q_id = $(this).attr('id');
    var data = {q_id:q_id};
    $.ajax({
        type:'post',
        url:'/qna/myqna',
        data:JSON.stringify(data),
        contentType:'application/json',
        success: function(data){
            console.log(data);
            $('div.modal').modal();
        }
    });
});