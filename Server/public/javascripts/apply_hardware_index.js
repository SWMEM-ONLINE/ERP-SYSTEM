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

function addList() {
    var table = document.getElementById('addlist');
    var lastRow = table.rows.length;
    var newRow = table.insertRow(lastRow);
    var projectName = newRow.insertCell(0);
    var use = newRow.insertCell(1);
    var type = newRow.insertCell(2);
    var label = newRow.insertCell(3);
    var name = newRow.insertCell(4);
    var ea = newRow.insertCell(5);
    var count = newRow.insertCell(6);
    var maker = newRow.insertCell(7);
    var link = newRow.insertCell(8);
    var btn = newRow.insertCell(9);

    var str0 = '<input id="projectName_'+rowCount+'" type="text" placeholder="프로젝트명">';
    var str1 = '<input id="use_'+rowCount+'" type="text" placeholder="용도">';
    var str2 = '<input id="type_'+rowCount+'" type="text" placeholder="분류">';
    var str3 = '<input id="label_'+rowCount+'" type="text" placeholder="품목">';
    var str4 = '<input id="name_'+rowCount+'" type="text" placeholder="부품명">';
    var str5 = '<input id="ea_'+rowCount+'" type="text" placeholder="규격">';
    var str6 = '<input id="count_'+rowCount+'" type="text" placeholder="수량">';
    var str7 = '<input id="maker_'+rowCount+'" type="text" placeholder="Maker">';
    var str8 = '<input id="link_'+rowCount+'" type="text" placeholder="Link">';
    var str9 = '<button id="plus" class="btn" type="button" onclick="addList()">+</button>';

    projectName.innerHTML = str0;
    use.innerHTML = str1;
    type.innerHTML = str2;
    label.innerHTML = str3;
    name.innerHTML = str4;
    ea.innerHTML = str5;
    count.innerHTML = str6;
    maker.innerHTML = str7;
    link.innerHTML = str8;
    btn.innerHTML = str9;

    var Allrows = document.getElementById('addlist').rows;
    Allrows[lastRow-1].deleteCell(9);
    var changedRow = Allrows[lastRow-1].insertCell(9);
    changedRow.innerHTML = '<button id="minus" class="btn cancel" type="button" onclick="deleteRow(this)">-</button>';

    rowCount = rowCount + 1;
}

function deleteRow(obj){
    var tr = obj.parentNode.parentNode;
    var index = tr.rowIndex;
    var table = document.getElementById('addlist');
    table.deleteRow(index);
}

$('#submit').click(function(){
    var Projectname;
    var Use;
    var Type;
    var Label;
    var Name;
    var Ea;
    var Count;
    var Maker;
    var Link;
    var arr = new Array();

    var message = 'true';
    for ( var i = 0; i < rowCount; i++) {
        Projectname = $('#projectName_'+i).val();
        Use = $('#use_'+ i).val();
        Type = $('#type_'+i).val();
        Label = $('#label_'+i).val();
        Name = $('#name_'+i).val();
        Ea = $('#ea_'+i).val();
        Count = $('#count_'+i).val();
        Maker = $('#maker_'+i).val();

        Link = $('#link_'+i).val();
        var checkHttp = Link.substring(0, 4);
        if(checkHttp != 'http'){
            Link = 'http://' + Link;
        }
        if(!($.isNumeric(Count)))   message = '수량은 숫자를 입력하세요';

        if(Use === "" || Type === "" || Label === "" || Name === "" || Ea === "" || Count === "" || Maker === "" || Link === ""){
            message = '빈 칸이 있습니다';
        }

        if(message != 'true')  break;
        var sData = {
            projectName: Projectname,
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

    if(message != 'true'){
        toastr['error'](message);
    }else{
        var temp1 = JSON.stringify(arr);
        console.log(arr);
        $.ajax({
            type:'post',
            url:'/apply/hardware',
            data:temp1,
            contentType:'application/json',
            success: function(data){
                if(data === 'success'){
                    toastr['success']('하드웨어 등록 성공');
                    for(var i=1;i<rowCount;i++){
                        document.getElementById('addlist').deleteRow(1);
                    }
                    $('#projectName_'+(rowCount-1)).val('');
                    $('#type_'+(rowCount-1)).val('');
                    $('#label_'+(rowCount-1)).val('');
                    $('#name_'+(rowCount-1)).val('');
                    $('#use_'+(rowCount-1)).val('');
                    $('#ea_'+(rowCount-1)).val('');
                    $('#count_'+(rowCount-1)).val('');
                    $('#maker_'+(rowCount-1)).val('');
                    $('#link_'+(rowCount-1)).val('');
                }else{
                    toastr['error']('하드웨어 신청 실패');
                }
            }
        });
    }
});