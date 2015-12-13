/**
 * Created by KIMDONGWON on 2015-12-14.
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
    var category = newRow.insertCell(1);
    var members = newRow.insertCell(2);
    var price = newRow.insertCell(3);
    var addBtn = newRow.insertCell(4);

    var str0 = '<input id="date_'+rowCount+'" type="text" placeholder="날짜선택" onclick="calendar(this)" class="datepicker" readonly="readonly">';
    date.innerHTML = str0;

    var str1 ='<input id="category_'+rowCount+'" type="text" placeholder="카테고리">';
    category.innerHTML = str1;
    var str2 = '<input id="members_'+rowCount+'" type="text" placeholder="회원선택" readonly="readonly"  onclick="memberSelect(this)">';
    members.innerHTML = str2;
    var str3 = '<input id="price_' + rowCount + '" type="text" placeholder="숫자만 입력", onkeydown="isNumberKey(this)"/>';
    price.innerHTML = str3;
    var str4 = '<button id="plus" type="button" onclick="addList()" class="plusminus">+</button>';
    addBtn.innerHTML = str4;

    var Allrows = document.getElementById('addlist').rows;
    Allrows[lastRow-1].deleteCell(4);
    var changedRow = Allrows[lastRow-1].insertCell(4);
    changedRow.innerHTML = '<button id="minus" type="button" onclick="deleteRow(this)" class="plusminus">－</button>';

    rowCount = rowCount + 1;
}

function deleteRow(obj){
    var tr = obj.parentNode.parentNode;
    var index = tr.rowIndex;
    var table = document.getElementById('addlist');
    table.deleteRow(index);
}

function memberSelect(obj){
    $('div.modal').modal();
}