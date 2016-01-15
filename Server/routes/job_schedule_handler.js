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
                    util.send(response[i].br_user, '도서 반납일 알림', content, function(err2, response2){
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

exports.hardware_remaining = hardware_remaining;
exports.book_remaining = book_remaining;
exports.nextDayDuty = nextDayDuty;
