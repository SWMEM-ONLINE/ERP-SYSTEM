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
    var homework = newRow.insertCell(0);
    var type = newRow.insertCell(1);
    var label = newRow.insertCell(2);
    var size = newRow.insertCell(3);
    var count = newRow.insertCell(4);
    var price = newRow.insertCell(5);
    var total = newRow.insertCell(6);
    var role = newRow.insertCell(7);
    var manufacturer = newRow.insertCell(8);
    var seller = newRow.insertCell(9);
    var phone = newRow.insertCell(10);
    var link = newRow.insertCell(11);
    var btn = newRow.insertCell(12);

    var str0 = '<input id="homework_' + rowCount + '" type="text" placeholder="사용 내역(과제명)">';
    var str1 = '<input id="type_'+ rowCount + '" type="text" placeholder="구분">';
    var str2 = '<input id="label_' + rowCount + '" type="text" placeholder="품목">';
    var str3 = '<input id="size_' + rowCount + '" type="text" placeholder="규격">';
    var str4 = '<input id="count_' + rowCount + '" type="text" placeholder="수량">';
    var str5 = '<input id="price_' + rowCount + '" type="text" placeholder="단가">';
    var str6 = '<input id="total_' + rowCount + '" type="text" placeholder="총액">';
    var str7 = '<input id="role_' + rowCount + '" type="text" placeholder="Hardware 역할">';
    var str8 = '<input id="manufacturer_' + rowCount + '" type="text" placeholder="제조업체">';
    var str9 = '<input id="seller_' + rowCount + '" type="text" placeholder="판매처명">';
    var str10 = '<input id="phone_' + rowCount + '" type="text" placeholder="연락처">';
    var str11 = '<input id="link_' + rowCount + '" type="text" placeholder="Link">';
    var str12 = '<button id="plus" type="button" onclick="addList()" class="plusminus">+</button>';
    homework.innerHTML = str0;
    type.innerHTML = str1;
    label.innerHTML = str2;
    size.innerHTML = str3;
    count.innerHTML = str4;
    price.innerHTML = str5;
    total.innerHTML = str6;
    role.innerHTML = str7;
    manufacturer.innerHTML = str8;
    seller.innerHTML = str9;
    phone.innerHTML = str10;
    link.innerHTML = str11;
    btn.innerHTML = str12;

    var Allrows = document.getElementById('addlist').rows;
    Allrows[lastRow-1].deleteCell(12);
    var changedRow = Allrows[lastRow-1].insertCell(12);
    changedRow.innerHTML = '<button id="minus" type="button" onclick="deleteRow(this)" class="plusminus">－</button>';

    rowCount = rowCount + 1;
};

function deleteRow(obj){
    var tr = obj.parentNode.parentNode;
    var index = tr.rowIndex;
    var table = document.getElementById('addlist');
    table.deleteRow(index);
}

$('#submit').click(function(){
    var Homework;
    var Type;
    var Label;
    var Size;
    var Count;
    var Price;
    var Total;
    var Role;
    var Manufacturer;
    var Seller;
    var Phone;
    var Link;
    var name;
    var team_name;
    var pl;

    name = $('#name').val();
    team_name = $('#team').val();
    pl = $('#pl_name').val();

    var arr = new Array();
    var complete = true;
    for ( var i = 0; i < rowCount; i++) {
        Homework = $('#homework_'+ i).val();
        Type = $('#type_'+i).val();
        Label = $('#label_'+i).val();
        Size = $('#size_'+i).val();
        Count = $('#count_'+i).val();
        Price = $('#price_'+i).val();
        Total = $('#total_'+i).val();
        Role = $('#role_'+i).val();
        Manufacturer = $('#manufacturer_'+i).val();
        Seller = $('#seller_'+i).val();
        Phone = $('#phone_'+i).val();
        Link = $('#link_'+i).val();

        /* check value */
        if(Homework != undefined) {
            if(Homework != "" && Type != "" && Label != "" && Size != "" && Count != "" && Price != "" && Total != "" && Role != "" && Manufacturer != "" && Seller != "" && Phone != "" && Link != ""){
                var sData = {
                    Name:name,
                    Team:team_name,
                    Pl:pl,
                    Homework:Homework,
                    Type:Type,
                    Label:Label,
                    Size:Size,
                    Count:Count,
                    Price:Price,
                    Total:Total,
                    Role:Role,
                    Manufacturer:Manufacturer,
                    Seller:Seller,
                    Phone:Phone,
                    Link:Link
                };
                arr.push(sData);
            }
            else{
                complete = false;
                break;
            }
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