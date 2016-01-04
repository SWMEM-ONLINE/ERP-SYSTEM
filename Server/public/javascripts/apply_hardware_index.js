/**
 * Created by KIMDONGWON on 2015-12-09.
 */

var rowCount = 1;
var rowCountExp = 1;

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

function addList() {
    var table = document.getElementById('addlist');
    var lastRow = table.rows.length;
    var newRow = table.insertRow(lastRow);
    var use = newRow.insertCell(0);
    var type = newRow.insertCell(1);
    var label = newRow.insertCell(2);
    var name = newRow.insertCell(3);
    var ea = newRow.insertCell(4);
    var count = newRow.insertCell(5);
    var maker = newRow.insertCell(6);
    var link = newRow.insertCell(7);
    var btn = newRow.insertCell(8);

    var str0 = '<input id="use_'+rowCount+'" type="text" placeholder="용도">';
    var str1 = '<input id="type_'+rowCount+'" type="text" placeholder="분류">';
    var str2 = '<input id="label_'+rowCount+'" type="text" placeholder="품목">';
    var str3 = '<input id="name_'+rowCount+'" type="text" placeholder="부품명">';
    var str4 = '<input id="ea_'+rowCount+'" type="text" placeholder="규격">';
    var str5 = '<input id="count_'+rowCount+'" type="text" placeholder="수량">';
    var str6 = '<input id="maker_'+rowCount+'" type="text" placeholder="Maker">';
    var str7 = '<input id="link_'+rowCount+'" type="text" placeholder="Link">';
    var str8 = '<button id="plus" type="button" onclick="addList()" class="plusminus">+</button>';

    use.innerHTML = str0;
    type.innerHTML = str1;
    label.innerHTML = str2;
    name.innerHTML = str3;
    ea.innerHTML = str4;
    count.innerHTML = str5;
    maker.innerHTML = str6;
    link.innerHTML = str7;
    btn.innerHTML = str8;

    var Allrows = document.getElementById('addlist').rows;
    Allrows[lastRow-1].deleteCell(8);
    var changedRow = Allrows[lastRow-1].insertCell(8);
    changedRow.innerHTML = '<button id="minus" type="button" onclick="deleteRow(this)" class="plusminus">－</button>';

    rowCount = rowCount + 1;
};

function deleteRow(obj){
    var tr = obj.parentNode.parentNode;
    var index = tr.rowIndex;
    var table = document.getElementById('addlist');
    table.deleteRow(index);
}

function deleteRowExp(obj){
    var tr = obj.parentNode.parentNode;
    var index = tr.rowIndex;
    var table = document.getElementById('explainlist');
    table.deleteRow(index);
}

function addExplain() {
    var table = document.getElementById('explainlist');
    var lastRow = table.rows.length;
    var newRow = table.insertRow(lastRow);
    var kind = newRow.insertCell(0);
    var explain = newRow.insertCell(1);
    var btn = newRow.insertCell(2);

    var str0 = '<input id="kind_'+rowCountExp+'" type="text" placeholder="분류(종류)">';
    var str1 = '<input id="explain_'+rowCountExp+'" type="text" placeholder="설명">';
    var str2 = '<button id="plus" type="button" onclick="addExplain()" class="plusminus">+</button>';

    kind.innerHTML = str0;
    explain.innerHTML = str1;
    btn.innerHTML = str2;

    var Allrows = document.getElementById('explainlist').rows;
    Allrows[lastRow-1].deleteCell(2);
    var changedRow = Allrows[lastRow-1].insertCell(2);
    changedRow.innerHTML = '<button id="minus" type="button" onclick="deleteRowExp(this)" class="plusminus">－</button>';

    rowCountExp = rowCountExp + 1;
};

$('#submit').click(function(){
    var Use;
    var Type;
    var Label;
    var Name;
    var Ea;
    var Count;
    var Maker;
    var Link;

    var arr = new Array();
    var complete = true;
    for ( var i = 0; i < rowCount; i++) {
        Use = $('#use_'+ i).val();
        Type = $('#type_'+i).val();
        Label = $('#label_'+i).val();
        Name = $('#name_'+i).val();
        Ea = $('#ea_'+i).val();
        Count = $('#count_'+i).val();
        Maker = $('#maker_'+i).val();
        Link = $('#link_'+i).val();

        /* check value */

        if(Use != "" && Type != "" && Label != "" && Name != "" && Ea != "" && Count != "" && Maker != "" && Link != ""){
            var sData = {
                use:Use,
                type:Type,
                label:Label,
                name:Name,
                ea:Ea,
                count:Count,
                maker:Maker,
                link:Link
            };
            arr.push(sData);
        }
        else{
            complete = false;
            break;
        }
    }

    if(!complete){
        toastr['info']('입력을 확인하세요');
    }
    else{
        var temp = JSON.stringify(arr);
        $.ajax({
            type:'post',
            url:'/apply/hardware',
            data:temp,
            contentType:'application/json',
            success: function(data){
                if(data.status === 'success'){
                    toastr['success']('하드웨어 신청 성공');
                }else{
                    toastr['error']('하드웨어 신청 실패');
                }
            }
        });
    }
});