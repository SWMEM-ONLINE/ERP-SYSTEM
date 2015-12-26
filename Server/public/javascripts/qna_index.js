/**
 * Created by KIMDONGWON on 2015-12-23.
 */

myqnaList(1);

function myqnaList(pageNum){
    var data = {
        pageIdx:pageNum
    };
    $.ajax({
        type:'post',
        url:'/qna/myqnalist',
        data:JSON.stringify(data),
        contentType:'application/json',
        success:function(data){
            var totalPage = data.totalPage;

            var tbodyString = '';
            var paginationString = '';
            if(totalPage == 0){
                tbodyString += '<tr>';
                tbodyString += '<td colspan=3><h4>문의 기록이 없습니다</h4></td>';
                tbodyString += '</tr>';
            }
            else{
                var dataList = data.list;
                for(var i=0;i<dataList.length;i++){
                    var list = dataList[i];
                    tbodyString += '<tr id="'+list.q_id+'">';
                    tbodyString += '<td>'+list.q_title+'</td>'+'<td class="hidden">'+list.q_content+'</td>'+'<td class="hidden">'+list.q_state+'</td>'+'<td class="hidden">'+list.q_id+'</td>'+'<td>'+list.q_write_date+'</td>';
                    if(list.q_state == 0){
                        tbodyString += '<td>답변대기</td>';
                    }
                    else if(list.q_state == 1){
                        tbodyString += '<td>답변완료</td>';
                    }
                    tbodyString += '</tr>';
                }

                paginationString += '<tr>';
                for(var i=0;i<totalPage;i++){
                    if(i + 1 == pageNum){
                        paginationString += '<th>' + (i+1) + '</th>';
                    }
                    else {
                        paginationString += '<td><a id="'+ (i+1) +'" onclick="myqnaList(this.id)">' + (i+1) + '</a></td>';
                    }
                }

                paginationString += '</tr>';
            }
            $('#history>tbody').empty();
            $('#history>tbody').append(tbodyString);
            $('#pagination>tbody').empty();
            $('#pagination>tbody').append(paginationString);
        }
    });
}

function commentList(q_id){
    var req = {
        q_id:q_id
    };
    var tbodyString = '';
    $.ajax({
        type:'post',
        url:'/qna/myqna',
        data:JSON.stringify(req),
        contentType:'application/json',
        success: function(data){
            for(var i=0;i<data.length;i++){
                row = data[i];
                tbodyString += '<tr>';
                tbodyString += '<td class="name">'+row.qr_writer+'</td>'+'<td class="comment">'+row.qr_content+'</td>';
                tbodyString += '</tr>';
            }
            $('#commentTable tbody').empty();
            $('#commentTable tbody').append(tbodyString);
        }
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
                myqnaList(1);
                $('#title').val('');
                $('#qna').val('');
            }
        }
    });
});

$('#history tbody').on('click','tr:not(.empty)',function () {
    $('div.modal').modal();
    var tbodyString = '';
    var arr = new Array();
    $(this).children('td').map(function () {
        arr.push($(this).text());
    });
    $('.modal-title').text(arr[0]);
    console.log(arr);
    tbodyString += '<p>'+arr[4]+'</p>';
    tbodyString += '<p>'+arr[1]+'</p>';
    tbodyString += '<p>'+arr[5]+'</p>';
    tbodyString += '<input id="comment" type="text" onkeypress="submitEnter(event,'+arr[3]+')"/>';
    tbodyString += '<table id="commentTable" class="table">';
    tbodyString += '<tbody>';
    tbodyString += '</tbody>';
    tbodyString += '</table>';
    $('div.modal .modal-body').html(tbodyString);
    commentList(arr[3]);
    $('div.modal').modal();
});

function submitEnter(e,q_id){
    if(e.keyCode == 13){
        var comment = $('#comment').val();
        var data = {
            q_id:q_id,
            content:comment
        };
        $.ajax({
            type:'post',
            url:'/qna/qnareply',
            data:JSON.stringify(data),
            contentType:'application/json',
            success: function(data){
                if(data.status === '0'){
                    commentList(q_id);
                    $('#comment').val('');
                }
            }
        });
    }
}