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
            var tbodyString = '<tr class="empty"><td colspan="5"><h4>투표가 없습니다</h4></td></tr>';
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
                tbodyString += '<td>'+response[i].v_join_cnt+'</td>';
                tbodyString += '<td>'+response[i].v_voted_cnt+'</td>';

                tbodyString += '<td>'+'</td>';
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
                tbodyString += '<p>';
                tbodyString += response[i].vi_title;
                tbodyString += ' <span class="label label-success">'+response[i].vi_cnt + '명 선택</span>';
                var persentage =Math.round((response[i].vi_cnt / arr[2])*100)/100 * 100;
                if(persentage == 0){
                    tbodyString += '<div class="progress"><div class="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: '+persentage+'%;color:black;float:none;margin:auto;">'+persentage+'%</div></div>';
                }
                else{
                    tbodyString += '<div class="progress"><div class="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: '+persentage+'%">'+persentage+'%</div></div>';
                }
                tbodyString += '</p>';
            }
            $('#voteModal .modal-body').empty();
            $('#voteModal .modal-body').append(tbodyString);
            document.getElementById('vote').setAttribute('number',vid);
            document.getElementById('save').setAttribute('number',vid);
            $('#voteModal div.modal').modal();
        }
    });
});

$('#vote').click(function(){
    $('#vote').addClass('hidden');
    $('#save').removeClass('hidden');
});