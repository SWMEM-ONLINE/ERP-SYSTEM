/**
 * Created by jung-inchul on 2015. 12. 17..
 */

$('ul.nav-pills li').unbind().click(function(){
    var index = $(this).index();
    $('ul.nav-pills li').removeClass('active');
    $(this).addClass('active');
    if(index === 0) {
        $('table#nowhistoryTable').removeClass('hidden');
        $('table#pasthistoryTable').addClass('hidden');
        loadnowHistory();
    }else if(index === 1){
        $('table#nowhistoryTable').addClass('hidden');
        $('table#pasthistoryTable').removeClass('hidden');
        loadpastHistory();
    }
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
    var htmlString = '<thead><tr><th>이름</th><th>하드웨어 이름</th><th>대여일자</th><th>반납일자</th></tr></thead><tbody>';
    $.post('/hardware/manage/loadPast', function(response){
        $.each(response, function(idx, data){
            htmlString += '<tr><td>' + data.u_name + '</td><td>' + data.h_name + '</td><td>' + data.ht_rental_date + '</td><td>' + data.ht_return_date + '</td></tr>';
        });
        htmlString += '</tbody>';
        $('#pasthistoryTable').html(htmlString);
    });
}