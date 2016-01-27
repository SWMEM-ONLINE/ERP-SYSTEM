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

$.ig.loader({
    scriptPath: "http://cdn-na.infragistics.com/igniteui/2015.2/latest/js/",
    cssPath: "http://cdn-na.infragistics.com/igniteui/2015.2/latest/css/",
    resources: 'modules/infragistics.util.js,' +
    'igGrid,' +
    'modules/infragistics.documents.core.js,' +
    'modules/infragistics.excel.js,' +
    'modules/infragistics.gridexcelexporter.js'
});

var book_category = {
    'A-1' : 'Null',
    'A-2' : 'UML',
    'A-3' : '자바 디자인 패턴/리팩토링',
    'A-4' : '워드프레스',
    'A-5' : 'Code/Agile',
    'A-6' : 'SW Architecture',
    'A-7' : 'SW Architecture',
    'A-8' : 'OPIc',
    'A-9' : 'SW Architecture',

    'B-1' : 'DirectX/OpenGL',
    'B-2' : '3D Game',
    'B-3' : '물리',
    'B-4' : 'Unity 3D',
    'B-5' : '영상처리',
    'B-6' : '이클립스/Subversion/컴파일러/Git',
    'B-7' : 'Data Mining',
    'B-8' : '프로그래밍 관련',

    'C-1' : 'WPF/UX',
    'C-2' : 'UI/Design',
    'C-3' : '3ds MAX/Design',

    'D-1' : '컴퓨터 구조',
    'D-2' : 'MicroC / OS / 디지털시스템',
    'D-3' : 'AVR',
    'D-4' : '아두이노',
    'D-5' : 'ARM/임베디드/라즈베리파이',
    'D-6' : 'Matlab/Labview/PSPice/inventor',
    'D-7' : 'VHDL/로봇',
    'D-8' : '언어',
    'D-9' : '신호/전자회로/USB',

    'E-1' : 'Window OS',
    'E-2' : 'TCP/IP',
    'E-3' : '리눅스 명령어',
    'E-4' : '윈도우 CE/윈도우 디바이스 드라이버',
    'E-5' : 'RedHat/페도라/Ubuntu',
    'E-6' : '리눅스 서버',
    'E-7' : '임베디드 리눅스',
    'E-8' : '리눅스 OS/리눅스 커널',
    'E-9' : 'Unix',
    'E-10' : '리눅스 API',
    'E-11' : '리눅스 활용',

    'F-1' : 'EJB',
    'F-2' : '액션스크립트',
    'F-3' : 'CSS/Node.js',
    'F-4' : 'HTML/자바스크립트',
    'F-5' : 'PHP/JSP',
    'F-6' : 'Ajax',
    'F-7' : '스프링/jQuery',
    'F-8' : 'XML',
    'F-9' : 'Adobe Air/플래시',
    'F-10' : '실버라이트/Adobe Flex',
    'F-11' : '웹 관련',

    'G-1' : 'ASP.NET',
    'G-2' : '닷넷',
    'G-3' : 'C',
    'G-4' : '자료구조/다이나믹 프로그래밍',
    'G-5' : '알고리즘',
    'G-6' : 'C++/C#',
    'G-7' : 'Java',
    'G-8' : '루비/얼랭/펄/루아/파이썬',
    'G-9' : '리스프 프로그래밍',
    'G-10' : 'API/MFC',

    'H-1' : '하둡/클라우드',
    'H-2' : 'SQL/DB',
    'H-3' : '안드로이드',
    'H-4' : '카산드라',
    'H-5' : '오라클 DB',
    'H-6' : '안드로이드',
    'H-7' : '아이폰',
    'H-8' : '스마트 TV',
    'H-9' : '기타도서',

    'I-1' : '보안/해킹',
    'I-2' : '보안/해킹',
    'I-3' : '와이어샤크',
    'I-4' : '인터넷/네트워크',
    'I-5' : '인터넷/네트워크',
    'I-6' : '웹앱/폰갭',
    'I-7' : '엑셀/프레젠테이션',
    'I-8' : '기타도서',
    'I-9' : '기타도서',

    'J-1' : '인문학도서',
    'J-2' : '자기계발도서',
    'J-3' : '소설',
    'J-4' : '문학'
};


$('ul.nav-pills li').unbind().click(function(){
    var index = $(this).index();
    $('ul.nav-pills li').removeClass('active');
    $(this).addClass('active');
    loadapplylist(index);
});

loadapplylist(0);

function loadapplylist(flag){
    var htmlString = '';
    $.post('/book/manage/loadapplylist', {flag : flag}, function(datalist){
        htmlString += '<tfoot><tr><th colspan="2"><span id="checkSum" class="pull-right">0 원</span></th></tr><tr><th colspan="2"><button type="button" id="selectAllButton" class="btn">전체선택</button><button type="button" id="buyCompleteButton" class="btn">구매</button><button type="button" id="cancelBuying" class="btn">구매취소</button><button type="button" id="enrollButton" class="btn">도서등록</button><button type="button" id="down2excel" class="btn btn-danger">엑셀 저장</button></th></tr></tfoot>';
        htmlString += '<tbody id="applyTableData">';
        $.each(datalist, function(idx, data){
            htmlString += '<tr><td><img class="bookImg" src="' + data.ba_photo_url + '"</td>';
            htmlString += '<td><span class="label label-success">' + data.u_period + ' ' + data.u_name + '</span>';
            htmlString += '<p><h4 class="bookTitle">' + data.ba_name +'</h4>';
            if(data.ba_state === 1){
                htmlString += ' <span class="label label-danger">주문완료</span>';
            }
            htmlString += '<p>' + data.ba_author + ' | ' + data.ba_publisher + '</span>';
            if(data.ba_saleStatus === '판매중')    htmlString += '  ' + '<span class="label label-primary"> 판매중 </span></p></tr>';
            else    htmlString += '  ' + '<span class="label label-danger">' + data.ba_saleStatus + '</span></p></tr>';
        });
        htmlString += '</tbody>';
        $('table#applyTable').html(htmlString);

        $('table tbody#applyTableData tr').unbind().click(function(){
            $(this).toggleClass('warning');
            $('#checkSum').text(calSum(datalist) + '원');
        });
        selectAllButton(datalist);
        buyCompleteButton(datalist, flag);
        enrollButton(datalist);
        cancelBuyingButton(datalist, flag);
        down2excelButton(datalist);
    });
}

function down2excelButton(datalist){
    $('button#down2excel').unbind().click(function(){

        var workbook = new $.ig.excel.Workbook($.ig.excel.WorkbookFormat.excel2007);
        var sheet = workbook.worksheets().add('도서신청 목록');
        sheet.columns(0).setWidth(60, $.ig.excel.WorksheetColumnWidthUnit.pixel);
        sheet.columns(1).setWidth(500, $.ig.excel.WorksheetColumnWidthUnit.pixel);
        sheet.columns(2).setWidth(150, $.ig.excel.WorksheetColumnWidthUnit.pixel);
        sheet.columns(3).setWidth(150, $.ig.excel.WorksheetColumnWidthUnit.pixel);
        sheet.columns(4).setWidth(120, $.ig.excel.WorksheetColumnWidthUnit.pixel);
        sheet.columns(5).setWidth(120, $.ig.excel.WorksheetColumnWidthUnit.pixel);

        sheet.getCell('A1').value('No');
        sheet.getCell('A1').cellFormat().font().height(10*25);
        sheet.getCell('A1').cellFormat().alignment($.ig.excel.HorizontalCellAlignment.center);
        sheet.getCell('B1').value('도서명');
        sheet.getCell('B1').cellFormat().font().height(10*25);
        sheet.getCell('B1').cellFormat().alignment($.ig.excel.HorizontalCellAlignment.center);
        sheet.getCell('C1').value('출판사');
        sheet.getCell('C1').cellFormat().font().height(10*25);
        sheet.getCell('C1').cellFormat().alignment($.ig.excel.HorizontalCellAlignment.center);
        sheet.getCell('D1').value('저자');
        sheet.getCell('D1').cellFormat().font().height(10*25);
        sheet.getCell('D1').cellFormat().alignment($.ig.excel.HorizontalCellAlignment.center);
        sheet.getCell('E1').value('가격');
        sheet.getCell('E1').cellFormat().font().height(10*25);
        sheet.getCell('E1').cellFormat().alignment($.ig.excel.HorizontalCellAlignment.center);
        sheet.getCell('F1').value('신청자');
        sheet.getCell('F1').cellFormat().font().height(10*25);
        sheet.getCell('F1').cellFormat().alignment($.ig.excel.HorizontalCellAlignment.center);

        var cnt = ($('table tbody#applyTableData tr.warning').length + 1);
        var table = sheet.tables().add('A1:F' + cnt, true);

        table.style(workbook.standardTableStyles('TableStyleMedium2'));

        var i = 2;

        $('table tbody#applyTableData tr.warning').each(function(){
            var index = $(this).index();
            sheet.getCell('A' + i).value(i - 1);
            sheet.getCell('A' + i).cellFormat().alignment($.ig.excel.HorizontalCellAlignment.center);
            sheet.getCell('B' + i).value(datalist[index].ba_name);
            sheet.getCell('B' + i).cellFormat().alignment($.ig.excel.HorizontalCellAlignment.center);
            sheet.getCell('C' + i).value(datalist[index].ba_publisher);
            sheet.getCell('C' + i).cellFormat().alignment($.ig.excel.HorizontalCellAlignment.center);
            sheet.getCell('D' + i).value(datalist[index].ba_author);
            sheet.getCell('D' + i).cellFormat().alignment($.ig.excel.HorizontalCellAlignment.center);
            sheet.getCell('E' + i).value(datalist[index].ba_price);
            sheet.getCell('E' + i).cellFormat().alignment($.ig.excel.HorizontalCellAlignment.center);
            sheet.getCell('F' + i).value(datalist[index].u_period + ' ' + datalist[index].u_name);
            sheet.getCell('F' + i).cellFormat().alignment($.ig.excel.HorizontalCellAlignment.center);
            i++;
        });

        sheet.getCell('D'+ (i+2)).value('총액');
        sheet.getCell('D'+ (i+2)).cellFormat().font().height(14 * 20);
        sheet.getCell('D'+ (i+2)).cellFormat().font().bold(true);

        sheet.getCell('E'+ (i+2)).applyFormula('=SUM(E2:E'+cnt+')');
        sheet.getCell('E'+ (i+2)).cellFormat().font().height(14 * 20);
        sheet.getCell('E'+ (i+2)).cellFormat().font().bold(true);

        var today = new Date();
        var m = (today.getMonth() + 1);
        saveWorkbook(workbook, m + "월 신청도서.xlsx");
    });
}

function saveWorkbook(workbook, name) {
    workbook.save({ type: 'blob' }, function (data) {
        saveAs(data, name);
    }, function (error) {
        alert('Error exporting: : ' + error);
    });
}

function buyCompleteButton(datalist, flag){
    $('button#buyCompleteButton').unbind().click(function(){
        var buyIdlist = '';
        var type = 0;
        var n = 0;
        $('table tbody#applyTableData tr.warning').each(function(){
            n++;
            var idx = $(this).index();
            buyIdlist += datalist[idx].ba_id + ',';
            type = datalist[idx].ba_type;
        });
        if(n === 0){
            toastr['error']('도서를 선택해주세요');
            return;
        }else{
            buyIdlist = buyIdlist.substring(0, buyIdlist.length -1);
            $.post('/book/manage/buyComplete', {type : type, buyIdlist : buyIdlist}, function(response){
                if(response === 'success'){
                    toastr['success']('주문완료');
                }
                else{
                    toastr['error']('주문실패');
                }
            });
            $('div.modal').modal('hide');
            loadapplylist(flag);
        }
    });
}

function selectAllButton(datalist){
    $('button#selectAllButton').unbind().click(function(){
        if($('table tbody#applyTableData tr.warning').length != $('table tbody#applyTableData tr').length){
            $('table tbody#applyTableData tr').each(function(){
                $(this).addClass('warning');
            })
        }else{
            $('table tbody#applyTableData tr').each(function(){
                $(this).removeClass('warning');
            })
        }
        $('#checkSum').text(calSum(datalist) + '원');
    });
}

function enrollButton(datalist){
    $('button#enrollButton').unbind().click(function(){
        if($('table tbody#applyTableData tr.warning').length === 0){
            toastr['error']('도서를 선택해주세요');
            return;
        }
        var state = 0;
        $('#applyTableData tr.warning').each(function(){
            var idx = $(this).index();
            if(datalist[idx].ba_state === 0){
                state = 1;
            }
        });

        if(state === 1){
            toastr['error']('구매하지 않은 책은 등록이 불가능합니다');
            return;
        }else{
            makelocationData();
            registerButton(datalist);
        }
    });
}

function cancelBuyingButton(datalist, flag){
    $('button#cancelBuying').unbind().click(function(){
        var cancelIdlist = '';
        if($('table tbody#applyTableData tr.warning').length === 0){
            toastr['error']('도서를 선택해주세요');
            return;
        }
        $('table tbody#applyTableData tr.warning').each(function(){
            var idx = $(this).index();
            cancelIdlist += datalist[idx].ba_id + ',';
        });

        cancelIdlist = cancelIdlist.substring(0, cancelIdlist.length -1);


        $.post('/book/manage/cancelBuying', {cancelIdlist : cancelIdlist}, function(response){
            if(response === 'success'){
                toastr['success']('취소성공');
            }
            else{
                toastr['error']('취소실패');
            }
        });
        $('div.modal').modal('hide');
        loadapplylist(flag);
    });
}

function makelocationData(){
    var modalString = '<table class="table table-bordered" id="category">';
    var initial = 'A';
    var temp = 0;
    var divide = 0;
    $.each(book_category, function(key, value){
        if(key[0] != initial){
            divide++;
            modalString += '<td></td></tr><tr>';
            initial = key[0];
            temp = 0;
        }
        if(temp === 2){
            modalString += '</tr><tr>';
            temp = 0;
        }
        temp++;
        modalString += '<td><input type="radio" name="location" value="' + key + '">';
        if(divide % 2 === 0){
            modalString += '  ' + '<span class="label label-warning col-xs"> ' + key + '</span>' + '  ' + value + '</td>';
        }else{
            modalString += '  ' + '<span class="label label-info"> ' + key + '</span>' + '  ' + value + '</td></h6>';
        }
    });
    modalString += '</tr>';
    $('div.modal-body').html(modalString);
    $('div.modal').modal();
}

function registerButton(datalist){
    $('button#registerButton').unbind().click(function(){
        if($('input:radio[name="location"]:radio:checked').length === 0){
            toastr['error']('위치를 선택해주세요');
            return;
        }
        var registerIdlist = '';
        $('#applyTableData tr.warning').each(function(){
            var idx = $(this).index();
            registerIdlist += datalist[idx].ba_id + ',';
        });
        registerIdlist = registerIdlist.substring(0, registerIdlist.length -1);
        $.post('/book/manage/enrollBook', {location : $('input:radio[name="location"]:checked').val(), registerIdlist : registerIdlist},function(response){
            if(response === 'success'){
                toastr['success']('도서등록 성공');
            }
            else{
                toastr['error']('도서등록 실패');
            }
        });
        $('div.modal').modal('hide');
        window.location.reload();
    });
}

function calSum(datalist){
    var sum = 0;
    $('#applyTableData tr').each(function(){
        if($(this).hasClass('warning')){
            sum += datalist[$(this).index()].ba_price;
        }
    });
    return sum;
}