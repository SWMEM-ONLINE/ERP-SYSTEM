/**
 * Created by KIMDONGWON on 2016-01-02.
 */

var degree = ['','운영자','회장','총무','자재부장','생활장','세미나장','문화장','네트워크장','교육장'];
var COMMAND_DEGREE = 9;
degree[100] = '정회원';
degree[101] = '준회원';
degree[102] = '수료예정회원';
degree[103] = '비활성화';
degree[104] = '가입대기';
degree[105] = '수료회원';

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
    });
}

$('#memberList').on('click','td',function(){
    var send = {
        u_id:$(this).attr('id')
    };
    $.ajax({
        type:'post',
        url:'/user/memberinfo',
        data:JSON.stringify(send),
        contentType:'application/json',
        success: function(data){
            $('div.modal #id').html(data[0].u_id);
            $('div.modal #name').html(data[0].u_name);
            $('div.modal #period').html(data[0].u_period);
            $('div.modal #phone').html(data[0].u_phone);
            $('div.modal #mail').html(data[0].u_email);
            $('div.modal #type').html(degree[data[0].u_state]);
            document.getElementById('profile').setAttribute('src','http://211.189.127.124:3000/image?name='+data[0].u_photo_url);
            //document.getElementById('profile').setAttribute('src','http://www.swmem.org/image?name='+data[0].u_photo_url);
            $('div.modal').modal();
        }
    });
});