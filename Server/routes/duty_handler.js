/**
 * Created by HyunJae on 2015. 12. 20..
 */





function forceChangeDuty(con,req,res){

    console.log(req.body);

    var request_date1 = req.body.request_date1;
    var request_date2 = req.body.request_date2;
    var request_id1 = req.body.request_id1;
    var request_id2 = req.body.request_id2;

    request_date1 = new Date(request_date1);
    request_date2 = new Date(request_date2);

    var selected_user1 = "";
    var selected_mode1 = "";
    var request_mode1 = 0;

    var selected_user2= "";
    var selected_mode2 = "";
    var request_mode2 = 0;

    //   바로 넣어준다
    var insert_query = "INSERT INTO `swmem`.`t_duty_change_history` (`request_date1`, `request_userid1`, `request_date2`, `request_userid2` , `accepted`) " +
        "VALUES ('" +request_date1.getFullYear() +"-"+(request_date1.getMonth()+1) + "-"+request_date1.getDate()+"'" +
        ", '" +request_id1 + "', " +
        "'" +request_date2.getFullYear() +"-"+(request_date2.getMonth()+1) + "-"+request_date2.getDate()+"', " +
        "'" +request_id2 + "', '1');";
    console.log(insert_query);
    con.query(insert_query, function(err, response){
        if(err){
            console.log(err);
        }else{

            if(response.length==0){
                console.log("error");

            }else{

                console.log(response);

                var get_query1 = " select * from  `swmem`.`t_duty` WHERE (`date`='"+request_date1.getFullYear()+"-"  + (request_date1.getMonth())
                    + "-" + request_date1.getDate()+ "');";


                console.log(get_query1);
                con.query(get_query1, function(err, response){
                    if(err){
                        console.log(err);
                    }else{

                        if(response.length==0){
                            console.log("error");

                        }else{

                            console.log(response);

                            var tmp = getRequestInfo(response[0] , request_id1);
                            selected_user1 = tmp.selected_user;
                            selected_mode1 = tmp.selected_mode;
                            request_mode1 = tmp.request_mode;

                            var get_query2 = " select * from  `swmem`.`t_duty` WHERE (`date`='"+request_date2.getFullYear()+"-"  + (request_date2.getMonth())
                                + "-" + request_date2.getDate()+ "');";


                            console.log(get_query2);
                            con.query(get_query2, function(err, response){
                                if(err){
                                    console.log(err);
                                }else{

                                    if(response.length==0){
                                        console.log("error");

                                    }else{

                                        console.log(response);

                                        var tmp = getRequestInfo(response[0] , request_id2);
                                        selected_user2 = tmp.selected_user;
                                        selected_mode2 = tmp.selected_mode;
                                        request_mode2 = tmp.request_mode;

                                        var change_query1 = "UPDATE `swmem`.`t_duty` " +
                                            "SET `" + selected_user1+ "`='"+request_id2+"', " +
                                            "`"+selected_mode1+"`='" +request_mode2 + "' " +
                                            "WHERE (`date`='"+request_date1.getFullYear()+"-"  + (request_date1.getMonth())
                                            + "-" + request_date1.getDate()+ "');";

                                        /*
                                         request_user1 처리하는 부분
                                         */

                                        console.log(change_query1);
                                        con.query(change_query1, function(err, response){
                                            if(err){
                                                console.log(err);
                                            }else{

                                                if(response.length==0){
                                                    console.log("error");

                                                }else{

                                                    console.log(response);

                                                    var change_query2 = "UPDATE `swmem`.`t_duty` " +
                                                        "SET `" + selected_user2+ "`='"+request_id1+"', " +
                                                        "`"+selected_mode2+"`='" +request_mode1 + "' " +
                                                        "WHERE (`date`='"+request_date2.getFullYear()+"-"  + (request_date2.getMonth())
                                                        + "-" + request_date2.getDate()+ "');";

                                                    /*
                                                     request_user1 처리하는 부분
                                                     */

                                                    console.log(change_query2);
                                                    con.query(change_query2, function(err, response){
                                                        if(err){
                                                            console.log(err);
                                                        }else{

                                                            if(response.length==0){
                                                                console.log("error");

                                                            }else{

                                                                console.log(response);

                                                                res.send(response);

                                                            }
                                                        }
                                                    });


                                                }
                                            }
                                        });

                                    }
                                }
                            });


                        }
                    }
                });

            }
        }
    });



}






/**
    요청된 체인지 듀티를 바꾸는 확인
 */
function declineChangeDuty(con,req,res){

    console.log(req.body);


    var index = req.body.index;
    index = 1;


    var update_query = "UPDATE `swmem`.`t_duty_change_history` SET `accepted`='2' WHERE `index`='" + index + "';";


    console.log(update_query);
    con.query(update_query, function(err, response){

        if(err){
            console.log(err);
        }else{

            if(response.length==0){
                console.log("error");

            }else{

                console.log(response);

                res.send(response);

            }
        }
    });


}

/**
 *  콜롬을 쌓아야 한다
 */
function getRequestInfo(data , request_id){

    var selected_user1 = "";
    var selected_mode1 = "";
    var request_mode1 = 0;

    var user1 = data.user_id1;
    var user2 = data.user_id2;
    var user3 = data.user_id3;
    var user4 = data.user_id4;

    var mode1 = data.user1_mode;
    var mode2 = data.user2_mode;
    var mode3 = data.user3_mode;
    var mode4 = data.user4_mode;

    if(user1 == request_id)
    {
        selected_user1 = "user_id1";
        selected_mode1 = "user1_mode";
        request_mode1 = mode1;
    }
    else if(user2 == request_id)
    {
        selected_user1 = "user_id2";
        selected_mode1 = "user2_mode";
        request_mode1 = mode2;
    }
    else if(user3 == request_id)
    {
        selected_user1 = "user_id3";
        selected_mode1 = "user3_mode";
        request_mode1 = mode3;
    }
    else if(user4 == request_id)
    {
        selected_user1 = "user_id4";
        selected_mode1 = "user4_mode";
        request_mode1 = mode4;
    }else{
        selected_user1 = "user_id4";
        selected_mode1 = "user4_mode";
        request_mode1 = mode4;
        console.log("error!");
    }

    return {selected_user : selected_user1, selected_mode : selected_mode1, request_mode : request_mode1};


}


/**
 *  요청한 당직 맞변경을 수락한다.
 */
function acceptChangeDuty(con,req,res){

    console.log(req.body);

    var index = req.body.index;
    var request_date1 = req.body.request_date1;
    var request_date2 = req.body.request_date2;
    var request_id1 = req.body.request_id1;
    var request_id2 = req.body.request_id2;

    request_date1 = new Date(2016,1,1);
    request_date2 = new Date(2016,1,2);
    request_id1 = '1111';
    request_id2 = '2222';
    index = 1;

    var selected_user1 = "";
    var selected_mode1 = "";
    var request_mode1 = 0;

    var selected_user2= "";
    var selected_mode2 = "";
    var request_mode2 = 0;

    var update_query = "UPDATE `swmem`.`t_duty_change_history` SET `accepted`='1' WHERE `index`='" + index + "';";

    console.log(update_query);
    con.query(update_query, function(err, response){
        if(err){
            console.log(err);
        }else{

            if(response.length==0){
                console.log("error");

            }else{

                console.log(response);

                var get_query1 = " select * from  `swmem`.`t_duty` WHERE (`date`='"+request_date1.getFullYear()+"-"  + (request_date1.getMonth())
                    + "-" + request_date1.getDate()+ "');";


                console.log(get_query1);
                con.query(get_query1, function(err, response){
                    if(err){
                        console.log(err);
                    }else{

                        if(response.length==0){
                            console.log("error");

                        }else{

                            console.log(response);

                            var tmp = getRequestInfo(response[0] , request_id1);
                            selected_user1 = tmp.selected_user;
                            selected_mode1 = tmp.selected_mode;
                            request_mode1 = tmp.request_mode;

                            var get_query2 = " select * from  `swmem`.`t_duty` WHERE (`date`='"+request_date2.getFullYear()+"-"  + (request_date2.getMonth())
                                + "-" + request_date2.getDate()+ "');";


                            console.log(get_query2);
                            con.query(get_query2, function(err, response){
                                if(err){
                                    console.log(err);
                                }else{

                                    if(response.length==0){
                                        console.log("error");

                                    }else{

                                        console.log(response);

                                        var tmp = getRequestInfo(response[0] , request_id2);
                                        selected_user2 = tmp.selected_user;
                                        selected_mode2 = tmp.selected_mode;
                                        request_mode2 = tmp.request_mode;

                                        var change_query1 = "UPDATE `swmem`.`t_duty` " +
                                            "SET `" + selected_user1+ "`='"+request_id2+"', " +
                                            "`"+selected_mode1+"`='" +request_mode2 + "' " +
                                            "WHERE (`date`='"+request_date1.getFullYear()+"-"  + (request_date1.getMonth())
                                            + "-" + request_date1.getDate()+ "');";

                                        /*
                                         request_user1 처리하는 부분
                                         */

                                        console.log(change_query1);
                                        con.query(change_query1, function(err, response){
                                            if(err){
                                                console.log(err);
                                            }else{

                                                if(response.length==0){
                                                    console.log("error");

                                                }else{

                                                    console.log(response);

                                                    var change_query2 = "UPDATE `swmem`.`t_duty` " +
                                                        "SET `" + selected_user2+ "`='"+request_id1+"', " +
                                                        "`"+selected_mode2+"`='" +request_mode1 + "' " +
                                                        "WHERE (`date`='"+request_date2.getFullYear()+"-"  + (request_date2.getMonth())
                                                        + "-" + request_date2.getDate()+ "');";

                                                    /*
                                                     request_user1 처리하는 부분
                                                     */

                                                    console.log(change_query2);
                                                    con.query(change_query2, function(err, response){
                                                        if(err){
                                                            console.log(err);
                                                        }else{

                                                            if(response.length==0){
                                                                console.log("error");

                                                            }else{

                                                                console.log(response);

                                                                res.send(response);

                                                            }
                                                        }
                                                    });


                                                }
                                            }
                                        });

                                    }
                                }
                            });


                        }
                    }
                });

            }
        }
    });



}



function getID(con,req,res){

    var id  = req.session.passport.user.id;

    res.send(id);
}


function showChangeDutyHistrory(con,req,res){

    console.log(req.body);


    var id  = req.session.passport.user.id;

    var query = "SELECT * ,(select u_name from t_user where u_id = request_userid1),(select u_name from t_user where u_id = request_userid2) FROM swmem.t_duty_change_history where (request_userid1 =" +
        "'"+id+"' or request_userid2 = " +
        "'"+id+"');";

    console.log(query);
    con.query(query, function(err, response){

        if(err){
            console.log(err);
        }else{

            if(response.length==0){
                console.log("error");

            }else{


                console.log(response);

                res.send(response);

                //if(response.affectedRows > 0){
                //    res.send("success");
                //    console.log("success");
                //}else{
                //    res.send("fail");
                //    console.log("fail");
                //}

            }
        }
    });


}


function requestChangeDuty(con,req,res){


    console.log(req.body);

    var request_date1 = req.body.request_date1;
    var request_date2 = req.body.request_date2;
    var request_id1 = req.session.passport.user.id;
    var request_id2 = req.body.request_id2;

    request_date1 = new Date(request_date1);
    request_date2 = new Date(request_date2);

    var query = "INSERT INTO `swmem`.`t_duty_change_history` (`request_date1`, `request_userid1`, `request_date2`, `request_userid2`) " +
        "VALUES ('" +request_date1.getFullYear() +"-"+(request_date1.getMonth()+1) + "-"+request_date1.getDate()+"'" +
        ", '" +request_id1 + "', " +
        "'" +request_date2.getFullYear() +"-"+(request_date2.getMonth()+1) + "-"+request_date2.getDate()+"', " +
        "'" +request_id2 + "');";

    console.log(query);
    con.query(query, function(err, response){

        if(err){
            console.log(err);
        }else{

            if(response.length==0){
                console.log("error");

            }else{

                if(response.affectedRows > 0){
                    res.send("success");
                    console.log("success");
                }else{
                    res.send("fail");
                    console.log("fail");
                }

            }
        }
    });
}








function loadDuty(con,req,res){

    var year = req.body.year;
    var month = req.body.month;
    var date = req.body.date;

    var loadDutyQuery = "select * from swmem.t_duty where month(date)= " + month + " and year(date) = " + year + " and dayofmonth(date) = " + date;



    console.log(loadDutyQuery);
    con.query(loadDutyQuery, function(err, response){

        if(err){
            console.log(err);
        }else{

            if(response.length==0){
                console.log("error");

            }else{
                var data = response[0];
                var sendData ;
                sendData = data;
                var user_size = 0;

                if(data.user_id1 != null){
                    user_size++;
                }
                if(data.user_id2 != null){
                    user_size++;
                }
                if(data.user_id3 != null){
                    user_size++;
                }
                if(data.user_id4 != null){
                    user_size++;
                }

                sendData.user_size = user_size;

                res.send(sendData);
                console.log(sendData);
            }
        }
    });

}




function getName(con, req, res ){

    var id = req.body.id;

    var getNameQuery = " select u_name from t_user where u_id = '" + id + "';";

    console.log(getNameQuery);

    con.query(getNameQuery, function(err, response){

        if(err){
            console.log(err);
        }else{
            console.log(response[0]);
            res.send(response[0].u_name);
            //return response[0].u_name;
        }

    });

}



function modifyPointHistoty(con,req,res){

    var receiveId = req.body['receive_id[]'];
    var addTime = req.body.addTime;
    var mode = req.body.mode;
    var point = req.body.point;
    var reason = req.body.reason;
    var modify_reason = req.body.modify_reason;
    var modify_point = req.body.modify_point;
    var modify_mode = req.body.modify_mode;


    for(var i=0;i<receiveId.length;i++){
        var id = receiveId[i];

        var modify_query =  minusPointQuery(id,mode,point);
        console.log(modify_query);
        con.query(modify_query, function(err, response){

            if(err){
                console.log(err);
            }else{
                console.log(response);
            }
        });

        var add_query = addPointQuery(id,modify_mode,modify_point);
        console.log(add_query);
        con.query(add_query, function(err, response){

            if(err){
                console.log(err);
            }else{
                console.log(response);
            }
        });

    }


    var convertDate = new Date(addTime);

    var time = convertDate.getFullYear() + "-" + (convertDate.getMonth()+1)+ "-" + convertDate.getDate() + " "  + convertDate.getHours() + ":" + convertDate.getMinutes() +  ":" + convertDate.getSeconds() ;

    var modify_history_query = " UPDATE `swmem`.`t_duty_point_history` SET `mode`='"+ modify_mode+  " ', `point`='" + modify_point+"', `reason`='"+ modify_reason+ "' WHERE `add_time`='"+time+"';";

    console.log(modify_history_query);

    con.query(modify_history_query, function(err, response){

        if(err){
            res.send("error");
        }else{
            console.log(response);
            res.send("success");
        }

    });





}




function removePointHistory(con,req,res){

    var receiveId = req.body['receive_id[]'];
    var receiveName  = req.body["receive_name[]"];
    var year = req.body.year;
    var month = req.body.month;
    var date = req.body.date;
    var addTime = req.body.addTime;
    var mode = req.body.mode;
    var point = req.body.point;
    var reason = req.body.reason;

    for(var i=0;i<receiveId.length;i++){
        var id = receiveId[i];

        var query =  minusPointQuery(id,mode,point);
        console.log(query);
        con.query(query, function(err, response){

            if(err){
                console.log(err);
            }else{
                console.log(response);
            }
        });
    }


    var convertDate = new Date(addTime);

    var time = convertDate.getFullYear() + "-" + (convertDate.getMonth()+1)+ "-" + convertDate.getDate() + " "  + convertDate.getHours() + ":" + convertDate.getMinutes() +  ":" + convertDate.getSeconds() ;

    var delete_history_query = " DELETE FROM t_duty_point_history where add_time = '" +time + "';";

    console.log(delete_history_query);

    con.query(delete_history_query, function(err, response){

        if(err){
            res.send("error");
        }else{
            console.log(response);
            res.send("success");
        }

    });

}


function getMemberList(con,req,res){

    var query = "select u_id, u_name, u_sex, u_birth, u_phone, u_email, u_state, u_period," +
        " u_branch, u_device , u_token, u_mileage, u_good_duty_point, u_bad_duty_point," +
        " u_manager_bad_duty_point, u_photo_url, u_register_date from t_user";

    console.log(query);
    con.query(query, function(err, response){

        //console.log(response);

        console.log("send all memberList to browser");
        res.send(response);

    });


}



function getAddPoint(con,req,res){


    var send_id = req.session.passport.user.id;


    // Client에서 오는 데이터터

    var currentDate = new Date();
    var month = currentDate.getMonth()+1;
    var year = currentDate.getFullYear();
    var date = currentDate.getDate();


    var query = "SELECT * ,(select u_name from t_user where u_id = receive_user) FROM t_duty_point_history " +
        "where send_user = '"+ send_id  +"'  " +
    " and month(t_duty_point_history.date) = " + month +
    " and year(t_duty_point_history.date) = "+ year +";";


   // console.log(query);
    con.query(query, function(err, response){

        if(err){

            console.log(err);

        }
        else{

            var datas =[];

            for (var i=0;i<response.length;i++){
                var row = response[i];
                datas[i] ={};
                datas[i].receive_name = row['(select u_name from t_user where u_id = receive_user)'];
                datas[i].receive_id = row.receive_user;
                datas[i].year = row.date.getFullYear();
                datas[i].month = row.date.getMonth() + 1;
                datas[i].date = row.date.getDate();
                datas[i].addTime = row.add_time;
                datas[i].mode = row.mode;
                datas[i].point = row.point;
                datas[i].reason = row.reason;
            }


            if(datas.length==0){

                console.log("there is no data");

            }

            else{
                var convertData = [];
                var count = 0;
                var time = datas[0].addTime.toString();
                for(var i=0;i<datas.length;i++){
                    var data = datas[i];

                    if ( typeof convertData[count] == "undefined" )  {
                        convertData[count] = {
                            receive_name : [],
                            receive_id : []
                        };
                    }


                    if(time === data.addTime.toString()){
                        (convertData[count].receive_name).push(data.receive_name);
                        (convertData[count].receive_id).push(data.receive_id);
                        convertData[count].year = data.year;
                        convertData[count].month = data.month;
                        convertData[count].date = data.date;
                        convertData[count].addTime = data.addTime;
                        convertData[count].mode = data.mode;
                        convertData[count].point = data.point;
                        convertData[count].reason = data.reason;
                    }else{
                        time = data.addTime.toString();
                        count++;
                        if ( typeof convertData[count] == "undefined" )  {
                            convertData[count] = {
                                receive_name : [],
                                receive_id : []
                            };
                        }

                        (convertData[count].receive_name).push(data.receive_name);
                        (convertData[count].receive_id).push(data.receive_id);
                    }

                }

                res.send(convertData);
                console.log(convertData);
            }
        }
    });


}


function addPoint(con,req,res){


    // sended data
    console.log(req.body);
    var send_id = req.session.passport.user.id;
    var success_flag = 1;
    var point = req.body.point;
    var mode = req.body.mode;
    var reason = req.body.reason;
    var year = req.body.year;
    var month =req.body.month;
    var date = req.body.date;
    var recieveUserList = req.body['recieveUserList[]'];


    for( var i =0; i<recieveUserList.length;i++){

        var recieveUser = recieveUserList[i];
        var updatePointHistory = "INSERT INTO t_duty_point_history (`date`, `receive_user`, `send_user`, `mode`, `point`, `reason`) " +
            "VALUES ('"+ year  +"-" + month+ "-" + date + "', '" + recieveUser + "', '" + send_id +"', '" + mode +"', '" + point + "', '" +reason + "');"


        console.log(updatePointHistory);
        con.query(updatePointHistory, function(err, response){
            console.log(response);
            if(response.affectedRows < 1){
                success_flag = 0;
            }
        });

        var addPoint = "";

        // 상당직
        if(mode == 0){
            addPoint =  'update t_user set u_good_duty_point = u_good_duty_point + ' + point +  ' where u_id = "' + recieveUser +'";';
        }
        //벌당직
        else if(mode == 1){
            addPoint =  'update t_user set u_bad_duty_point = u_bad_duty_point + ' + point +  ' where u_id = "' + recieveUser +'";';
        }
        //운영실 벌당직
        else if(mode == 2){
            addPoint =  'update t_user set u_manager_bad_duty_point = u_manager_bad_duty_point + ' + point +  ' where u_id = "' + recieveUser +'";';
        }
        console.log(addPoint);
        con.query(addPoint, function(err, response){

            console.log(response);

            if(response.affectedRows < 1){
                success_flag = 0;
            }
        });
    }

    if(success_flag == 1) {
        var data = "success";
    }
    else{
        var data = "fail";
    }

    res.send(data);

}


function loadMyPointHistory(con,req,res){

    var id = req.session.passport.user.id;
    // 클라이언트에서 오는 데이터

    var year = req.body.year;
    var month =req.body.month;

    console.log(req.body);

    var query = "select date ,(select u_name from t_user where u_id = send_user), mode ,point, reason from t_duty_point_history Inner join t_user " +
        'on t_duty_point_history.receive_user = "' + id +'" '+
        "and month(t_duty_point_history.date) = " + month  +
        " and year(t_duty_point_history.date) = " + year +
        " and t_user.u_id = t_duty_point_history.receive_user"
        "  ;";
    console.log(query);
    con.query(query, function(err, response){


        if(err){
            console.log(err);
        }else{

            var datas =[];
            console.log(response);

            for (var i=0;i<response.length;i++){
                var row = response[i];
                datas[i] ={};
                datas[i].month = row.date.getMonth() + 1;
                datas[i].date = row.date.getDate();
                datas[i].send_user = row['(select u_name from t_user where u_id = send_user)'];
                datas[i].mode = row.mode;
                datas[i].point = row.point;
                datas[i].reason = row.reason;
            }

            res.send(datas);
            console.log(datas);
        }

    });

}


// 자신의 벌당직 상황을 조회한다.
function loadMyDuty(con,req,res){

    var id = req.session.passport.user.id;

    //클라이언트에서 오는 데이터터

    var month = req.body.month;
    var year = req.body.year;


    var query = "select * from swmem.t_duty where ( user_id1 = " + id + " or user_id2 = " + id + " or user_id3 = " + id + " or user_id4 = " + id
        + ") and month(date)= " + month + " and year(date) = " + year;

    console.log(query);

    con.query(query, function(err, response){

        if(err){
            console.log(err);
        }else{
            var datas =[];

            for (var i=0;i<response.length;i++){
                var row = response[i];
                datas[i] ={};
                datas[i].month = row.date.getMonth() + 1;
                datas[i].date = row.date.getDate();

                if(row.user_id1 == id){
                    datas[i].type = row.user1_mode;
                }
                else if(row.user_id2 == id){
                    datas[i].type = row.user2_mode;
                }else if(row.user_id3 == id){
                    datas[i].type = row.user3_mode;
                }else if(row.user_id4 == id){
                    datas[i].type = row.user4_mode;
                }else{
                    datas[i].type = 0;
                    console.log("type error!");
                }

            }

            res.send(datas);
            console.log(datas);
        }
    });


}

function getUser(con, req, res){
    var id = req.session.passport.user.id;
    var name = req.session.passport.user.name;

    var query = 'SELECT u_good_duty_point, u_bad_duty_point, u_manager_bad_duty_point FROM swmem.t_user where u_id = "'+ id + '";';
    con.query(query, function(err, response){

        if(err){
            throw err;
            console.log(err);
        }
        else{

            var data = {};
            data.id = id;
            data.name = name;
            data.good_duty_point = response[0].u_good_duty_point;
            data.bad_duty_point = response[0].u_bad_duty_point;
            data.manager_bad_duty_point = response[0].u_manager_bad_duty_point;
            res.send(data);
            console.log(data);
        }
    });


}



function minusPointQuery(id, mode, point){


    var addPoint = "";
    // 상당직
    if(mode == 0){
        addPoint =  'update t_user set u_good_duty_point = u_good_duty_point - ' + point +  ' where u_id = "' + id +'";';
    }
    //벌당직
    else if(mode == 1){
        addPoint =  'update t_user set u_bad_duty_point = u_bad_duty_point - ' + point +  ' where u_id = "' + id +'";';
    }
    //운영실 벌당직
    else if(mode == 2){
        addPoint =  'update t_user set u_manager_bad_duty_point = u_manager_bad_duty_point - ' + point +  ' where u_id = "' + id +'";';
    }

    return addPoint;
}

function addPointQuery(id, mode, point){
    var addPoint = "";

    // 상당직
    if(mode == 0){
        addPoint =  'update t_user set u_good_duty_point = u_good_duty_point + ' + point +  ' where u_id = "' + id +'";';
    }
    //벌당직
    else if(mode == 1){
        addPoint =  'update t_user set u_bad_duty_point = u_bad_duty_point + ' + point +  ' where u_id = "' + id +'";';
    }
    //운영실 벌당직
    else if(mode == 2){
        addPoint =  'update t_user set u_manager_bad_duty_point = u_manager_bad_duty_point + ' + point +  ' where u_id = "' + id +'";';
    }
    return addPoint;
}



exports.loadDuty =loadDuty;
exports.getName = getName;
exports.modifyPointHistoty =modifyPointHistoty;
exports.removePointHistory = removePointHistory;
exports.loadMyDuty = loadMyDuty;
exports.getUser = getUser;
exports.loadMyPointHistory =loadMyPointHistory;
exports.addPoint = addPoint;
exports.getAddPoint = getAddPoint;
exports.getMemberList = getMemberList;
exports.requestChangeDuty = requestChangeDuty;
exports.showChangeDutyHistrory = showChangeDutyHistrory;
exports.getID = getID;
exports.declineChangeDuty = declineChangeDuty;
exports.acceptChangeDuty = acceptChangeDuty;
exports.forceChangeDuty = forceChangeDuty;