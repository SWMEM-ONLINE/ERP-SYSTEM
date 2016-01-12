/**
 * Created by KIMDONGWON on 2016-01-08.
 */

toastr.options = {
    'closeButton': false,
    'debug': false,
    'newestOnTop': false,
    'progressBar': false,
    'positionClass': 'toast-top-right',
    'preventDuplicates': false,
    'onclick': null,
    'showDuration': '300',
    'hideDuration': '1000',
    'timeOut': '5000',
    'extendedTimeOut': '1000',
    'showEasing': 'swing',
    'hideEasing': 'linear',
    'showMethod': 'fadeIn',
    'hideMethod': 'fadeOut'
};

getVoteList();

var itemCount = 0;

function getVoteList(){
    $.post('/vote/getVoteList',function(response){
        if(response.length == 0){
            var tbodyString = '<tr class="empty"><td colspan="4"><h4>투표가 없습니다</h4></td></tr>';
            $('#voteList tbody').empty();
            $('#voteList tbody').append(tbodyString);
        }
        else{
            var tbodyString = '';
            for(var i=0;i<response.length;i++){
                tbodyString += '<tr id="'+response[i].v_id+'"><td>'+response[i].v_title+'</td><td>'+response[i].u_name+'</td><td></td>';
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
    itemCount = 0;
    var tbodyString = '<div class="modal-body"><input id="title" type="text" placeholder="무엇을 물어볼까요?"><input id="content" type="text" placeholder="내용"><div id="multi"><input id="Multiple" type="checkbox" name="multiple" value="multiple"><label for="Multiple">복수선택 허용</label></div><div id="items"><input id="item0" type="text" placeholder="항목 입력"></div><button id="addItem" type="button" class="btn addVote">항목 추가</button></div>';
    $('#addVote .modal-body').empty();
    $('#addVote .modal-body').append(tbodyString);
    $('#addVote div.modal').modal();
});

$('.modal-body').on('click','#addItem',function(){
    var childContent = document.createElement('input');
    itemCount++;
    childContent.id = 'item' + itemCount;
    childContent.type = 'text';
    childContent.placeholder = '항목 입력';
    document.getElementById('items').appendChild(childContent);
});

$('#voteAdd').click(function(){
    var title = $('#title').val();
    var content = $('#content').val();
    var items = new Array();
    var flag = true;
    var multiple;

    if($('#Multiple').is(':checked')){
        multiple = 1;
    }
    else{
        multiple = 0;
    }

    for(var i=0;i<=itemCount;i++){
        var itemValue = $('#item'+i).val();
        if(itemValue != undefined){
            if(itemValue == '' || itemValue == null || itemValue == 'null'){
                toastr['info']('입력을 확인하세요');
                flag = false;
                break;
            }
            else{
                items.push(itemValue);
            }
        }
    }
    var send = {
        vTitle:title,
        vContent:content,
        vType:multiple,
        vItems:items
    };

    if(flag){
        $.ajax({
            type:'post',
            url:'/vote/createNewVote',
            data:JSON.stringify(send),
            contentType:'application/json',
            success:function(response) {
                if (response.status == '0') {
                    $('#addVote div.modal').modal('hide');
                    toastr['success']('투표 등록');
                    getVoteList();
                }
                else {
                    toastr['success']('투표 실패');
                }
            }
        });
    }
});

$('#voteList tbody').on('click','tr:not(.empty)',function(){
    var vid = $(this).attr('id');
    var send = {
        id:vid
    };
    var tbodyString = '';

    $.ajax({
        type:'post',
        url:'/vote/getVoteInfo',
        data:JSON.stringify(send),
        contentType:'application/json',
        success:function(response) {
            console.log(response);
            tbodyString = '<div class="modal-body"><input id="title" type="text" placeholder="무엇을 물어볼까요?"><input id="content" type="text" placeholder="내용"><div id="multi"><input id="Multiple" type="checkbox" name="multiple" value="multiple"><label for="Multiple">복수선택 허용</label></div><div id="items"><input id="item0" type="text" placeholder="항목 입력"></div><button id="addItem" type="button" class="btn addVote">항목 추가</button></div>';
            $('#editVote .modal-body').empty();
            $('#editVote .modal-body').append(tbodyString);
            document.getElementById('edit').setAttribute('number',vid);
            document.getElementById('delete').setAttribute('number',vid);
            $('#editVote div.modal').modal();
        }
    });
});

$('#delete').click(function(){
    var vid = $(this).attr('number');
    var send = {
        id:vid
    };
    $.ajax({
        type:'post',
        url:'/vote/deleteVote',
        data:JSON.stringify(send),
        contentType:'application/json',
        success:function(response) {
            if(response.status == '0'){
                $('#editVote div.modal').modal('hide');
                toastr['success']('투표 삭제');
                getVoteList();
            }
            else{
                $('#editVote div.modal').modal('hide');
                toastr['success']('삭제 실패');
            }
        }
    });
});