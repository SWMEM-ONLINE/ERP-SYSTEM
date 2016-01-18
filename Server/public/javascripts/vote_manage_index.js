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

getVoteList(0);

var itemCount = 0;

function getVoteList(type){
    $.post('/vote/getVoteList',{Type:type},function(response){
        if(response.length == 0){
            var tbodyString = '<tr class="empty"><td colspan="4"><h4>투표가 없습니다</h4></td></tr>';
            $('#voteList tbody').empty();
            $('#voteList tbody').append(tbodyString);
        }
        else{
            var tbodyString = '';
            for(var i=0;i<response.length;i++){
                tbodyString += '<tr id="'+response[i].v_id+'">';
                tbodyString += '<td class="ellipsis"><nobr>';
                if(response[i].v_state == 1){
                    tbodyString += '<strong>'+response[i].v_title+'</strong>';
                }
                else if(response[i].v_state == 2){
                    tbodyString += response[i].v_title;
                }
                tbodyString += '</nobr></td>';
                tbodyString += '<td>'+response[i].u_name+'</td>';
                tbodyString += '<td>'+response[i].v_voted_cnt+'/'+response[i].v_join_cnt+'</td>';

                tbodyString += '<td>'+response[i].v_due_date+'</td>';
                tbodyString += '</tr>';
            }
            $('#voteList tbody').empty();
            $('#voteList tbody').append(tbodyString);
        }
    });
}

$('#add').unbind().click(function(){
    itemCount = 0;
    var tbodyString = '<div class="modal-body"><input id="title" type="text" placeholder="무엇을 물어볼까요?"><input id="content" type="text" placeholder="내용"><div id="multi">';
    tbodyString += '<input type="checkbox" id="Multiple" class="checkbox" name="multiple" value="multiple">';
    tbodyString += '<label for="Multiple" class="input-label checkbox"> 복수선택 </label>';
    tbodyString += '</div><div id="items"><input id="item0" type="text" placeholder="항목 입력"></div><button id="addItem" type="button" class="btn addVote">항목 추가</button></div>';
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

$('#voteAdd').unbind().click(function(){
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
                }
                else {
                    toastr['error']('투표 등록 실패');
                }
                getVoteList(0);
            }
        });
    }
});

$('#voteList tbody').on('click','tr:not(.empty)',function(){
    var vid = $(this).attr('id');
    var send = {
        id:vid
    };
    var arr = new Array();

    $(this).children('td').map(function () {
        arr.push($(this).text());
    });

    $('#editVote .modal-title').text(arr[0]);
    var tbodyString = '';
    console.log(arr);
    $.ajax({
        type:'post',
        url:'/vote/getVoteInfo',
        data:JSON.stringify(send),
        contentType:'application/json',
        success:function(response) {

            for(var i=0;i<response.length;i++){
                var persentage =Math.round((response[i].vi_cnt / arr[2])*100)/100 * 100;

                tbodyString += '<div id="'+response[i].vi_id+'" class="progress"><div style="position: absolute; width:100%;"><div style="float:left; margin-left:10px;">'+response[i].vi_title+'</div><div style="float:right; margin-right:50px;"><i class="glyphicon glyphicon-user"></i><span>'+response[i].vi_cnt+'</span></div></div><div class="progress-bar" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width: '+persentage+'%;"></div></div>';

            }
            $('#editVote .modal-body').empty();
            $('#editVote .modal-body').append(tbodyString);
            document.getElementById('delete').setAttribute('number',vid);
            $('#editVote div.modal').modal();
        }
    });
});

$('#delete').unbind().click(function(){
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
                getVoteList(0);
            }
            else{
                $('#editVote div.modal').modal('hide');
                toastr['success']('삭제 실패');
            }
        }
    });
});

$('#editVote').on('click','.progress',function(){
    var id = $(this).attr('id');
    var tbodyString = '';
    var send = {
        vItemId:id
    };
    $.ajax({
        type:'post',
        url:'/vote/getVoteUserList',
        data:JSON.stringify(send),
        contentType:'application/json',
        success:function(response) {
            if(response.length == 0){
                tbodyString += '<h5>선택한 회원이 없습니다</h5>';
            }
            else{
                for(var i=0;i<response.length;i++){
                    tbodyString += '<p>'+response[i].u_name+'</p>';
                }
            }
            $('#memberList .modal-body').empty();
            $('#memberList .modal-body').append(tbodyString);
            $('#memberList div.modal').modal();
        }
    });
});