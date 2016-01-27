/**
 * Created by KIMDONGWON on 2016-01-23.
 */

getMemberList();

function getMemberList(){
    var periodNum = '';
    var tbodyString = '';
    var send = {
        type:'members'
    };
    $.ajax({
        type:'post',
        url:'/user/userlist',
        data:JSON.stringify(send),
        contentType:'application/json',
        success: function(data) {
            if(data.status == 'fail'){
                toastr['error']('회원 목록 로딩 실패');
            }
            else {
                tbodyString += '<tr>';
                var periodCnt = 0;
                for (var i = 0; i < data.length; i++) {
                    var user = data[i];
                    if (periodCnt % 5 == 0 && i != 0) {
                        tbodyString += '</tr><tr>';
                    }
                    if (periodNum != user.u_period) {
                        tbodyString += '</tr><th colspan="5">' + user.u_period + '</th></tr><tr>';
                        periodNum = user.u_period;
                        periodCnt = 0;
                    }
                    var classString = 'table-clickable';
                    tbodyString += '<td id="' + user.u_id + '" class="' + classString + '">' + user.u_name + '</td>';
                    periodCnt++;
                }
                var remain = periodCnt % 5;
                if (remain > 0) {
                    for (i = remain; i < 5; i++) {
                        tbodyString += '<td></td>';
                    }
                }
                tbodyString += '</tr>';
                $('#memberList tbody').empty();
                $('#memberList tbody').append(tbodyString);
            }
        }
    });
}

$('#memberList').on('click','td',function(){
    $(this).toggleClass('warning');
});

$('#push').click(function(){
    var arr = new Array();
    var message = $('#message').val();
    if(message == ''){
        toastr['warning']('메세지를 입력하세요');
    }
    else {

        $('#memberList > tbody > tr > td').each(function () {
            if ($(this).hasClass('warning')) {
                arr.push(this.id);
            }
        });
        if (arr.length == 0) {
            toastr['warning']('보낼 사람을 선택하세요');
        }
        else {
            var send = {
                message: message,
                list: arr
            };
            $.ajax({
                type: 'post',
                url: '/user/push',
                data: JSON.stringify(send),
                contentType: 'application/json',
                success: function (response) {
                    if (response.status == '0') {
                        toastr['success']('Push를 보냈습니다');
                    }
                    else {
                        toastr['error']('Push를 실패했습니다');
                    }
                }
            });
        }
    }
});

