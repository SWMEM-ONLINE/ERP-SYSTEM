/**
 * Created by KIMDONGWON on 2015-12-15.
 */
//$.post('/apply/server/manage/history',function(data){
//
//});

var rowCount = 1;
function reload(){
    $.get('/apply/getApplyList/2',function(data){
        var result = data.list;
        $('#history tbody').empty();
        for(var i=0;i<result.length;i++){
            $('#history tbody').append('<tr><td>'+result[i].a_date+'</td><td>'+result[i].a_title+'</td><td class="ellipsis">'+result[i].a_weblink+'</td><td>'+result[i].a_due_date+'</td></tr>');
        }
    });
}

reload();

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
    var str3 = '<input id="expire_'+rowCount+'" type="text" placeholder="날짜선택" onclick="calendar(this)" readonly="readonly" class="datepicker">';
    expire.innerHTML = str3;
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

$('#submit_room').click(function(){
    var date;
    var content;
    var link;
    var due;
    var complete = true;
    var arr = new Array();
    for ( var i = 0; i < rowCount; i++) {
        date = $("#date_" + i).val();
        content = $('#content_' + i).val();
        link = $('#link_' + i).val();
        due = $('#due_' + i).val();
        if(date != undefined){
            if(date != '' && content != '' && link != '' && due != ''){
                var sData = {
                    Date:date,
                    Content:content,
                    Link:link,
                    Due:due
                };
                arr.push(sData);
                complete = true;
            }
            else{
                complete = false;
                break;
            }
        }
        else{
            complete = false;
            break;
        }
    }
    arr = JSON.stringify(arr);

    if(!complete){
        toastr['info']('입력을 확인하세요');
    }
    else{
        $.ajax({
            type:'post',
            url:'/apply/setApplyList/1',
            data:arr,
            contentType:'application/json',
            success: function(data){
                if(data.status === '0'){
                    toastr['success']('성공');
                    for(var i=1;i<count;i++){
                        document.getElementById('addlist').deleteRow(1);
                    }
                    $('#date_'+(rowCount-1)).val('');
                    $('#content_'+(rowCount-1)).val('');
                    $('#link'+(rowCount-1)).val('');
                    $('#due'+(rowCount-1)).val('');
                }
            }
        });
    }
});


$('#submit_server').click(function(){
    var date;
    var content;
    var link;
    var due;
    var complete = true;
    var arr = new Array();
    for ( var i = 0; i < rowCount; i++) {
        date = $("#date_" + i).val();
        content = $('#content_' + i).val();
        link = $('#link_' + i).val();
        due = $('#due_' + i).val();
        if(date != undefined){
            if(date != '' && content != '' && link != '' && due != ''){
                var sData = {
                    Date:date,
                    Content:content,
                    Link:link,
                    Due:due
                };
                arr.push(sData);
                complete = true;
            }
            else{
                complete = false;
                break;
            }
        }
        else{
            complete = false;
            break;
        }
    }
    arr = JSON.stringify(arr);

    if(!complete){
        toastr['info']('입력을 확인하세요');
    }
    else{
        $.ajax({
            type:'post',
            url:'/apply/setApplyList/2',
            data:arr,
            contentType:'application/json',
            success: function(data){
                if(data.status === '0'){
                    toastr['success']('성공');
                    //for(var i=1;i<count;i++){
                    //    document.getElementById('addlist').deleteRow(1);
                    //}
                    //$('#date_'+(rowCount-1)).val('');
                    //$('#content_'+(rowCount-1)).val('');
                    //$('#link'+(rowCount-1)).val('');
                    //$('#due'+(rowCount-1)).val('');
                    reload();
                }
            }
        });
    }
});

$('#submit_equipment').click(function(){
    var date;
    var content;
    var link;
    var due;
    var complete = true;
    var arr = new Array();
    for ( var i = 0; i < rowCount; i++) {
        date = $("#date_" + i).val();
        content = $('#content_' + i).val();
        link = $('#link_' + i).val();
        due = $('#due_' + i).val();
        if(date != undefined){
            if(date != '' && content != '' && link != '' && due != ''){
                var sData = {
                    Date:date,
                    Content:content,
                    Link:link,
                    Due:due
                };
                arr.push(sData);
                complete = true;
            }
            else{
                complete = false;
                break;
            }
        }
        else{
            complete = false;
            break;
        }
    }
    arr = JSON.stringify(arr);

    if(!complete){
        toastr['info']('입력을 확인하세요');
    }
    else{
        $.ajax({
            type:'post',
            url:'/apply/setApplyList/3',
            data:arr,
            contentType:'application/json',
            success: function(data){
                if(data.status === '0'){
                    toastr['success']('성공');
                    for(var i=1;i<count;i++){
                        document.getElementById('addlist').deleteRow(1);
                    }
                    $('#date_'+(rowCount-1)).val('');
                    $('#content_'+(rowCount-1)).val('');
                    $('#link'+(rowCount-1)).val('');
                    $('#due'+(rowCount-1)).val('');
                }
            }
        });
    }
});

$('#history tbody').on('click','tr', function () {
    var string = '';
    var arr = new Array();
    $(this).children('td').map(function () {
        arr.push($(this).text());
    });
    $('.modal-title').text('신청서 이력');
    $('#edit').attr('number',$('#history').attr('number'));
    string += '<h5>날짜</h5>';
    string += '<input id="edit_date" value="' + arr[0] + '" onclick="calendar(this)", class="datepicker", readonly="readonly">';
    string += '<h5>내용</h5>';
    string += '<input id="edit_content" value="' + arr[1] + '">';
    string += '<h5>Link</h5>';
    string += '<input id="edit_link" value="' + arr[2] + '">';
    string += '<h5>기한</h5>';
    string += '<input id="edit_expire" value="' + arr[3] + '" onclick="calendar_expire(this)", class="datepicker", readonly="readonly">';
    $('div.modal .modal-body').html(string);
    $('div.modal').modal();
});

$('#edit').click(function(){
    var edit_date = $('#edit_date').val();
    var edit_content = $('#edit_content').val();
    var edit_link = $('#edit_link').val();
    var edit_expire = $('#edit_expire').val();
    var type = $('#edit').attr('number');
    var sdata = {
        Date:edit_date,
        Content:edit_content,
        Link:edit_link,
        Due:edit_expire
    };

    var send = JSON.stringify(sdata);
    $.ajax({
        type:'post',
        url:'/apply/edit/:'+type,
        data:JSON.parse(send),
        contentType:'application/json',
        success: function(data){
            if(data.status === '0'){
                toastr['success']('성공');
                $.post('/apply/edit/:'+type,function(data){
                    var string = '';
                    for(row in data){
                        console.log(row);
                    }
                });
            }
        }
    });
});