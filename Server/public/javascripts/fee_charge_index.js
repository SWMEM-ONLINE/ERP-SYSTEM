/**
 * Created by KIMDONGWON on 2015-12-14.
 */
var rowCount = 1;
var rowMembers = new Array();
var rowMembersName = new Array();
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
    var members = newRow.insertCell(3);
    var price = newRow.insertCell(4);
    var addBtn = newRow.insertCell(5);

    var str0 = '<input id="date_'+rowCount+'" type="text" placeholder="날짜" onclick="calendar(this)" class="datepicker" readonly="readonly">';
    date.innerHTML = str0;
    var str1 = '<div class="btn-group"><button id="type_'+rowCount+'" class="btn" type="button" data-toggle="dropdown" class="dropdown-toggle" aria-expanded="false">구분</button><ul class="dropdown-menu"><li id="type1_'+rowCount+'" onclick="typecheck(this.id)"><a>회비</a></li><li id="type2_'+rowCount+'" onclick="typecheck(this.id)"><a>삼과비</a></li><li id="type3_'+rowCount+'" onclick="typecheck(this.id)"><a>기타</a></li></ul></div>';
    type.innerHTML = str1;
    var str2 ='<input id="content_'+rowCount+'" type="text" placeholder="내용">';
    content.innerHTML = str2;
    var str3 = '<input id="members_'+rowCount+'" type="text" placeholder="회원" readonly="readonly"  onclick="memberSelect(this)">';
    members.innerHTML = str3;
    var str4 = '<input id="price_' + rowCount + '" type="text" placeholder="금액만 입력", onkeydown="isNumberKey(this)"/>';
    price.innerHTML = str4;
    var str5 = '<button id="plus" class="btn" type="button" onclick="addList()">+</button>';
    addBtn.innerHTML = str5;

    var Allrows = document.getElementById('addlist').rows;
    Allrows[lastRow-1].deleteCell(5);
    var changedRow = Allrows[lastRow-1].insertCell(5);
    changedRow.innerHTML = '<button id="minus" class="btn cancel" type="button" onclick="deleteRow(this)">-</button>';

    rowCount = rowCount + 1;
}

function typecheck(string){
    var id = string.substr(6);
    var type = 'button#type_'+id;
    var drop = '#'+string;
    $(type).html($(drop).children('a').html());
}

function deleteRow(obj){
    var tr = obj.parentNode.parentNode;
    var index = tr.rowIndex;
    var table = document.getElementById('addlist');
    table.deleteRow(index);
}

function memberSelect(obj){
    var id = obj.id;
    var idx = id.substr(8);
    $.post('/fee/userList',function(req){
        var string;
        var data;
        string = '<table id='+idx+'>';
        string += '<thead>';
        string += '<tr><th class="memberSelect">선택</th><th class="memberName">이름</th></tr>';
        string += '</thead>';
        string += '<tbody>';
        data = req.result;
        for(var i=0;i<data.length;i++){
            var member = data[i];
            string += '<tr>';
            string += '<td><input id="'+member.u_name+'" type="checkbox" name="memberCheck[]" value = "'+member.u_id+'"></td><td>'+ member.u_name +'('+member.u_id+')</td>';
            string += '</tr>';
        }
        string += '</tbody></table>';
        $('.modal-title').text('해당회원 선택');
        $('div.modal .modal-body').html(string);
    });
    $('div.modal').modal();
}

$('#selectAll').click(function(){
    $("input[name='memberCheck[]']").each(function () {
        $(this).attr('checked',true);
    });
});

$('#select').click(function(){
    var mem = new Array();
    var name = new Array();
    $("input[name='memberCheck[]']").each( function () {
        if($(this).is(':checked') == true){
            mem.push($(this).val());
            name.push($(this).attr('id'));
        }
    });
    var number = $('.modal-body>table').attr('id');
    rowMembers[number] = mem;
    var sentence;
    if(mem.length == 1){
        sentence = name[0];
    }
    else{
        sentence = name[0] + ' 외 ' + (mem.length-1) + ' 명';
    }
    document.getElementById('members_'+ number).value = sentence;
    $('div.modal').modal('hide');
});

$('#submit').click(function(){
    var date;
    var type;
    var content;
    var price;
    var count = 0;
    var arr = new Array();
    var what;
    var complete = true;
    console.log(rowMembers);
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
                if(type === '회비' || type === '삼과비' || type === '기타'){
                    if(type === '회비'){
                        what = 1;
                    }
                    else if(type === '삼과비'){
                        what = 2;
                    }
                    else{
                        what = 3;
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
                Type:what,
                Content:content,
                Payer:rowMembers[i],
                Price:price
            };
            arr.push(sData);

        }
        if(!complete) break;
    }
    console.log(arr);
    if(!complete){
        toastr['info']('입력을 확인하세요');
    }
    else{
        var temp = JSON.stringify(arr);
        $.ajax({
            type:'post',
            url:'/fee/charge',
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
                    $('#members_'+(rowCount-1)).val('');
                    $('#type_'+(rowCount-1)).html('구분');
                }
            }
        });
    }
});