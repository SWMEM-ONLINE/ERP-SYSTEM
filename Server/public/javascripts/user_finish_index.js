/**
 * Created by KIMDONGWON on 2016-01-04.
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

getMemberList();

function getMemberList(){
    $.ajax({
        type:'post',
        url:'/user/getFinishUserlist',
        contentType:'application/json',
        success: function(data) {

            var tbodyString = '';
            if (data.length == 0) {
                tbodyString = '<tr><td colspan="6"><h4>수료예정회원이 없습니다</h4></td></tr>';
            }
            else {

                for (var i = 0; i < data.length; i++) {

                    var finish = data[i];
                    var book = finish.u_book;
                    var hardware = finish.u_hardware;
                    var fee = finish.u_fee;
                    tbodyString += '<tr>';
                    tbodyString += '<td>' + finish.u_name + '</td>' + '<td>' + finish.u_period + '</td>';
                    if (book > 0) {
                        tbodyString += '<td>' + 'O' + '</td>';
                    }
                    else {
                        tbodyString += '<td>' + 'X' + '</td>';
                    }

                    if (hardware > 0) {
                        tbodyString += '<td>' + 'O' + '</td>';
                    }
                    else {
                        tbodyString += '<td>' + 'X' + '</td>';
                    }

                    if (fee > 0) {
                        tbodyString += '<td>' + 'O' + '</td>';
                    }
                    else {
                        tbodyString += '<td>' + 'X' + '</td>';
                    }

                    tbodyString += '<td><button type="button" id="' + finish.u_id + '" onclick="changeState(this.id)">수료</button></td>';

                    tbodyString += '</tr>';
                }
            }
            $('#memberList tbody').empty();
            $('#memberList tbody').append(tbodyString);
        }
    });
}

function changeState(id){
    var send = {
        grade:105,
        u_id:id
    };

    $.ajax({
        type:'post',
        url:'/user/updateUserGrade',
        data:JSON.stringify(send),
        contentType:'application/json',
        success: function(data){
            if(data.status == '0'){
                getMemberList();
                toastr['success']('수료 처리되었습니다');
            }
        }
    });
}