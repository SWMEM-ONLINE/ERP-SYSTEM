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

function getVoteList(type){
    $.post('/vote/getVoteList',{Type:type},function(response){
        if(response.length == 0){
            var tbodyString = '<tr class="empty"><td colspan="3"><h4>투표가 없습니다</h4></td></tr>';
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
                tbodyString += '<td>'+response[i].v_voted_cnt+'/'+response[i].v_join_cnt+'</td>';
                tbodyString += '<td>'+response[i].v_due_date+'</td>';
                tbodyString += '<td class="hidden">'+response[i].v_type+'</td>';
                tbodyString += '</tr>';
            }
            $('#voteList tbody').empty();
            $('#voteList tbody').append(tbodyString);

        }
    });
}

$('#voteList tbody').on('click','tr:not(.empty)',function(){
    var vid = $(this).attr('id');
    var send = {
        id:vid
    };
    var arr = new Array();

    $(this).children('td').map(function () {
        arr.push($(this).text());
    });
    $('#voteModal .modal-title').text(arr[0]);
    var tbodyString = '';
    $.ajax({
        type:'post',
        url:'/vote/getVoteInfo',
        data:JSON.stringify(send),
        contentType:'application/json',
        success:function(response) {

            for(var i=0;i<response.length;i++){
                var persentage =Math.round((response[i].vi_cnt / arr[2])*100)/100 * 100;
                tbodyString += '<div>';
                if(arr[5] == 0){ //radio
                    tbodyString += '<input type="radio" name="check" class="checkbox" id="select_'+response[i].vi_id+'"><label for="select_'+response[i].vi_id+'" class="input-label radio" style="float:left;"></label>';
                }
                else{  //checkbox
                    tbodyString += '<input type="checkbox" name="check" class="checkbox" id="select_'+response[i].vi_id+'"><label for="select_'+response[i].vi_id+'" class="input-label checkbox" style="float:left;"></label>';
                }
                tbodyString += '<div id="'+response[i].vi_id+'" class="progress"><div style="position: absolute; width:100%;"><div style="float:left; margin-left:10px;">'+response[i].vi_title+'</div><div style="float:right; margin-right:100px;"><i class="glyphicon glyphicon-user"></i><span>'+response[i].vi_cnt+'</span></div></div><div class="progress-bar" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width: '+persentage+'%;"></div></div><div>';
            }
            $('#voteModal .modal-body').empty();
            $('#voteModal .modal-body').append(tbodyString);
            document.getElementById('vote').setAttribute('number',vid);
            document.getElementById('save').setAttribute('number',vid);
            $('#vote').removeClass('hidden');
            $('#save').removeClass('hidden');
            $('#save').addClass('hidden');
            $('label.input-label').addClass('hidden');
            $('#voteModal div.modal').modal();
        }
    });
});

$('#save').click(function(){
    $('label.input-label').addClass('hidden');
    $('#vote').removeClass('hidden');
    $('#save').addClass('hidden');
});

$('#vote').click(function(){
    $('label.input-label').removeClass('hidden');
    $('#vote').addClass('hidden');
    $('#save').removeClass('hidden');
});

$('#voteModal').on('click','.progress',function(){
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