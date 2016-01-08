/**
 * Created by jung-inchul on 2016. 1. 5..
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

loadlifeEvaluation();
var grade = 'A';
var total = 0;

function loadlifeEvaluation(){
    $.post('/user/load_curlifeEval', function(datalist){
        var tableString = '<thead><tr><th colspan="3">' + datalist[0][0].l_year + '년' + datalist[0][0].l_month + '월'+ '</th></tr></thead>';
        tableString += '<tfoot><tr><th colspan="3"><button type="button" id="showhistoryButton" class="btn cancel">과거등급 보기</button></th></tr>';


        if(datalist[1][0].u_state === 2 || datalist[1][0].u_state === '2'){
            tableString += '<tr><th colspan="3"><button type="button" id="addevalButton" class="btn">생활등급 추가</button>';
            tableString += '<button type="button" id="altercutButton" class="btn">등급컷 변경</button></th></tr>';
        }


        tableString += '</tfoot><tbody>';
        tableString += '<tr><td>' + datalist[0][0].l_first + '</td><td>' + datalist[0][0].l_first_point + '</td><td>' + datalist[0][0].l_first_cnt + '</td></tr>';
        tableString += '<tr><td>' + datalist[0][0].l_second + '</td><td>' + datalist[0][0].l_second_point + '</td><td>' + datalist[0][0].l_second_cnt + '</td></tr>';
        tableString += '<tr><td>' + datalist[0][0].l_third + '</td><td>' + datalist[0][0].l_third_point + '</td><td>' + datalist[0][0].l_third_cnt + '</td></tr>';
        tableString += '<tr><td>' + datalist[0][0].l_fourth + '</td><td>' + datalist[0][0].l_fourth_point + '</td><td>' + datalist[0][0].l_fourth_cnt + '</td></tr>';
        tableString += '<tr style="border-bottom: 2px solid #dfdfdf"><td>' + datalist[0][0].l_fifth + '</td><td>' + datalist[0][0].l_fifth_point + '</td><td>' + datalist[0][0].l_fifth_cnt + '</td></tr>';
        tableString += '<tr><td>Total</td><td colspan="2">' + datalist[0][0].l_total + '</td></tr>';
        tableString += '<tr><td>등급</td><td colspan="2">' + datalist[0][0].l_grade + '</td></tr></tbody>';

        $('table#lifeEvaluationTable').html(tableString);

        var tbodyString2 = '<tr><td>A</td><td>~ ' + datalist[2][0].lc_a + '</td></tr>';
        tbodyString2 += '<tr><td>B</td><td>~ ' + datalist[2][0].lc_b + '</td></tr>';
        tbodyString2 += '<tr><td>C</td><td>' + datalist[2][0].lc_b + ' ~</td></tr>';
        $('table#gradecutTable tbody').html(tbodyString2);


        loadhistoryButton();
        newlifeEvalButton(datalist[0][0], datalist[2][0].lc_a, datalist[2][0].lc_b);
        altercutButton(datalist[2][0].lc_a, datalist[2][0].lc_b);
    });
}

function loadhistoryButton(){
    $('button#showhistoryButton').click(function(){
        $('.modal-title').text('과거등급 보기');
        $.post('/user/load_pastlifeEval', function(datalist){
            var modalString = '<table class="table table-striped table-condensed">';
            modalString += '<tr><th>날짜</th><th>Total</th><th>등급</th></tr>';
            $.each(datalist, function(idx, data){
                modalString += '<tr><td>' + data.l_year + '년 ' + data.l_month + '월</td><td>' + data.l_total + '</td><td>' + data.l_grade +'</td></tr>';
            });
            modalString += '</table>';
            $('div.modal-body').html(modalString);
            $('div.modal-footer').html('<button type="button" id="return" class="btn" data-dismiss="modal"> 닫기 </button>');
            $('div.modal').modal();
        });
    });
}

function newlifeEvalButton(dataset, cut_A, cut_B){
    $('button#addevalButton').click(function(){
        total = 0;
        $('.modal-title').text('생활등급 추가');
        var modalString = '<table id="temp" class="table table-striped table-condensed">';
        modalString += '<tr><th>항목</th><th>가중치</th><th>횟수</th></tr>';
        modalString += '<tr><td><input type="text" id="content_1" value="' + dataset.l_first + '"></td><td><input type="number" onchange="calResult(' + cut_A + ',' +cut_B + ')" id="point_1" value="' + dataset.l_first_point + '"></td><td><input type="number" onchange="calResult(' + cut_A + ',' +cut_B + ')" id="cnt_1" value="0"></td></tr>';
        modalString += '<tr><td><input type="text" id="content_2" value="' + dataset.l_second + '"></td><td><input type="number" onchange="calResult(' + cut_A + ',' +cut_B + ')" id="point_2" value="' + dataset.l_second_point + '"></td><td><input type="number" onchange="calResult(' + cut_A + ',' +cut_B + ')" id="cnt_2" value="0"></td></tr>';
        modalString += '<tr><td><input type="text" id="content_3" value="' + dataset.l_third + '"></td><td><input type="number" onchange="calResult(' + cut_A + ',' +cut_B + ')" id="point_3" value="' + dataset.l_third_point + '"></td><td><input type="number" onchange="calResult(' + cut_A + ',' +cut_B + ')" id="cnt_3" value="0"></td></tr>';
        modalString += '<tr><td><input type="text" id="content_4" value="' + dataset.l_fourth + '"></td><td><input type="number" onchange="calResult(' + cut_A + ',' +cut_B + ')" id="point_4" value="' + dataset.l_fourth_point + '"></td><td><input type="number" onchange="calResult(' + cut_A + ',' +cut_B + ')" id="cnt_4" value="0"></td></tr>';
        modalString += '<tr><td><input type="text" id="content_5" value="' + dataset.l_fifth + '"></td><td><input type="number" onchange="calResult(' + cut_A + ',' +cut_B + ')" id="point_5" value="' + dataset.l_fifth_point + '"></td><td><input type="number" onchange="calResult(' + cut_A + ',' +cut_B + ')" id="cnt_5" value="0"></td></tr>';
        modalString += '<tr><td>Total</td><td colspan="2"><span id="total">0</span></td></tr>';
        modalString += '<tr><td>등급</td><td colspan="2"><span id="grade">A</span></td></tr>';

        $('div.modal-footer').html('<button type="button" id="enrollLifeeval" class="btn">등록</button><button type="button" id="return" class="btn" data-dismiss="modal"> 닫기 </button>');
        $('div.modal-body').html(modalString);
        $('div.modal').modal();

        enrollButton();
    });
}

function altercutButton(cut_A, cut_B){
    $('button#altercutButton').click(function(){
        $('.modal-title').text('등급컷 변경하기');
        var modalString = '<table class="table table-striped table-condensed">';
        modalString += '<tr><th>등급</th><th>기준</th></tr>';
        modalString += '<tr><td>A ~ B</td><td><input type="number" id="Acut" value="' + cut_A + '"></td></tr>';
        modalString += '<tr><td>B ~ C</td><td><input type="number" id="Bcut" value="' + cut_B + '"></td></tr></table>';

        $('div.modal-footer').html('<button type="button" id="alterCut" class="btn">변경</button><button type="button" id="return" class="btn" data-dismiss="modal"> 닫기 </button>');
        $('div.modal-body').html(modalString);
        $('div.modal').modal();

        alterButton($('#Acut').val(), $('#Bcut').val());
    });
}

function enrollButton(){
    $('button#enrollLifeeval').click(function(){

        var datalist = new Array();

        var state = true;
        for(var i = 1; i <= 5; i++){
            if(!$.isNumeric($('#point_'+i).val()) || !$.isNumeric($('#cnt_'+i).val())){
                state = false;
                break;
            }
            var data = {
                content: $('#content_'+i).val(),
                point: $('#point_'+i).val(),
                cnt: $('#cnt_'+i).val(),
                total: total,
                grade: grade
            };
            datalist.push(data);
        }

        if(state === false){
            toastr['error']('숫자만 입력해주세요');
        }else{
            var jsonData = JSON.stringify(datalist);
            console.log(jsonData);
            $.ajax({
                type:'post',
                url:'/user/enroll_lifeEval',
                data: jsonData,
                contentType: 'application/json',
                success: function(response){
                    if(response === 'success')  toastr['success']('생활등급 등록완료');
                    else    toastr['error']('생활등급 등록실패');
                }
            });
            $('div.modal').modal('hide');
            loadlifeEvaluation();
        }
    });
}

function alterButton(alter_A, alter_B){
    $('button#alterCut').click(function() {
        var state = true;

        if(!$.isNumeric(alter_A) || !$.isNumeric(alter_B)){
            state = false;
        }

        if(state === false){
            toastr['error']('숫자만 입력해주세요');
            return;
        }else{
            $.post('/user/alter_gradeCut', {cut_A: alter_A, cut_B: alter_B}, function(response){
                if(response === 'success')  toastr['success']('변경성공');
                else    toastr['error']('변경실패');
            });

            $('div.modal').modal('hide');
            loadlifeEvaluation();
        }
    });
}

function calResult(cut_A, cut_B){
    total = 0;
    for(var i = 1; i <= 5; i++){
        total += (parseInt($('#point_'+i).val()) * parseInt($('#cnt_'+i).val()));
    }
    $('span#total').text(total);

    if(total <= cut_A)   grade = 'A';
    else if(total <= cut_B) grade = 'B';
    else grade = 'C';

    $('span#grade').text(grade);
}