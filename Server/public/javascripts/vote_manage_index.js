/**
 * Created by KIMDONGWON on 2016-01-08.
 */

getVoteList();

function getVoteList(){
    $.post('/vote//getVoteList',function(response){
        if(response.length == 0){
            var tbodyString = '<tr class="empty"><td colspan="4"><h4>투표가 없습니다</h4></td></tr>';
            $('#voteList tbody').empty();
            $('#voteList tbody').append(tbodyString);
        }
        else{
            var tbodyString = '';
            for(var i=0;i<response.length;i++){
                tbodyString += '<tr><td>'+response[i].v_title+'</td><td>'+response[i].v_writer+'</td><td></td>';
                if(response[i].v_state == 0){
                    tbodyString += '<th>투표완료</th></tr>';
                }
                else if(response[i].v_state == 1){
                    tbodyString += '<th>투표중</th></tr>';
                }
            }
            $('#voteList tbody').empty();
            $('#voteList tbody').append(tbodyString);
        }
    });
}

$('#add').click(function(){
    var tbodyString = '<div class="modal-body"><input id="title" type="text" placeholder="무엇을 물어볼까요?"><div id="multi"><input id="Multiple" type="checkbox" name="multiple" value="multiple"><label for="Multiple">복수선택 허용</label></div><div id="content"><input id="content0" type="text" placeholder="항목 입력"></div><button id="addContent" type="button" class="btn addVote">항목 추가</button></div>';
    $('#addVote .modal-body').empty();
    $('#addVote .modal-body').append(tbodyString);
    $('#addVote div.modal').modal();
});

$('#addVote').on('click','#addContent',function(){
    var childContent = document.createElement('input');
    var lastContent = document.getElementById('content').lastChild.getAttribute('id');
    var lastContentId = parseInt(lastContent.substr(7));

    childContent.id = 'content' + (lastContentId + 1);
    childContent.type = 'text';
    childContent.placeholder = '항목 입력';
    document.getElementById('content').appendChild(childContent);
});



$('#voteList tbody tr').click(function(){
    $('#editVote div.modal').modal();
});

