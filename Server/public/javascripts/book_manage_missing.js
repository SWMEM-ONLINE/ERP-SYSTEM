/**
 * Created by jung-inchul on 2015. 12. 23..
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

loadmissingBook();

function loadmissingBook(){
    var htmlString = '<thead><tr><th>신고자</th><th>도서</th><th>신고일</th></tr></thead>';
    htmlString += '<tfoot><tr><td colspan="3"><button type="button" id="reenroll" class="btn btn-danger"> 복구하기 </button></td></tr></tfoot><tbody id="tData">';

    $.post('/book/manage/loadmissingBook', function(datalist){
        $.each(datalist, function(idx, data){
            htmlString += '<tr><td>' + data.u_name + '</td><td>' + data.b_name + ' ( ' + data.b_publisher + ', ' + data.b_author + ')</td><td>' + data.brl_loss_date + '</td></tr>';
        });
        htmlString += '</tbody>';
        $('#missingbookTable').html(htmlString);
        $('#tData tr').click(function(){
            $(this).toggleClass('warning');
        });

        reenrollButton(datalist);
    });
}

function reenrollButton(datalist){
    $('button#reenroll').unbind().click(function() {
        var cnt_notmissing = 0;
        var enrollList = '';

        if ($('#tData tr.warning').length === 0) {
            toastr['error']('항목이 선택되지 않았습니다');
            return;
        }
        $('#tData tr.warning').each(function (index) {
            if (datalist[index].b_state != 3) {
                cnt_notmissing++;
            }
            enrollList += datalist[index].brl_book_id + ',';
        });

        enrollList = enrollList.substring(0, enrollList.length -1);
        $.post('/book/manage/reenroll', {enrollList: enrollList}, function(response){
            if(response=== 'success')   toastr['success']('재등록 성공');
            else    toastr['error']('재등록 실패');

        });
    });
}