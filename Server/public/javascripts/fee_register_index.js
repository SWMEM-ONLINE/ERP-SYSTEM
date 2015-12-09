/**
 * Created by KIMDONGWON on 2015-12-09.
 */

var rowCount = 1;

function calendar(obj) {
    $(obj).datepicker({
        format : "yyyy-mm-dd",
        keyboardNavigation : false,
        todayHighlight : true,
        endDate: "+1d",
        autoclose : true
    }).datepicker("show");
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

    var str0 = '<input id="date_'+rowCount+'" type="text" placeholder="날짜선택" onclick="calendar(this)" class="datepicker">';
    date.innerHTML = str0;

    var str1 ='<div class="btn-group"><button id="type_'+rowCount+'" type="button" data-toggle="dropdown" class="btndropdown-toggle">구분</button><ul class="dropdown-menu"><li id="expense_'+rowCount+'" onclick="expense(this.id)"><a href="#">지출</a></li><li id="income_'+rowCount+'" onclick="income(this.id)"><a href="#">수입</a></li></ul></div>';
    type.innerHTML = str1;
    var str2 = '<input id="content_'+rowCount+'" type="text" placeholder="사용내역"/>';
    content.innerHTML = str2;
    var str3 = '<input id="price_' + rowCount + '" type="text" placeholder="숫자만 입력"/>';
    price.innerHTML = str3;
    var str4 = '<button id="plus" type="button" onclick="addList()" class="plusminus">+</button>';
    addBtn.innerHTML = str4;

    var Allrows = document.getElementById('addlist').rows;
    Allrows[lastRow-1].deleteCell(4);
    var changedRow = Allrows[lastRow-1].insertCell(4);
    changedRow.innerHTML = '<button id="minus" type="button" onclick="deleteRow(this)" class="plusminus">－</button>';

    rowCount = rowCount + 1;
};

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
    var count = 1;
    for ( var i = 0; i < rowCount; i++) {
        date = $("#date_" + i).val();
        content = $('#content_' + i).val();
        price = $('#price_' + i).val();
        type = $('#type_'+i).html();
        count++;
        /* check value */
        if(type === '구분'){
            alert('구분');
        }
        if(type === '지출'){

        }
        if(type === '수입'){

        }
    }
});