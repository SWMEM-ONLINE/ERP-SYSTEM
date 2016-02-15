/**
 * Created by jung-inchul on 2015. 12. 17..
 */
var select_year = new Date().getFullYear();
var select_month = new Date().getMonth()+1;

$('ul.nav-pills li').unbind().click(function(){
    var index = $(this).index();
    $('ul.nav-pills li').removeClass('active');
    $(this).addClass('active');
    if(index === 0) {
        $('table#nowhistoryTable').removeClass('hidden');
        $('table#pasthistoryTable').addClass('hidden');
        $('#monthpicker').addClass('hidden');
        loadnowHistory();
    }else if(index === 1){
        $('table#nowhistoryTable').addClass('hidden');
        $('table#pasthistoryTable').removeClass('hidden');
        $('#monthpicker').removeClass('hidden');
        loadpastHistory();
    }
});

$('.datepicker').val(select_year+"년 "+ select_month+"월");

$('.datepicker').datepicker({
    format: "yyyy년 m월",
    minViewMode: 1,
    keyboardNavigation : false,
    todayHighlight: true,
    startView: 1,
    autoclose: true
});

$('.datepicker').on('changeDate',function(event){
    select_year = event.date.getFullYear();
    select_month = event.date.getMonth() + 1;
    loadpastHistory();
});

loadnowHistory();

function loadnowHistory(){
    var htmlString = '<thead><tr><th>이름</th><th>하드웨어 이름</th><th>대여일자</th><th>반납일자</th></tr></thead><tbody>';
    $.post('/hardware/manage/loadNow', function(response){
        $.each(response, function(idx, data){
            htmlString += '<tr><td>' + data.u_name + '</td><td>' + data.h_name + '</td><td>' + data.hr_rental_date + '</td><td>' + data.hr_due_date + '</td></tr>';
        });
        htmlString += '</tbody>';
        $('#nowhistoryTable').html(htmlString);
    });
}

function loadpastHistory(){
    var sendData = {};

    sendData.year = select_year;
    sendData.month = select_month;

    var htmlString = '<thead><tr><th>이름</th><th>하드웨어 이름</th><th>대여일자</th><th>반납일자</th></tr></thead><tbody>';
    $.post('/hardware/manage/loadPast', sendData, function(response){
        $.each(response, function(idx, data){
            htmlString += '<tr><td>' + data.u_name + '</td><td>' + data.h_name + '</td><td>' + data.ht_rental_date + '</td><td>' + data.ht_return_date + '</td></tr>';
        });
        htmlString += '</tbody>';
        $('#pasthistoryTable').html(htmlString);
    });
}