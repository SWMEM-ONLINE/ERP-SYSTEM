/**
 * Created by jung-inchul on 2015. 12. 17..
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

var temp = 0;

$('ul.nav-pills li').click(function(){
    var index = $(this).index();
    $('ul.nav-pills li').removeClass('active');
    $(this).addClass('active');
    temp = index;
    loadRequest(index);
});

loadRequest(0);                 // 모든 것 통합본 때려버려, 형태도 0, 1, 2는 같고 3만 다르게.

function loadRequest(flag){
    if(flag != 3){
        $.post('/hardware/manage/loadRequest', {kind : flag}, function(datalist){
            setTable(datalist, flag);
            $('#tableData tr').click(function(){
                $(this).toggleClass('warning');
            });
            approveButton(datalist, flag);
            rejectButton(datalist, flag);
        });
    }else{
        $.post('/hardware/manage/loadApply', function(datalist){
            setTable(datalist, flag);
            detailButton(datalist);
            $('#tableData tr').click(function(){
                $(this).toggleClass('warning');
                $('#temp').text(calSum(datalist) + '원');
            });
            approveButton(datalist, flag);
            rejectButton(datalist, flag);
        });
    }
}

function setTable(datalist, flag){                //  html 테이블 만들기
    var htmlString;
    if(flag != 3){
        htmlString = '<thead><tr><th>신청자</th><th>하드웨어 이름</th><th>신청일</th><th>처리상태</th></tr></thead>';
        htmlString += '<tfoot><tr><th colspan="4"><button type="button" id="approve" class="btn btn-primary">승인</button><button type="button" id="reject" class="btn btn-danger">미승인</button></th></tr></tfoot>';
        htmlString += '<tbody id="tableData">';
        $.each(datalist, function(idx, data){
            htmlString += '<tr><td>' + data.u_name + '</td><td>' + data.h_name + '</td><td>' + data.hw_request_date + '</td><td>';
            switch(data.hw_result){
                case 0:
                    htmlString += '<span class="label label-warning"> 대기중 </span></td></tr>';
                    break;
                case 1:
                    htmlString += '<span class="label label-primary"> 승인 </span></td></tr>';
                    break;
                default:
                    htmlString += '<span class="label label-danger"> 미승인 </span></td></tr>';
            }
        });
        htmlString += '</tbody>';
    }else{
        htmlString = '<thead><tr><th>신청자</th><th>프로젝트 이름</th><th>처리상태</th><th>자세히</th></tr></thead>';
        htmlString += '<tfoot><tr><th colspan="4"><button type="button" id="approve" class="btn btn-primary">승인</button><button type="button" id="reject" class="btn btn-danger">미승인</button><button type="button" id="down2excel" class="btn btn-info">엑셀로 다운</button><span id="temp" class="pull-right">0 원</span></th></tr></tfoot>';
        htmlString += '<tbody id="tableData">';
        $.each(datalist, function(idx, data){
            htmlString += '<tr><td>' + data.u_name + '</td><td>' + data.ha_project_title + '</td><td>';
            if(data.ha_result === 0) {
                htmlString += '<span class="label label-warning"> 대기중 </span></td>';
            }else {
                htmlString += '<span class="label label-primary"> 처리완료 </span></td>';
            }
            htmlString += '<td><button type="button" id="detail" class="btn btn-xs btn-info">More</button></td></tr>';
        });
        htmlString += '</tbody>';
    }
    $('#requestTable').html(htmlString);
}

function calSum(datalist){
    var sum = 0;
    $('#tableData tr').each(function(index){
        if($(this).hasClass('warning')){
            sum += datalist[index].ha_total;
        }
    });
    return sum;
}

function approveButton(datalist, flag){           // 승인 버튼
    $('button#approve').unbind().click(function(){
        var approveIdlist = '';
        var hardwareIdlist = '';
        var userIdlist = '';
        var rentalIdlist = '';
        var cnt_notWaiting = 0;

        if($('#tableData tr.warning').length === 0){
            toastr['error']('항목이 선택되지 않았습니다');
            return;
        }
        $('#tableData tr.warning').each(function(){
            var index = $(this).index();
            if(flag === 3){
                if(datalist[index].ha_result != 0){
                    cnt_notWaiting++;
                }
            }else{
                if(datalist[index].hw_result != 0){
                    cnt_notWaiting++;
                }
            }
        });

        if(cnt_notWaiting > 0){
            toastr['error']('처리된 건은 수정할 수 없습니다');
            return;
        }

        if(flag != 3){
            $('#tableData tr').each(function(index){
                if($(this).hasClass('warning')){
                    approveIdlist += datalist[index].hw_id + ',';
                    hardwareIdlist += datalist[index].hw_hardware_id + ',';
                    userIdlist += datalist[index].hw_user + ',';
                    rentalIdlist += datalist[index].hw_rental_id + ',';
                }
            });
            approveIdlist = approveIdlist.substring(0, approveIdlist.length -1);
            hardwareIdlist = hardwareIdlist.substring(0, hardwareIdlist.length -1);
            rentalIdlist = rentalIdlist.substring(0, rentalIdlist.length -1);
            userIdlist = userIdlist.substring(0, userIdlist.length -1);
        }else{
            $('#tableData tr').each(function(index){
                if($(this).hasClass('warning')){
                    approveIdlist += datalist[index].ha_id + ',';
                }
            });
            approveIdlist = approveIdlist.substring(0, approveIdlist.length -1);
        }
        $.post('/hardware/manage/approveRequest', {type: flag, approveIdlist: approveIdlist, hardwareIdlist: hardwareIdlist, userIdlist: userIdlist, rentalIdlist: rentalIdlist}, function(response){
            if(response === 'success')   toastr['success']('승인처리 완료');
            else    toastr['error']('승인처리 실패');
            loadRequest(temp);
        });
    });
}

function rejectButton(datalist, flag){            // 거절 버튼
    $('button#reject').unbind().click(function(){
        var rejectlist = '';

        if($('#tableData tr.warning').length === 0){
            toastr['error']('항목이 선택되지 않았습니다');
            return;
        }
        $('#tableData tr').each(function(index){
            if($(this).hasClass('warning')){
                rejectlist += datalist[index].hw_id + ',';
            }
        });
        rejectlist = rejectlist.substring(0, rejectlist.length-1);
        $.post('/hardware/manage/rejectRequest', {type: flag, rejectlist: rejectlist}, function(response){
            if(response === 'success')   toastr['success']('미승인처리 완료');
            else    toastr['error']('미승인처리 실패');
            loadRequest(temp);
        });
    });
}

// 이 함수는 고쳐야 한다.
function detailButton(datalist){            // 자세히 보기 버튼
    $('button#detail').each(function(index){
        $(this).unbind().click(function(){
            var string = '<table class="table table-striped table-bordered">';
            string += '<tr class="warning"><th colspan="4">' + datalist[index].ha_item_name + '</th></tr>';
            string += '<tr><td colspan="4">' + datalist[index].ha_project_title + '</td></tr>';
            string += '<tr><td>분류</td><td>' + datalist[index].ha_upper_category + '</td><td>품목</td><td>' + datalist[index].ha_lower_category + '</td></tr>';
            string += '<tr><td>규격</td><td>' + datalist[index].ha_size + '</td><td>수량</td><td>' + datalist[index].ha_amount + '</td></tr>';
            string += '<tr><td>Maker</td><td>' + datalist[index].ha_maker + '</td><td>신청자</td><td>' + datalist[index].u_name + '</td></tr>';
            string += '<tr><td colspan="4"><a href="' +datalist[index].ha_url + '" target="_blank" style="color:blue">URL 이동</a></td></tr>';
            $('div.modal-body').html(string);
            $('div.modal').modal();
        });
    });
}

function saveExcelButton(){         // 엑셀로 저장 버튼

}