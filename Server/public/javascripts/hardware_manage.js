/**
 * Created by jung-inchul on 2015. 12. 16..
 */

var rowCount = 1;

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

$('ul.nav-pills li').click(function(){
    var index = $(this).index();
    $('ul.nav-pills li').removeClass('active');
    $(this).addClass('active');
    if(index === 0) {
        $('div#addhardwareForm').removeClass('hidden');
        $('table#alterhardwareTable').addClass('hidden');
        addHardware();
    }else if(index === 1){
        $('div#addhardwareForm').addClass('hidden');
        $('table#alterhardwareTable').removeClass('hidden');
        alterHardware();
    }
});

function addList() {
    var table = document.getElementById('addhardwareTable');
    var lastRow = table.rows.length;
    var newRow = table.insertRow(lastRow);
    var name = newRow.insertCell(0);
    var amount = newRow.insertCell(1);
    var serial = newRow.insertCell(2);
    var btn = newRow.insertCell(3);


    var str0 = '<input id="add_hardwareName' + rowCount + '" type="text" placeholder="ex) Galaxy Gear S2">';
    var str1 = '<input id="add_hardwareAmount'+ rowCount + '" type="text" placeholder="ex) 3">';
    var str2 = '<input id="add_hardwareSerial' + rowCount + '" type="text" placeholder="ex)SWMEM-8F-LAONJENA">';
    var str3 = '<button id="plus" type="button" onclick="addList()" class="plusminus">+</button>';
    name.innerHTML = str0;
    amount.innerHTML = str1;
    serial.innerHTML = str2;
    btn.innerHTML = str3;

    var Allrows = document.getElementById('addhardwareTable').rows;
    Allrows[lastRow-1].deleteCell(3);
    var changedRow = Allrows[lastRow-1].insertCell(3);
    changedRow.innerHTML = '<button id="minus" type="button" onclick="deleteRow(this)" class="plusminus">－</button>';

    rowCount = rowCount + 1;
}

function deleteRow(obj){
    var tr = obj.parentNode.parentNode;
    var index = tr.rowIndex;
    var table = document.getElementById('addhardwareTable');
    table.deleteRow(index);
}

addHardware();

function addHardware(){
    $('button#enroll').unbind().click(function(){
        var name;
        var amount;
        var serial;

        var dataGroup = new Array();
        for(var i = 0; i < rowCount; i++){
            name = $('#add_hardwareName'+i).val();
            amount = $('#add_hardwareAmount'+i).val();
            serial = $('#add_hardwareSerial'+i).val();

            if(name.length >= 100){
                toastr['error']('하드웨어 이름은 100자 이내여야 합니다');
                return;
            }
            if(!($.isNumeric(amount))){
                toastr['error']('수량은 숫자만 기입하세요');
                return;
            }
            if(serial.length >= 100){
                toastr['error']('시리얼넘버는 100자 이하여야합니다');
                return;
            }
            var data ={
                name: name,
                amount: amount,
                serial: serial
            };
            dataGroup.push(data)
        }
        var jsonData = JSON.stringify(dataGroup);
        $.ajax({
            type:'post',
            url:'/hardware/manage/enroll',
            data:jsonData,
            contentType:'application/json',
            success: function(data){
                if(data === 'success') {
                    toastr['success']('성공');
                    for(var i=1;i<=rowCount;i++){
                        document.getElementById('addhardwareTable').deleteRow(1);
                    }
                    rowCount = 0;
                    addList();
                }
            }
        });
    });
}

function alterHardware(){
    $.post('/hardware/manage/alter', function(datalist){
        var htmlString = '<thead><tr><th>이름</th><th>총 갯수</th><th>남은 갯수</th><th>시리얼넘버</th></tr></thead><tbody>';
        $.each(datalist, function(idx, data){
            htmlString += '<tr><td>' + data.h_name + '</td>';
            htmlString += '<td>' + data.h_total + '</td>';
            htmlString += '<td>' + data.h_remaining + '</td>';
            htmlString += '<td>' + data.h_serial + '</td>';
        });
        htmlString += '</tbody>';
        $('#alterhardwareTable').html(htmlString);
        clickHardware(datalist);
    });
}

function clickHardware(datalist){
    $('tr').click.(function(){
        var index = $(this).index();
        var modalString = '';
        modalString += '';
    });

    $('tr').click(function() {
        var index = $(this).index();
        var string = '';
        string += '<img class="bookLargeImg" src="' + datalist[index].b_photo_url + '"/>';
        string += '<h4 class="bookTitle">' + datalist[index].b_name + '&nbsp<span class="label label-info">' + datalist[index].b_location + '</span>&nbsp<span class="label label-default">총 ' + datalist[index].b_total + '권</span></h4>';
        string += '<p>' + '저자 : ' + datalist[index].b_author + '</p><p>출판사 : ' + datalist[index].b_publisher + '</p>';
        if(datalist[index].b_state === 1)   string += '<p>반납예정일 : ' + datalist[index].b_due_date + '&nbsp&nbsp|&nbsp&nbsp대여자 : '+datalist[index].b_rental_username + '</p>';
        if(datalist[index].b_reserved_cnt != 0) string += '<p>예약자 : ' + datalist[index].b_reserved_cnt + '명</p>';
        if(datalist[index].b_state != 0){                               // Add disabled class to request button not in waiting state
            $('#request').addClass('disabled');
            $('#request').text('대여불가');
        }else{
            $('#request').removeClass('disabled');
            $('#request').text('대여');
        }
        $('div.modal-body').html(string);

        $('button#request').unbind().click(function(){                  // Request button to borrow book.
            if(datalist[index].b_state === 0){
                $.post("/book/borrowBook", {book_id : datalist[index].b_id}, function (data) {
                    if(data === 'failed')   toastr['error']('책 대여 실패');
                    else    toastr['info']('책 대여 성공');
                });
                $('div.modal').modal('hide');
                window.location.reload();
            }
        });
        $('button#reserve').unbind().click(function(){                  // Reserve button to reserve book.
            $.post("/book/reserveBook", {book_id : datalist[index].b_id, reserve_cnt: datalist[index].b_reserved_cnt}, function (data) {
                $('div.modal').modal('hide');
                if(data === 'failed'){
                    toastr['error']('이미 대여했거나 예약중이시므로, 추가예약이 불가능합니다.');
                }else{
                    toastr['info']('책 예약 성공');
                }
            });
            //window.location.reload();
        });
        $('button#missing').unbind().click(function(){                  // Missing button to enroll missingbook list.
            $.post("/book/missingBook", {book_id : datalist[index].b_id}, function (data) {
                toastr['info']('분실도서 등록 완료');
            });
            $('div.modal').modal('hide');
            window.location.reload();
        });
        $('div.modal').modal();
    });
}