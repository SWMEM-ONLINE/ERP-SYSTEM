/**
 * Created by HyunJae on 2016. 1. 13..
 */

var util = require("./util");
var DB_handler = require('./DB_handler');
var con = DB_handler.connectDB();


/**
 *
 * 다음날 당직에게 푸쉬를 보내는 함수
 *
 */
function nextDayDuty() {


    var today = new Date();
    var tomorrow = new Date(today.getTime() + (24 * 60 * 60 * 1000));

    var year = tomorrow.getFullYear();
    var month = tomorrow.getMonth() + 1;
    var date = tomorrow.getDate();
    var title = "당직 알림";
    var content = "내일( " + year +" - " + month + " - " + date + ") 당직입니다.";

    var query = " select * from  `swmem`.`t_duty` WHERE (`date`='" + year + "-" + month + "-" + date + "');";
    console.log(title + content + query);
    con.query(query, function (err, response) {
        if(err){
            console.log(err);
        }
        else{
            var i;
            var data;
            console.log(response);
            for(i=0;i<response.length;i++){
                data = response[i];
                if(data.user_id1 !== null && typeof data.user_id1 != "undefined"){
                    util.send(data.user_id1,title,content,function(err,response){
                        if(err){
                            console.log(err);
                        }else{
                            console.log(response);
                        }
                    });

                }
                if(data.user_id2 !== null && typeof data.user_id2 != "undefined"){
                    util.send(data.user_id2,title,content,function(err,response){
                        if(err){
                            console.log(err);
                        }else{
                            console.log(response);
                        }
                    });
                }
                if(data.user_id3 !==null && typeof data.user_id3 != "undefined"){
                    util.send(data.user_id3,title,content,function(err,response){
                        if(err){
                            console.log(err);
                        }else{
                            console.log(response);
                        }
                    });
                }
                if(data.user_id4 !== null && typeof data.user_id4 != "undefined"){
                    util.send(data.user_id4,title,content,function(err,response){
                        if(err){
                            console.log(err);
                        }else{
                            console.log(response);
                        }
                    });
                }
            }
        }

    });
}


function hardware_remaining(){
    var query = 'select a.hr_user, b.h_name, DATEDIFF(CURDATE(), a.hr_due_date) diff from t_hardware_rental a inner join t_hardware b on a.hr_hardware_id=b.h_id';

    var content = '대여하신 하드웨어 ';
    con.query(query, function(err, response){
        if(err){
            console.log("Load DB ERROR in job_schedule_handler.js's hardware_remaining function");
        }else{
            for(var i = 0; i < response.length; i++){
                if(response[i].diff === -3 || response[i].diff === -1){
                    content += (response[i].h_name + '의 반납일이 ' + (-response[i].diff) + '일 남았습니다');
                    util.send(response[i].hr_user, '하드웨어 반납일 알림', content, function(err2, response2){
                        if(err2){
                            console.log(err2);
                        }else{
                            console.log(response2);
                        }
                    });
                }
            }
        }
    });
}

function book_remaining(){
    var query = 'select a.br_user, b.b_name, DATEDIFF(CURDATE(), b.b_due_date) diff from t_book_rental a inner join t_book b on a.br_book_id=b.b_id';
    var content = '대여하신 도서 ';
    con.query(query, function(err, response){
        if(err){
            console.log("Load DB ERROR in job_schedule_handler.js's book_remaining function");
        }else{
            for(var j = 0; j < response.length; j++){
                if(response[j].diff === -3 || response[j].diff === -1){
                    content += (response[j].b_name + '의 반납일이 ' + (-response[j].diff) + '일 남았습니다');
                    util.send(response[j].br_user, '도서 반납일 알림', content, function(err2, response2){
                        if(err2){
                            console.log(err2);
                        }else{
                            console.log(response2);
                        }
                    });
                }
            }
        }
    });
}

/**
 * fee_carry
 * 회비 이월 메소드
 */

function fee_carry() {

    var lastMonth = '"'+util.getCurDate().substring(0,7)+'%"';
    var query = 'select * from t_fee_manage where fm_date like '+lastMonth;

    con.query(query, function(err,rows){
        if (err) {
            console.error(err);
        }

        var deposit = util.getTotalDeposit(rows);
        var withdraw = util.getTotalWithdraw(rows);


        var values = new Array(1);
        var id = 0;
        var price = deposit - withdraw;
        var money_type = false;
        if(price < 0){
            money_type = true;
        }
        var money_content = "회비 이월";
        var monthly_deposit = 0;
        var monthly_withdraw = 0;
        var remain_money = 0;
        var writer = 'admin';
        var date = util.getCurDate();

        values[0] = [id, money_type, money_content, price, monthly_deposit, monthly_withdraw, remain_money, writer, date, util.getCurDateWithTime()];


        con.query('insert into t_fee_manage(fm_id, fm_money_type, fm_money_content,fm_price,fm_monthly_deposit,fm_monthly_withdraw,fm_remain_money,fm_writer,fm_date,fm_write_date) values ?', [values], function(err,result){

            console.log(result);
            if (err) {
                console.log(err);
            }
            res.render('main', { title: '메인', grade: util.getUserGrade(req) });

        });

    });
}

/**
 * vote_complete
 * 마감 투표 갱신 메소드
 */

function vote_complete() {

    var query = 'update t_vote set v_state = 2 where v_state = 1 AND date(DATE_ADD(v_write_date, INTERVAL 14 DAY)) <= date(NOW())';

    con.query(query, function(err, res){
        if(err){
            console.log("err");
        }
    });
}

exports.hardware_remaining = hardware_remaining;
exports.book_remaining = book_remaining;
exports.nextDayDuty = nextDayDuty;
exports.fee_carry = fee_carry;
exports.vote_complete = vote_complete;
