/**
 * Created by jung-inchul on 2016. 1. 16..
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

var sort_flag = 'period';

$('ul.nav-pills li').unbind().click(function(){
    var index = $(this).index();
    $('ul.nav-pills li').removeClass('active');
    $(this).addClass('active');
    if(index === 0) {
        $('div#m_enroll').removeClass('hidden');
        $('div#m_history').addClass('hidden');
        getUserlist(sort_flag);
    }else{
        $('div#m_enroll').addClass('hidden');
        $('div#m_history').removeClass('hidden');
        getmileageHistory();
    }
});

getUserlist(sort_flag);
sort_period();
sort_mileage();


$('#plusMinus').unbind().click(function(){
    if($(this).val() == 'PLUS'){
        $(this).val('MINUS');
        $(this).html('MINUS');
    }else{
        $(this).val('PLUS');
        $(this).html('PLUS');
    }
});

function getUserlist(){
    $.post('/user/getUserlist', {sort_flag: sort_flag}, function(datalist){
        userlistView(datalist);
        $('#m_userTable_body tr').unbind().click(function(){
            $(this).toggleClass('warning');
        });
        enrollButton(datalist);
    });
}

function userlistView(datalist){
    var htmlString = '';
    $.each(datalist, function(idx, data){
        htmlString += '<tr><td>' + data.u_period + '</td>';
        htmlString += '<td>' + data.u_name + '</td>';
        htmlString += '<td>' + data.u_mileage + '</td></tr>';
    });
    $('#m_userTable_body').html(htmlString);
}

function checkValid(){
    var point = $('input#point').val();
    var reason = $('input#reason').val();

    if(point === "" || reason === ""){
        toastr['error']('점수, 사유를 기입하세요');
        return false;
    }
    if(!$.isNumeric(point)){
        toastr['error']('점수는 숫자만 입력하세요');
        return false;
    }
    if(reason.length >= 100){
        toastr['error']('사유는 100자 이하로 입력하세요');
        return false;
    }
    if($('#m_userTable_body tr.warning').length === 0){
        toastr['error']('회원을 선택해주세요');
        return false;
    }
    return true;
}

function sort_period(){
    $('button#sort_period').unbind().click(function(){
        sort_flag = 'period';
        getUserlist();
    });
}

function sort_mileage(){
    $('button#sort_mileage').unbind().click(function(){
        sort_flag = 'mileage';
        getUserlist();
    });
}

function enrollButton(datalist){
    $('button#enroll').unbind().click(function(){

        var userIdlist = '';

        if(checkValid()){

            $('#m_userTable_body tr').each(function(index){
                if($(this).hasClass('warning')){
                    userIdlist += datalist[index].u_id + ',';
                }
            });
            userIdlist = userIdlist.substring(0, userIdlist.length -1);

            var sendData = {
                classify: $('#plusMinus').val(),
                userIdlist: userIdlist,
                point: $('input#point').val(),
                reason: $('input#reason').val()
            };

            $.post('/user/mileage_enroll', sendData, function(response){
                if(response === 'success'){
                    toastr['success']('마일리지 등록 성공');
                    getUserlist();
                }else{
                    toastr['error']('등록 실패');
                }
            });


        }
    });
}


function getmileageHistory(){
    $.post('/user/mileage_history', function(datalist){
        historyView(datalist);
        $('#m_historyTable tr').unbind().click(function(){
            $(this).toggleClass('warning');
        });
        deleteButton(datalist);
    });
}

function historyView(datalist){
    var htmlString = '';
    $.each(datalist[0], function(idx, data){
        htmlString += '<tr><td>' + data.m_date + '</td>';
        htmlString += '<td>' + data.u_name + '</td>';
        htmlString += '<td>' + datalist[1][idx].u_name + '</td>';
        if(data.m_type === 'PLUS')  htmlString += '<td style="color:blue">' + data.m_type + '</td>';
        else    htmlString += '<td style="color:red">' + data.m_type + '</td>';
        htmlString += '<td>' + data.m_point + '</td></tr>';
    });
    $('#m_historyTable').html(htmlString);
}

function deleteButton(datalist){
    $('button#delete').unbind().click(function(){
        if($('#m_historyTable tr.warning').length === 0){
            toastr['error']('항목을 선택해주세요');
        }else{
            var deletelist = new Array();

            $('#m_historyTable tr').each(function(index){
                if($(this).hasClass('warning')){
                    var data = {
                        deleteId: datalist[0][index].m_id,
                        receiver: datalist[0][index].m_receiver,
                        point: datalist[0][index].m_point,
                        type: datalist[0][index].m_type
                    };
                    deletelist.push(data);
                }
            });

            var tempData = JSON.stringify(deletelist);
            console.log(tempData);
            $.ajax({
                type:'post',
                url:'/user/mileage_delete',
                data: tempData,
                contentType:'application/json',
                success: function(data){
                    if(data === 'success'){
                        toastr['success']('마일리지 히스토리 삭제성공');
                        getmileageHistory();
                    }else{
                        toastr['error']('하드웨어 신청 실패');
                    }
                }

            });
        }
    });
}