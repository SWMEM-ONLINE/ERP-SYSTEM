/**
 * Created by KIMDONGWON on 2015-12-15.
 */

var rowCount = 1;
var APPLY_ROOM = '/apply/room/manage';  //1
var APPLY_SERVER = '/apply/server/manage';  //2
var APPLY_EQUIPMENT = '/apply/equipment/manage';  //3
var thisPage;

if(location.pathname == APPLY_ROOM){
    thisPage = 1;
}
else if(location.pathname == APPLY_SERVER){
    thisPage = 2;
}
else if(location.pathname == APPLY_EQUIPMENT){
    thisPage = 3;
}

reloadList(thisPage);

function reloadList(thisPage){
    $.get('/apply/getApplyList/'+thisPage,function(data){
        var result = data.list;
        $('#history tbody').empty();
        if(result.length == 0){
            $('#history tbody').append('<tr class="empty"><td colspan="4"><h4>신청서가 없습니다</h4></td></tr>');
        }
        else{
            for(var i=0;i<result.length;i++){
                $('#history tbody').append('<tr><td class="hidden">'+result[i].a_id+'</td></td><td>'+result[i].a_date+'</td><td>'+result[i].a_title+'</td><td class="ellipsis">'+result[i].a_weblink+'</td><td>'+result[i].a_due_date+'</td></tr>');
            }
        }
    });
}

function calendar(obj) {
    $(obj).datepicker({
        format : "yyyy/mm/dd",
        keyboardNavigation : false,
        todayHighlight: true,
        endDate: '+1d',
        autoclose: true
    }).datepicker("show");
}

function calendar_expire(obj) {
    $(obj).datepicker({
        format : "yyyy/mm/dd",
        keyboardNavigation : false,
        todayHighlight: true,
        autoclose: true
    }).datepicker("show");
}


function addList() {
    var table = document.getElementById('addlist');
    var lastRow = table.rows.length;
    var newRow = table.insertRow(lastRow);
    var date = newRow.insertCell(0);
    var content = newRow.insertCell(1);
    var link = newRow.insertCell(2);
    var expire = newRow.insertCell(3);
    var addBtn = newRow.insertCell(4);

    var str0 = '<input id="date_'+rowCount+'" type="text" placeholder="날짜선택" onclick="calendar(this)" readonly="readonly" class="datepicker">';
    date.innerHTML = str0;
    var str1 ='<input id="content_'+rowCount+'" type="text" placeholder="내용">';
    content.innerHTML = str1;
    var str2 = '<input id="link_'+rowCount+'" type="text" placeholder="Link">';
    link.innerHTML = str2;
    var str3 = '<input id="due_'+rowCount+'" type="text" placeholder="날짜선택" onclick="calendar_expire(this)" readonly="readonly" class="datepicker">';
    expire.innerHTML = str3;
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

$('#submit_data').click(function(){
    var date;
    var content;
    var link;
    var due;
    var complete = true;
    var count = 0;
    var arr = new Array();
    for ( var i = 0; i < rowCount; i++) {
        date = $("#date_" + i).val();
        content = $('#content_' + i).val();
        link = $('#link_' + i).val();
        due = $('#due_' + i).val();
        var checkHttp = link.substring(0, 4);
        if(checkHttp != 'http'){
            link = 'http://' + link;
        }
        if(date != undefined) {
            if (date != '' && content != '' && link != '' && due != '') {
                if(date <= due) {
                    var sData = {
                        Date: date,
                        Content: content,
                        Link: link,
                        Due: due
                    };
                    arr.push(sData);
                    count++;
                    complete = true;
                }
                else{
                    console.log("dayProblem : " + i);
                    complete = false;
                    break;
                }
            }
            else {
                console.log("null : " + i);
                complete = false;
                break;
            }
        }
    }
    if(!complete){
        toastr['info']('입력을 확인하세요');
    }
    else{
        arr = JSON.stringify(arr);
        $.ajax({
            type:'post',
            url:'/apply/setApplyList/'+thisPage,
            data:arr,
            contentType:'application/json',
            success: function(data) {
                if (data.status === '0') {
                    toastr['success']('성공');

                    for (var i = 1; i < count; i++) {
                        document.getElementById('addlist').deleteRow(1);
                    }

                    $('#date_' + (rowCount - 1)).val('');
                    $('#content_' + (rowCount - 1)).val('');
                    $('#link_' + (rowCount - 1)).val('');
                    $('#due_' + (rowCount - 1)).val('');

                    reloadList(thisPage);
                }
            }
        });
    }
});

$('#history tbody').on('click','tr:not(.empty)',function () {
    var string = '';
    var arr = new Array();
    $(this).children('td').map(function () {
        arr.push($(this).text());
    });
    $('.modal-title').text('신청서 이력');
    $('#edit').attr('number',thisPage);
    string += '<div class="hidden">'+arr[0]+'</div>';
    string += '<h5>날짜</h5>';
    string += '<input id="edit_date" value="' + arr[1] + '" onclick="calendar(this)", class="datepicker", readonly="readonly">';
    string += '<h5>내용</h5>';
    string += '<input id="edit_content" value="' + arr[2] + '">';
    string += '<h5>Link</h5>';
    string += '<input id="edit_link" value="' + arr[3] + '">';
    string += '<h5>기한</h5>';
    string += '<input id="edit_expire" value="' + arr[4] + '" onclick="calendar_expire(this)", class="datepicker", readonly="readonly">';
    $('div.modal .modal-body').html(string);
    $('div.modal').modal();
});

$('#delete').click(function(){
    var id = $('.modal-body .hidden').html();
    var type = $('#edit').attr('number');
    $.post('/apply/delete/'+type,{delete_id:id}, function(data){
        if(data.status === '0'){
            toastr['success']('성공');
            $('div.modal').modal('hide');
            reloadList(thisPage);
            console.log(thisPage);
        }
    });
});

$('#edit').click(function(){
    var id = $('.modal-body .hidden').html();
    var edit_date = $('#edit_date').val();
    var edit_content = $('#edit_content').val();
    var edit_link = $('#edit_link').val();
    var edit_expire = $('#edit_expire').val();
    var type = thisPage;

    var sdata = {
        Id:id,
        Date:edit_date,
        Content:edit_content,
        Link:edit_link,
        Due:edit_expire
    };

    var send = JSON.stringify(sdata);
    $.post('/apply/edit/'+type, JSON.parse(send), function(data){
        if(data.status === '0') {
            toastr['success']('성공');
            $('div.modal').modal('hide');
            reloadList(thisPage);
        }
    });
});