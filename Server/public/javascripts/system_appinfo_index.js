/**
 * Created by KIMDONGWON on 2016-01-02.
 */

var degree = ['','운영자','회장','총무','자재부장','생활장','세미나장','문화장','네트워크장','교육장'];

$.ajax({
    type:'post',
    url:'/sys/appinfo',
    contentType:'application/json',
    success:function(data){
        if(data.status == 'fail'){
            toastr['error']('자치회 목록 로딩 실패');
        }
        else {

            var string = '';
            console.log(data);
            string += '<div class="row">';
            for (var i = 0; i < data.length; i++) {
                string += '<p class="col-xs-6 col-sm-4 text-center"><strong>' + degree[data[i].u_state] + '</strong>  ' + data[i].u_name + '</p>';
                console.log(data[i].u_state);
                console.log(data[i].u_name);
            }
            string += '</div>';

            $('div#councillist').html(string);
        }
    }
});