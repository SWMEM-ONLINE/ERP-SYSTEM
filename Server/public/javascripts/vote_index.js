/**
 * Created by KIMDONGWON on 2016-01-08.
 */
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

getVoteList(0);

function getVoteList(type){
    $.post('/vote/getVoteList',{Type:type},function(response){
        if(response.length == 0){
            var tbodyString = '<tr class="empty"><td colspan="3"><h4>투표가 없습니다</h4></td></tr>';
            $('#voteList tbody').empty();
            $('#voteList tbody').append(tbodyString);
        }
        else{
            var tbodyString = '';
            for(var i=0;i<response.length;i++){
                tbodyString += '<tr id="'+response[i].v_id+'">';
                tbodyString += '<td class="ellipsis"><nobr>';
                if(response[i].v_state == 1){
                    tbodyString += '<strong>'+response[i].v_title+'</strong>';
                }
                else if(response[i].v_state == 2){
                    tbodyString += response[i].v_title;
                }
                tbodyString += '</nobr></td>';
                tbodyString += '<td>'+response[i].v_voted_cnt+'/'+response[i].v_join_cnt+'</td>';
                tbodyString += '<td>'+response[i].v_due_date+'</td>';
                tbodyString += '<td class="hidden">'+response[i].v_type+'</td>';
                tbodyString += '<td class="hidden">'+response[i].v_join_cnt+'</td>';
                tbodyString += '</tr>';
            }
            $('#voteList tbody').empty();
            $('#voteList tbody').append(tbodyString);

        }
    });
}

$('#voteList tbody').on('click','tr:not(.empty)',function(){
    var vid = $(this).attr('id');
    var send = {
        id:vid
    };
    var arr = new Array();

    $(this).children('td').map(function () {
        arr.push($(this).text());
    });
    $('#voteModal .modal-title').text(arr[0]);
    var tbodyString = '';
    $.ajax({
        type:'post',
        url:'/vote/getVoteInfo',
        data:JSON.stringify(send),
        contentType:'application/json',
        success:function(response) {
            var voted = false;
            for(var i=0;i<response.length;i++){
                var persentage =Math.round((response[i].vi_cnt/arr[4])*100)/100 * 100;
                tbodyString += '<div class="test">';
                console.log(arr);
                if(arr[3] == 0){ //radio
                    if(response[i].uSelectedItem == true){
                        tbodyString += '<input type="radio" name="check" class="checkbox" id="select_'+response[i].vi_id+'" checked="checked" origin="checked">';
                        voted = true;
                    }
                    else{
                        tbodyString += '<input type="radio" name="check" class="checkbox" id="select_'+response[i].vi_id+'">';
                    }
                    tbodyString += '<label for="select_'+response[i].vi_id+'" class="input-label radio" style="float:left;"></label>';
                }
                else{  //checkbox
                    if(response[i].uSelectedItem == true) {
                        tbodyString += '<input type="checkbox" name="check" class="checkbox" id="select_'+response[i].vi_id+'" checked="checked" origin="checked">';
                        voted = true;
                    }
                    else{
                        tbodyString += '<input type="checkbox" name="check" class="checkbox" id="select_'+response[i].vi_id+'">';
                    }
                    tbodyString += '<label for="select_'+response[i].vi_id+'" class="input-label checkbox" style="float:left;"></label>';
                }
                tbodyString += '<div id="'+response[i].vi_id+'" class="progress">';
                tbodyString += '<div style="position: absolute; width:100%;">';
                tbodyString += '<div style="float:left; margin-left:10px;">';
                tbodyString += response[i].vi_title;
                tbodyString += '</div>';
                tbodyString += '<div style="float:right; margin-right:100px;"><i class="glyphicon glyphicon-user"></i><span>'+response[i].vi_cnt+'</span></div>';
                tbodyString += '</div>';
                tbodyString += '<div class="progress-bar" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width: '+persentage+'%;"></div>';
                tbodyString += '</div></div>';
            }
            $('#voteModal .modal-body').empty();
            $('#voteModal .modal-body').append(tbodyString);
            if(voted){
                $('#save').removeClass('hidden');
                $('#resave').removeClass('hidden');
                $('#vote').removeClass('hidden');
                $('#revote').removeClass('hidden');
                $('#save').addClass('hidden');
                $('#resave').addClass('hidden');
                $('#vote').addClass('hidden');
            }
            else{
                $('#save').removeClass('hidden');
                $('#resave').removeClass('hidden');
                $('#vote').removeClass('hidden');
                $('#revote').removeClass('hidden');
                $('#save').addClass('hidden');
                $('#resave').addClass('hidden');
                $('#revote').addClass('hidden');
            }
            document.getElementById('voteModal').setAttribute('total',arr[4]);
            document.getElementById('voteModal').setAttribute('type',arr[3]); //radio:0 checkbox:1
            document.getElementById('vote').setAttribute('number',vid);
            document.getElementById('save').setAttribute('number',vid);
            document.getElementById('resave').setAttribute('number',vid);
            document.getElementById('revote').setAttribute('number',vid);
            $('label.input-label').addClass('hidden');
            $('#voteModal div.modal').modal();
        }
    });
});

function refresh(vid,total,type){
    var send = {
        id:vid
    };
    var tbodyString = '';
    $.ajax({
        type: 'post',
        url: '/vote/getVoteInfo',
        data: JSON.stringify(send),
        contentType: 'application/json',
        success: function (response) {
            var voted = false;
            for (var i = 0; i < response.length; i++) {
                var persentage = Math.round((response[i].vi_cnt /total) * 100) / 100 * 100;
                tbodyString += '<div>';
                console.log(response[i]);
                if (type == 0) { //radio
                    if (response[i].uSelectedItem == true) {
                        tbodyString += '<input type="radio" name="check" class="checkbox" id="select_' + response[i].vi_id + '" checked="checked" origin="checked">';
                        voted = true;
                    }
                    else {
                        tbodyString += '<input type="radio" name="check" class="checkbox" id="select_' + response[i].vi_id + '">';
                    }
                    tbodyString += '<label for="select_' + response[i].vi_id + '" class="input-label radio hidden" style="float:left;"></label>';
                }
                else {  //checkbox
                    if (response[i].uSelectedItem == true) {
                        tbodyString += '<input type="checkbox" name="check" class="checkbox" id="select_' + response[i].vi_id + '" checked="checked" origin="checked">';
                        voted = true;
                    }
                    else {
                        tbodyString += '<input type="checkbox" name="check" class="checkbox" id="select_' + response[i].vi_id + '">';
                    }
                    tbodyString += '<label for="select_' + response[i].vi_id + '" class="input-label checkbox hidden" style="float:left;"></label>';
                }
                tbodyString += '<div id="' + response[i].vi_id + '" class="progress"><div style="position: absolute; width:100%;"><div style="float:left; margin-left:10px;">' + response[i].vi_title + '</div><div style="float:right; margin-right:100px;"><i class="glyphicon glyphicon-user"></i><span>' + response[i].vi_cnt + '</span></div></div><div class="progress-bar" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width: ' + persentage + '%;"></div></div><div>';
            }
            $('#voteModal .modal-body').empty();
            $('#voteModal .modal-body').append(tbodyString);
        }
    });
}

$('#save').click(function(){
    var id = document.getElementById('save').getAttribute('number');
    var itemid = new Array();
    $('input:checked').map(function(){
        itemid.push(parseInt(this.id.substr(7)));
    });
    var send = {
        voteId:id,
        itemIds:itemid
    };
    $.ajax({
        type:'post',
        url:'/vote/selectVote',
        data:JSON.stringify(send),
        contentType:'application/json',
        success:function(response) {
            var type = document.getElementById('voteModal').getAttribute('type');
            var total = document.getElementById('voteModal').getAttribute('total');
            $('label.input-label').addClass('hidden');
            $('#revote').removeClass('hidden');
            $('#save').addClass('hidden');
            refresh(id,total,type);
            toastr['success']('투표완료');
        }
    });
});

$('#resave').click(function(){
    var id = document.getElementById('resave').getAttribute('number');
    var itemid = new Array();
    var origin = new Array();
    var itemCnt = 0;
    var checkedCnt = 0;
    $('input').map(function(){
        if($(this).attr('origin') == 'checked'){
            if(!$(this).is(':checked')){
                origin.push(parseInt(this.id.substr(7)));
            }
        }
        else{
            if($(this).is(':checked')){
                itemid.push(parseInt(this.id.substr(7)));
            }
        }
        itemCnt++;
    });
    $('input:checked').map(function(){
        checkedCnt++;
    });
    if(checkedCnt > 0) {
        var type = document.getElementById('voteModal').getAttribute('type');
        var send = {
            voteId: id,
            itemIds: itemid,
            originItemIds: origin,
            itemCnt: itemCnt,
            checkedCnt: checkedCnt,
            voteType: type
        };
        console.log(origin);
        $.ajax({
            type: 'post',
            url: '/vote/updateVote',
            data: JSON.stringify(send),
            contentType: 'application/json',
            success: function (response) {
                var type = document.getElementById('voteModal').getAttribute('type');
                var total = document.getElementById('voteModal').getAttribute('total');
                $('label.input-label').addClass('hidden');
                $('#revote').removeClass('hidden');
                $('#resave').addClass('hidden');
                refresh(id, total, type);
                toastr['success']('처리완료');
            }
        });
    }
    else{
        toastr['info']('선택하세요');
    }
});

$('#vote').click(function(){
    $('label.input-label').removeClass('hidden');
    $('#vote').addClass('hidden');
    $('#save').removeClass('hidden');
});

$('#revote').click(function(){
    $('label.input-label').removeClass('hidden');
    $('#revote').addClass('hidden');
    $('#resave').removeClass('hidden');
});



$('#voteModal').on('click','.progress',function(){
    var id = $(this).attr('id');
    var tbodyString = '';
    var send = {
        vItemId:id
    };
    $.ajax({
        type:'post',
        url:'/vote/getVoteUserList',
        data:JSON.stringify(send),
        contentType:'application/json',
        success:function(response) {
            if(response.length == 0){
                tbodyString += '<h5>선택한 회원이 없습니다</h5>';
            }
            else{
                for(var i=0;i<response.length;i++){
                    tbodyString += '<p>'+response[i].u_name+'</p>';
                }
            }
            $('#memberList .modal-body').empty();
            $('#memberList .modal-body').append(tbodyString);
            $('#memberList div.modal').modal();
        }
    });
});