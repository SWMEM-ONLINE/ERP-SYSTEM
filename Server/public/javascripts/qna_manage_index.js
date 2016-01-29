/**
 * Created by KIMDONGWON on 2015-12-28.
 */

qnaList(1);

function qnaList(pageNum){
    var data = {
        pageIdx:pageNum
    };
    $.ajax({
        type:'post',
        url:'/qna/qnalist',
        data:JSON.stringify(data),
        contentType:'application/json',
        success:function(data) {
            if (data.status == 'fail') {
                toastr['error']('문의 목록 로딩 실패');
            }
            else {
                var totalPage = data.totalPage;

                var tbodyString = '';
                var paginationString = '';
                if (totalPage == 0) {
                    tbodyString += '<tr class="empty">';
                    tbodyString += '<td colspan=4><h4>문의 기록이 없습니다</h4></td>';
                    tbodyString += '</tr>';
                }
                else {
                    var dataList = data.list;
                    for (var i = 0; i < dataList.length; i++) {
                        var list = dataList[i];
                        console.log(list);
                        tbodyString += '<tr id="' + list.q_id + '">';
                        tbodyString += '<td>' + list.q_writer + '</td>' + '<td>' + list.q_title + '</td>' + '<td class="hidden">' + list.q_content + '</td>' + '<td class="hidden">' + list.q_state + '</td>' + '<td class="hidden">' + list.q_id + '</td>' + '<td>' + list.q_write_date + '</td>';
                        if (list.q_state == 0) {
                            tbodyString += '<td><span class="waitforans">답변대기</span></td>';
                        }
                        else if (list.q_state == 1) {
                            tbodyString += '<td><span class="answered">답변완료</span></td>';
                        }
                        tbodyString += '<td class="hidden">' + pageNum + '</td>';
                        tbodyString += '</tr>';
                    }

                    paginationString += '<tr>';
                    for (var i = 0; i < totalPage; i++) {
                        if (i + 1 == pageNum) {
                            paginationString += '<th>' + (i + 1) + '</th>';
                        }
                        else {
                            paginationString += '<td><a id="' + (i + 1) + '" onclick="qnaList(this.id)">' + (i + 1) + '</a></td>';
                        }
                    }

                    paginationString += '</tr>';
                }
                $('#history>tbody').empty();
                $('#history>tbody').append(tbodyString);
                $('#pagination>tbody').empty();
                $('#pagination>tbody').append(paginationString);
            }
        }
    });
}

$('#history tbody').on('click','tr:not(.empty)',function () {
    var tbodyString = '';
    var arr = new Array();
    $(this).children('td').map(function () {
        arr.push($(this).text());
    });
    $('.modal-title').text(arr[1]);
    $('p#p1').text(arr[0]);
    $('p#p2').text(arr[5]);
    $('p#p3').text(arr[2]);
    $('p#p4').text(arr[6]);
    document.getElementById('comment').setAttribute('onkeypress','submitEnter(event,'+arr[4]+')');
    document.getElementById('commentEnter').setAttribute('q_id',arr[4]);
    if(arr[3] == 1){
        $('#solve').addClass('hidden');
    }
    else{
        $('#solve').removeClass('hidden');
    }
    document.getElementById('solve').setAttribute('value',arr[4]);
    document.getElementById('solve').setAttribute('page',arr[7]);
    document.getElementById('delete').setAttribute('value',arr[4]);
    document.getElementById('delete').setAttribute('page',arr[7]);
    commentList(arr[4]);
    $('div.modal').modal();
});

function commentList(q_id){
    var req = {
        q_id:q_id
    };
    var tbodyString = '';
    $.ajax({
        type:'post',
        url:'/qna/getQnaReply',
        data:JSON.stringify(req),
        contentType:'application/json',
        success: function(data) {
            if (data.status == 'fail') {
                toastr['error']('댓글 로딩 실패');
            }
            else {

                for (var i = 0; i < data.length; i++) {
                    row = data[i];
                    tbodyString += '<tr>';
                    tbodyString += '<td class="name">' + row.u_name + '</td>' + '<td class="comment">' + row.qr_content + '</td>';
                    tbodyString += '</tr>';
                }
                $('#commentTable tbody').empty();
                $('#commentTable tbody').append(tbodyString);
            }
        }
    });
}

function submitEnter(e,q_id){
    if(e.keyCode == 13){
        var comment = $('#comment').val();
        if(comment != '') {
            var data = {
                q_id: q_id,
                content: comment
            };
            $.ajax({
                type: 'post',
                url: '/qna/setQnaReply',
                data: JSON.stringify(data),
                contentType: 'application/json',
                success: function (data) {
                    if (data.status === '0') {
                        commentList(q_id);
                        $('#comment').val('');
                    }
                    else{
                        toastr['error']('댓글 전송 실패');
                    }
                }
            });
        }
    }
}

$('#commentEnter').on('click',function(){
    var comment = $('#comment').val();
    var q_id = document.getElementById('commentEnter').getAttribute('q_id');

    if(comment != ''){
        var data = {
            q_id:q_id,
            content:comment
        };
        $.ajax({
            type:'post',
            url:'/qna/setQnaReply',
            data:JSON.stringify(data),
            contentType:'application/json',
            success: function(data){
                if(data.status === '0'){
                    commentList(q_id);
                    $('#comment').val('');
                }
                else{
                    toastr['error']('댓글 전송 실패');
                }
            }
        });
    }
});


$('#solve').click(function(){
    var data = {
        q_id:document.getElementById('solve').getAttribute('value'),
        state:1
    };

    $.ajax({
        type:'post',
        url:'/qna/qnaModify',
        data:JSON.stringify(data),
        contentType:'application/json',
        success: function(data){
            if(data.status === '0'){
                qnaList(document.getElementById('solve').getAttribute('page'));
                $('div.modal').modal('hide');
            }
            else{
                toastr['error']('해결 전송 실패');
            }
        }
    });
});

$('#delete').click(function(){
    var data = {
        q_id:document.getElementById('delete').getAttribute('value')
    };

    $.ajax({
        type:'post',
        url:'/qna/qnaDelete',
        data:JSON.stringify(data),
        contentType:'application/json',
        success: function(data){
            if(data.status === '0'){
                qnaList(document.getElementById('delete').getAttribute('page'));
                $('div.modal').modal('hide');
                toastr['success']('삭제 성공');
            }
            else{
                toastr['error']('삭제 실패');
            }
        }
    });
});