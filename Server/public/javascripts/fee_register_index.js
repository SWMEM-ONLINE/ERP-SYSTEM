/**
 * Created by KIMDONGWON on 2015-12-09.
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

function calendar(obj) {
    $(obj).datepicker({
        format : "yyyy/mm/dd",
        keyboardNavigation : false,
        todayHighlight : true,
        endDate: "+1d",
        autoclose : true
    }).datepicker("show");
}

function isNumberKey(obj) {
    e = window.event;
    if ((e.keyCode >= 48 && e.keyCode <= 57)
        || (e.keyCode >= 96 && e.keyCode <= 105) || e.keyCode == 8
        || e.keyCode == 46 || e.keyCode == 37 || e.keyCode == 39
        || e.keyCode == 35 || e.keyCode == 36 || e.keyCode == 9) {
        if (e.keyCode == 48 || e.keyCode == 96) {
            if (obj.value == "" || obj.value == "0") {
                e.returnValue = false;
            } else {
                return;
            }
        } else {
            return;
        }
    } else {
        e.returnValue = false;
    }
}

function addList() {
    var table = document.getElementById('addlist');
    var lastRow = table.rows.length;
    var newRow = table.insertRow(lastRow);
    var date = newRow.insertCell(0);
    var type = newRow.insertCell(1);
    var content = newRow.insertCell(2);
    var price = newRow.insertCell(3);
    var addBtn = newRow.insertCell(4);

    var str0 = '<input id="date_'+rowCount+'" type="text" placeholder="날짜" onclick="calendar(this)" class="datepicker" readonly="readonly">';
    date.innerHTML = str0;

    var str1 ='<div class="btn-group"><button id="type_'+rowCount+'" type="button" data-toggle="dropdown" class="btn btndropdown-toggle">구분</button><ul class="dropdown-menu"><li id="expense_'+rowCount+'" onclick="expense(this.id)"><a href="#">지출</a></li><li id="income_'+rowCount+'" onclick="income(this.id)"><a href="#">수입</a></li></ul></div>';
    type.innerHTML = str1;
    var str2 = '<input id="content_'+rowCount+'" type="text" placeholder="내역"/>';
    content.innerHTML = str2;
    var str3 = '<input id="price_' + rowCount + '" type="text" placeholder="숫자만 입력", maxlength="8", onkeydown="isNumberKey(this)"/>';
    price.innerHTML = str3;
    var str4 = '<button id="plus" class="btn" type="button" onclick="addList()">+</button>';
    addBtn.innerHTML = str4;

    var Allrows = document.getElementById('addlist').rows;
    Allrows[lastRow-1].deleteCell(4);
    var changedRow = Allrows[lastRow-1].insertCell(4);
    changedRow.innerHTML = '<button id="minus" class="btn cancel" type="button" onclick="deleteRow(this)">-</button>';

    rowCount = rowCount + 1;
}

function deleteRow(obj){
    var tr = obj.parentNode.parentNode;
    var index = tr.rowIndex;
    var table = document.getElementById('addlist');
    table.deleteRow(index);
}

function income(string){
    var income = string.substr(7);
    var type = 'button#type_'+income;
    var drop = '#'+string;
    $(type).html($(drop).children('a').html());
}

function expense(string){
    var expense = string.substr(8);
    var type = 'button#type_'+expense;
    var drop = '#'+string;
    $(type).html($(drop).children('a').html());
}

$('#submit').click(function(){
    var date ;
    var content;
    var price;
    var type;
    var count = 0;
    var how;
    var arr = new Array();
    var complete = true;
    for ( var i = 0; i < rowCount; i++) {
        date = $("#date_" + i).val();
        content = $('#content_' + i).val();
        price = $('#price_' + i).val();
        type = $('#type_'+i).html();
        /* check value */
        if(type != undefined){
            count++;
            if(type === '구분'){
                complete = false;
                break;
            }
            else{
                if(type === '지출' || type === '수입'){
                    if(type === '지출'){
                        how = 1;
                    }
                    else{
                        how = 0;
                    }
                    complete = true;
                }
                else{
                    complete = false;
                }
            }

            if (date == ""){
                complete = false;
                break;
            }
            else if (content == ""){
                complete = false;
                break;
            }
            else if (price == ""){
                complete = false;
                break;
            }

            var sData = {
                Date:date,
                Type:how,
                Content:content,
                Price:price
            };
            arr.push(sData);
        }
        if(!complete) break;
    }

    if(!complete){
        toastr['info']('입력을 확인하세요');
    }
    else{
        var temp = JSON.stringify(arr);

        $.ajax({
            type:'post',
            url:'/fee/register/add',
            data:temp,
            contentType:'application/json',
            success: function(data){
                if(data.status === '0'){
                    toastr['success']('성공');
                    for(var i=1;i<count;i++){
                        document.getElementById('addlist').deleteRow(1);
                    }
                    $('#date_'+(rowCount-1)).val('');
                    $('#content_'+(rowCount-1)).val('');
                    $('#price_'+(rowCount-1)).val('');
                    $('#type_'+(rowCount-1)).html('구분');
                }
            }
        });
    }
});

registerList();

function registerList(){
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth()+1;
    if(month < 10){
        month = '0' + month;
    }
    var date = year +'/'+month;
    var tbodyString = '';
    $.post('/fee/history',{date:date},function(response){
        var data = response.result;
        if(data.length == 0){
            tbodyString += '<tr class="empty"><td colspan = 4><h4>이번달 수입지출내역이 없습니다</h4></td></tr>';
        }
        else{
            for(var i=0;i<data.length;i++){
                tbodyString += '<tr>';
                tbodyString += '<td class="hidden">'+data[i].fm_id+'</td>';
                tbodyString += '<td>'+data[i].fm_date+'</td>';
                if(data[i].fm_money_type === 1){
                    tbodyString += '<td>지출</td>';
                }
                else{
                    tbodyString += '<td>수입</td>';
                }
                tbodyString += '<td>'+data[i].fm_money_content+'</td>';
                tbodyString += '<td>'+data[i].fm_price+'</td>';
                tbodyString += '</tr>';
            }
        }
        $('#registerList table tbody').empty();
        $('#registerList table tbody').append(tbodyString);
    });
}

$('#registerList').on('click','tr:not(.empty)',function(){
    var arr = new Array();
    $(this).children('td').map(function () {
        arr.push($(this).text());
    });
    document.getElementById('deleteHistory').setAttribute('id',arr[0]);
    $('div.modal #date').html(arr[1]);
    $('div.modal #type').html(arr[2]);
    $('div.modal #content').html(arr[3]);
    $('div.modal #price').html(arr[4]);
    $('div.modal').modal();
});

$('#deleteHistory').click(function(){
    var id = document.getElementById('deleteHistory').getAttribute('id');
    /*
    $.post('/fee/history',{date:date},function(response){
        if(respone.status == '0'){
            toastr['success']('기록 삭제');
            registerList();
        }
    });
    */
});