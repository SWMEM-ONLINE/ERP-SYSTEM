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
    }else{
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
    var str1 = '<input id="add_hardwareAmount'+ rowCount + '" type="number" value="1" min="1">';
    var str2 = '<input id="add_hardwareSerial' + rowCount + '" type="text" placeholder="ex)SWMEM-8F-LAONJENA">';
    var str3 = '<button id="plus" class="btn" type="button" onclick="addList()">+</button>';
    name.innerHTML = str0;
    amount.innerHTML = str1;
    serial.innerHTML = str2;
    btn.innerHTML = str3;

    var Allrows = document.getElementById('addhardwareTable').rows;
    Allrows[lastRow-1].deleteCell(3);
    var changedRow = Allrows[lastRow-1].insertCell(3);
    changedRow.innerHTML = '<button id="minus" class="btn cancel" type="button" onclick="deleteRow(this)">-</button>';

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

            if(name.length >= 100 || name.length == 0){
                toastr['error']('하드웨어 이름은 100자 이내여야 합니다');
                return;
            }
            if(!($.isNumeric(amount))){
                toastr['error']('수량은 숫자만 기입하세요');
                return;
            }
            if(serial.length >= 100 || serial.length == 0){
                toastr['error']('시리얼넘버는 100자 이하여야합니다');
                return;
            }
            var data = {
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
                    window.location.reload();
                    //for(var i=1;i<rowCount;i++){
                    //    document.getElementById('addhardwareTable').deleteRow(1);
                    //}
                    //$('#add_hardwareName'+(rowCount-1)).val('');
                    //$('#add_hardwareAmount'+(rowCount-1)).val('1');
                    //$('#add_hardwareSerial'+(rowCount-1)).val('');
                    //rowCount = 2;
                }
            }
        });
    });
}

function alterHardware(){
    $.post('/hardware/loadHardwarelist', function(datalist){
        var htmlString = '<thead><tr class="empty"><th>이름</th><th>총갯수</th><th>대여</th><th>시리얼넘버</th></tr></thead><tbody>';
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
    $('table#alterhardwareTable tr:not(.empty)').unbind().click(function(){
        var index = $(this).index();
        var modalString = '';
        modalString += '<table class="table table-striped">';
        modalString += '<tr><td>하드웨어 이름</td><td><input type="text" id="hardwareName" value="' + datalist[index].h_name + '"></td></tr>';
        modalString += '<tr><td>총 수량</td><td><input type="number" id="hardwareTotal" value="' + datalist[index].h_total + '" min="0"></td></tr>';
        modalString += '<tr><td>남은 수량</td><td><input type="number" id="hardwareRemaining" value="' + datalist[index].h_remaining + '" min="0"></td></tr>';
        modalString += '<tr><td>시리얼번호</td><td><input type="text" id="hardwareSerial" value="' + datalist[index].h_serial + '"></td></tr></table>';
        $('div.modal-body').html(modalString);
        $('div.modal').modal();

        $('button#alterButton').unbind().click(function(){
            var n1 = $('#hardwareTotal').val();
            var n2 = $('#hardwareRemaining').val();
            if(n2 > n1){
                toastr['error']('남은 갯수는 총 갯수를 초과할 수 없습니다');
            }else{
                var alterData = {
                    id : datalist[index].h_id,
                    name : $('#hardwareName').val(),
                    total : n1,
                    remaining : n2,
                    serial : $('#hardwareSerial').val()
                };
                $.post('/hardware/manage/alter', alterData, function(response){
                    if(response === 'success'){
                        toastr['success']('변경 성공');
                    }
                    else{
                        toastr['error']('변경 실패');
                    }
                    alterHardware();
                    $('div.modal').modal('hide');
                });
            }
        });
        $('button#deleteButton').unbind().click(function(){
            $.post('/hardware/manage/delete', {hardware_id : datalist[index].h_id}, function(response){
                if(response === 'success'){
                    toastr['success']('삭제 성공');
                }
                else{
                    toastr['error']('삭제 실패');
                }
                alterHardware();
                $('div.modal').modal('hide');
            });
        });
    });
}