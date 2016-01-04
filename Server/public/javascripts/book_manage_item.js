/**
 * Created by jung-inchul on 2015. 12. 29..
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

var flag_category = 0;                                                  // This variable means index of category which user selected
var category = ['b_name', 'b_author', 'b_publisher'];                   // Dropdown contents
var flag = 0;

$('ul.nav-pills li').click(function(){
    var index = $(this).index();
    $('ul.nav-pills li').removeClass('active');
    $(this).addClass('active');
    if(index === 1) flag = 1;
    else flag = 0;
    loadbooklist(index);
});

loadbooklist(0);

$('#categoryDropdown li a').click(function(){
    $('#seriesDropdown').on("hide.bs.dropdown");
    $('#bookSearchCategory').html($(this).html());
    flag_category = $(this).parent().index();
});

$('#bookSearchWords').keydown(function(){
    if(event.keyCode == 13){                                            // 'keycode==13' means Enter
        event.preventDefault();
        $('#bookSearchBtn').trigger('click');                           // Force to event to click if user push Enter
        return false;
    }
});

$('#bookSearchBtn').click(function() {
    var searchWords = $('#bookSearchWords').val();                  // Get typing data in textbox
    if (searchWords.length == 0) {                                  // type nothing situation
        toastr['error']('검색어를 입력해주세요');
        return false;
    }else{
        $.post('/book/searchBook', {category : category[flag_category], searchWords : searchWords, flag : (flag === 0 ? 'tech' : 'humanities')}, function(datalist){
            console.log(datalist);
            settingHTML(datalist);
            resetlocationButton(datalist);
        });
    }
});

function loadbooklist(select){
    $.post('/book/manage/loadbooklist', {flag: select}, function(datalist){
        settingHTML(datalist);
        resetlocationButton(datalist, select);
    });
}

function settingHTML(datalist){
    var htmlString = '<tfoot><tr><th colspan="2"><button type="button" id="resetLocation">위치변경</button></th></tr></tfoot>';
    htmlString += '<span class="pull-right"> </span></th></tr></tfoot>';
    htmlString += '<tbody id="booklistData">';
    $.each(datalist, function(idx, data){
        htmlString += '<tr><td><img class="bookImg" src="' + data.b_photo_url + '"</td>';
        htmlString += '<td><h4 class="bookTitle">' + data.b_name;
        htmlString += '</h4>';
        if(data.b_state === 1) htmlString += '<p class="label label-warning">' + data.b_rental_username + '님이 대여중</p>';
        htmlString += '<p>' + data.b_author + ' | ' + data.b_publisher + '</p></tr>';
    });
    htmlString += '</tbody>';
    $('table#booklist').html(htmlString);
    $('table tbody#booklistData tr').click(function(){
        $(this).toggleClass('warning');
    });
}

function resetlocationButton(datalist){
    $('button#resetLocation').unbind().click(function(){
        if($('table tbody#booklistData tr.warning').length === 0) {
            toastr['error']('도서를 선택해주세요');
            return;
        }
        makelocationData();
        resetButton(datalist);
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
        modalString += '<td style="font-size:15px"><input type="radio" name="location" value="' + key + '">';
        if(divide % 2 === 0){
            modalString += '  ' + '<span class="label label-warning col-xs"> ' + key + '</span>' + '  ' + value + '</td>';
        }else{
            modalString += '  ' + '<span class="label label-info"> ' + key + '</span>' + '  ' + value + '</td>';
        }
    });
    modalString += '</tr>';
    $('div.modal-body').html(modalString);
    $('div.modal').modal();
}

function resetButton(datalist){
    $('button#resetButton').unbind().click(function(){
        if($('input:radio[name="location"]:radio:checked').length === 0){
            toastr['error']('위치를 선택해주세요');
            return;
        }
        var resetIdlist = '';
        $('#booklistData tr.warning').each(function(){
            var idx = $(this).index();
            resetIdlist += datalist[idx].b_id + ',';
        });
        resetIdlist = resetIdlist.substring(0, resetIdlist.length -1);
        $.post('/book/manage/resetbookLocation', {location : $('input:radio[name="location"]:checked').val(), resetIdlist : resetIdlist},function(response){
            if(response === 'success')   toastr['success']('도서위치 변경성공');
            else    toastr['error']('도서위치 변경실패');
        });
        $('div.modal').modal('hide');
        loadbooklist(flag);
        //window.location.reload();
    });
}