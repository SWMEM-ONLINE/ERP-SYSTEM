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


exports.nextDayDuty = nextDayDuty;
