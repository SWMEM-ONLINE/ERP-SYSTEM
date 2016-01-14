/**
 * Created by HyunJae on 2015. 12. 20..
 *
 *
 *
 * duty에서 상벌당직, 당직에 관한 함수를 처리해주는 핸들러 역할을 한다.
 *
 *
 */

var util = require('./util');



function initLastDuty(con,req,res){

    var query = "UPDATE `swmem`.`t_user` SET `u_last_duty`= 0 WHERE `u_last_duty` > 0;";

    console.log(query);
    con.query(query,function(err, response){

        if(err){
            console.log(err);
            res.send("error");
            throw err;
        }
        else{
            console.log(response);
            res.send("success");
        }


    });
}

/**
 *  Duty객체를 생성하는 생성자이다
 *
 * @param date
 * @constructor
 */
function Duty(date) {
    this.date = date;
    this.user1 = null;
    this.user2 = null;
    this.user3 = null;
    this.user4 = null;
    this.mode1 = null;
    this.mode2 = null;
    this.mode3 = null;
    this.mode4 = null;
    this.count = 0;

    this.addUser = function(user, mode){
        if(user != this.user1 && user != this.user2 && user != this.user3 && user != this.user4 ){
            if(this.count ==0){
                this.user1 = user;
                this.mode1 = mode;
                this.count++;
                return true;
            }else if(this.count == 1){
                this.user2 = user;
                this.mode2 = mode;
                this.count++;
                return true;
            }else if(this.count == 2){
                this.user3 = user;
                this.mode3 = mode;
                this.count++;
                return true;
            }else if (this.count ==3 ){
                this.user4 = user;
                this.mode4 = mode;
                this.count++;
                return true;
            }else{
                return false;
            }
        }
        return false;
    };
}

/**
 *
 * 회원들의 상벌당직을 합산시킨다.
 *
 * @param con
 * @param req
 * @param res
 */
function updateMemberPoint(con,req,res){

    var memberList = [];

    var query = "select u_id, u_name, u_good_duty_point, u_bad_duty_point, u_manager_bad_duty_point,u_last_duty from t_user;";

    console.log(query);

    con.query(query, function(err, response){

        if(err){
            console.log(err);
        }
        else{

            for(var i =0;i<response.length;i++){
                var data = response[i];

                var Member ={};
                Member.id = data.u_id;
                Member.name = data.u_name;
                Member.good_point = data.u_good_duty_point;
                Member.bad_point = data.u_bad_duty_point;
                Member.manage_bad_point = data.u_manager_bad_duty_point;
                Member.last_month = data.u_last_duty;


                var result = pointSort(Member);
                Member.good_point = result.good_point;
                Member.bad_point = result.bad_point;
                Member.manage_bad_point = result.manage_bad_point;
                memberList.push(Member);

            }

            updateMembers(con,memberList , function(data){

                console.log(data);
                if(data == "success"){
                    res.send(data);
                }
                else{
                    res.send("fail");
                }

            });

        }

    });

}




/**
 * 실질적으로 멤버들의 상벌당직을 업그레이드 시키는 부분
 * @param con
 * @param memberList
 * @param callback
 */
function updateMembers( con, memberList , callback){
    var member;
    var query = '';
    for ( var i  in memberList)
    {
        if(memberList.hasOwnProperty(i)){
            member = memberList[i];
            query += "UPDATE `swmem`.`t_user` " +
                "SET `u_good_duty_point`='" + member.good_point + "', " +
                "`u_bad_duty_point`='" + member.bad_point + "'," +
                " `u_manager_bad_duty_point`='" + member.manage_bad_point +  "' " +
                "WHERE `u_id`='" +member.id +  "';";
        }

    }

    console.log(query);

    con.query(query, function( err, response){
        if(err)
        {
            console.log(err);
            callback(err);
        }
        else
        {
            console.log(response);
            callback("success");
        }
    });
}


/**
 * 맴버에 있는 데이터들을 소팅하구 결과를 result라는 객체로 보낸다.
 *
 * @param data
 * @returns {{}}
 */
function pointSort(data){

    var goodDuty = parseInt(data.good_point);
    var badDuty = parseInt(data.bad_point);
    var manageDuty = parseInt(data.manage_bad_point);

    if(goodDuty>=badDuty){
        goodDuty -=badDuty;
        badDuty = 0;
    }
    else{
        badDuty -= goodDuty;
        goodDuty=0;
    }

    var result = {};
    result.good_point = goodDuty;
    result.bad_point = badDuty;
    result.manage_bad_point = manageDuty;

    return result;
}


/**
 *
 * @param memberList    정회원리스트
 * @param memberList2   정회원 + 자치회의 벌당직회원리스트
 * @param dutyList      생성된 날짜별로 존재하는 당직객체
 * @param duty_count
 * @param bad_duty_count
 * @returns {*}
 */
function generateDuty(memberList,memberList2, dutyList, duty_count , bad_duty_count){

    var i;
    var member;
    var duty;
    var bad_duty_list = [];


    /*
     memberList2를 활용해 bad_duty_list를 만든다
     */

    while (true) {
        var count = 0;
        for (i = 0; i < memberList2.length; i++) {
            member = memberList2[i];

            if (member.bad_point > 0) {
                bad_duty_list.push(member);
                member.bad_point--;
            }
            else if (member.manage_bad_point > 0) {
                bad_duty_list.push(member);
                member.manage_bad_point--;
            } else {
                count++;
            }
        }

        if (count == memberList2.length) {
            break;
        }
    }
    console.log("make bad_duty_list");

    /*
        벌당직을 생성하는 부분
     */
    while(bad_duty_count>0 && bad_duty_list.length !=0){

        for(i =0 ; i < dutyList.length; i++){
            duty = dutyList[i];
            if(bad_duty_list.length >0){
                member = bad_duty_list.shift();

                if(duty.addUser(member.id , 1))
                {

                }
                else
                {
                    console.log("fail to in " + duty.date + " is " + member.id );
                    bad_duty_list.push(member);
                }
            }
        }

        bad_duty_count--;
    }
    console.log("벌당직 리스트 생성");

    /*
        일반당직을 생성하는 부분
     */
    while(true){
       // console.log("와일문안");
        for(i =0 ; i < dutyList.length; i++){

            duty = dutyList[i];

            if(duty.count != duty_count){
                member = memberList.shift();
                duty.addUser(member.id,0);
                memberList.push(member);
            }

        }
        if(isCompelte(dutyList,duty_count)){
            break;
        }
    }
    console.log("duty List is genearated");

    return dutyList;

}


/**
 *
 * 모든 듀티가 설정되었는지 확인하는 부분이다.
 *
 * @param dutyList
 * @param duty_count
 * @returns {boolean}
 */
function isCompelte(dutyList , duty_count){

    var flag = 1;

    for(var i = 0 ; i < dutyList.length; i++){
        var duty = dutyList[i];
        if(duty.count != duty_count){
            flag = 0;
        }
    }

    return flag == 1;

}


/**
 *
 * 당직을 자동으로 설정하는 부분!
 *
 * @param con
 * @param req
 * @param res
 */
function autoMakeDuty(con,req,res){

    console.log(req.body);
    console.log(req.body['selected_days[]']);

    var selected_days;

    if(typeof req.body['selected_days[]'] == "undefined"){
        selected_days  = [];
    }else if(typeof req.body['selected_days[]'] == "string"){
        selected_days =[];
        selected_days.push(req.body['selected_days[]']);
    }
    else{
        selected_days = req.body['selected_days[]'];
    }

    console.log(selected_days);

    var duty_count =req.body.duty_count;
    var bad_duty_count = req.body.bad_duty_count;
    var year = req.body.year;
    var month = req.body.month;
    var maxDays = numberOfDays(year,month);

    var memberList = [] ;
    var memberList2 = [];
    var dutyList = [];

    /*
        당직 날짜 리스트를 설정한다
     */

    for(var i=1; i<=maxDays; i++){
        var date = new Date(year,month-1,i);
        var flag = 1 ;
        for(var j=0; j< selected_days.length; j++){

            var date2 = new Date(selected_days[j]);

            if(date.getDate() == date2.getDate())
            {
                flag=0;
            }

            if(flag==0)
            {
                break;
            }

        }
        if(flag==0){
            continue;
        }
        var duty = new Duty(date);
        dutyList.push(duty);
    }

    var query = "select u_id, u_name, u_good_duty_point, u_bad_duty_point, u_manager_bad_duty_point,u_last_duty from t_user where (u_state = 100) order by u_last_duty;";

    console.log(query);
    con.query(query, function(err, response){
        if(err){
            console.log(err);
            res.send("fail");
        }else{

            for(var i =0;i<response.length;i++){
                var data = response[i];
                var Member ={};
                Member.id = data.u_id;
                Member.name = data.u_name;
                Member.good_point = data.u_good_duty_point;
                Member.bad_point = data.u_bad_duty_point;
                Member.manage_bad_point = data.u_manager_bad_duty_point;
                Member.last_month = data.u_last_duty;
                memberList.push(Member);
            }


            var query = "select u_id, u_name, u_good_duty_point, u_bad_duty_point, u_manager_bad_duty_point,u_last_duty from t_user where (u_state <= 100 and u_state > 1) order by u_last_duty;";

            con.query(query, function(err, response){
                if(err){
                    console.log(err);
                    res.send("fail");
                }else {

                    for (var i = 0; i < response.length; i++) {
                        var data = response[i];
                        var Member = {};
                        Member.id = data.u_id;
                        Member.name = data.u_name;
                        Member.good_point = data.u_good_duty_point;
                        Member.bad_point = data.u_bad_duty_point;
                        Member.manage_bad_point = data.u_manager_bad_duty_point;
                        Member.last_month = data.u_last_duty;
                        memberList2.push(Member);

                    }


                    /*
                     멤버리스트는 저번달에 적은순으로 멤버리스트에 들어간다
                     멤버리스트 2는 저번달에 많은순으로 벌당직 리스트에 들어가게 된다.
                     */
                    memberList.sort(compare);
                    memberList2.sort(compare);


                    console.log(memberList);
                    console.log(memberList2);

                    dutyList = generateDuty(memberList,memberList2,dutyList,duty_count,bad_duty_count);

                    console.log(dutyList);

                    var len = dutyList.length;

                    console.log("len : " + len);
                    var result_data = 0;
                    insertDutyList(con,req,res,dutyList , function(data){
                        result_data+= data;

                        console.log("current result : " +result_data);
                        if(len == result_data){
                            res.send("success");
                        }
                    });

                    //console.log("send all memberList to browser");
                    //res.send(response);
                }

            });


        }

    });



}

function updateUserPoint(con,req,res,user_id,mode){
    //일반 당직일 경우
    if( mode == 0 ) {

    }
    // 벌당직일 경우
    else if( mode == 1 ){
        isBadorManage(con, user_id, function(data){
            if(data == 1){
                mode = 1;
            }
            else{
                mode = 2;
            }
            var query = minusPointQuery(user_id,mode,1);

            console.log(query);
            con.query(query, function (err, response){
                if(err){
                    console.log(err);
                }
                else{
                    console.log(response);
                }

            });

        });
    }
}

function isBadorManage( con, user_id , callback){
    var query = "select u_id, u_name, u_good_duty_point, u_bad_duty_point, u_manager_bad_duty_point,u_last_duty from t_user" +
        " where (u_id = '" + user_id + "');";

    console.log(query);
    con.query(query, function( err , response ){

        if(err){
            console.log(err);
        }
        else{
            var data = response[0];
            var Member ={};
            Member.id = data.u_id;
            Member.name = data.u_name;
            Member.good_point = data.u_good_duty_point;
            Member.bad_point = data.u_bad_duty_point;
            Member.manage_bad_point = data.u_manager_bad_duty_point;
            Member.last_month = data.u_last_duty;

            if(Member.bad_point > Member.manage_bad_point){
                callback(1);
            }
            else{
                callback(2);
            }

            console.log(response);
        }
    });
}

function updateLastDuty(con,duty){

    var query ="";

    if(duty.mode1 == 0){
        query+="UPDATE `swmem`.`t_user` SET `u_last_duty`=`u_last_duty` + 1  WHERE `u_id` = '" + duty.user1 +"';";
    }
    if(duty.mode2 == 0){

        query+="UPDATE `swmem`.`t_user` SET `u_last_duty`=`u_last_duty` + 1  WHERE `u_id` = '" + duty.user2 +"';";
    }
    if(duty.mode3 == 0){

        query+="UPDATE `swmem`.`t_user` SET `u_last_duty`=`u_last_duty` + 1  WHERE `u_id` = '" + duty.user3 +"';";
    }
    if(duty.mode4 == 0){

        query+="UPDATE `swmem`.`t_user` SET `u_last_duty`=`u_last_duty` + 1  WHERE `u_id` = '" + duty.user4 +"';";
    }
    con.query(query,function(err,response){

        if(err){
            console.log(err);

        }else{
            console.log(response);

        }
    });
}

function insertDutyList(con,req,res, dutyList, callback){

    for(var i = 0 ; i < dutyList.length; i++){
        var duty = dutyList[i];
        var date = duty.date;
        var count = duty.count;
        for(var j = 1 ; j<= count; j++){
            var user_id = duty["user"+j];
            var mode = duty["mode"+j];
            updateUserPoint(con,req,res,user_id,mode);
        }
        var query;


        updateLastDuty(con, duty);


        if(count==1){
            query = "INSERT INTO `swmem`.`t_duty` " +
                "(`date`, `user_id1`, `user1_mode`) " +
                "VALUES (" +
                "'"+date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()+"', " +
                "'"+ duty.user1 +"', " +
                "'"+ duty.mode1 +"');";
            console.log(query);

            con.query(query, function(err, response){
                if(err){
                    console.log(err);
                }else{
                    console.log(response);
                    callback(1);
                }
            });
        }
        else if(count==2){
            query = "INSERT INTO `swmem`.`t_duty` " +
                "(`date`, `user_id1`, `user_id2`, `user1_mode`, `user2_mode`) " +
                "VALUES (" +
                "'"+date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()+"', " +
                "'"+ duty.user1 +"', " +
                "'"+ duty.user2 +"', " +
                "'"+ duty.mode1 +"', " +
                "'"+ duty.mode2 +"');";
            console.log(query);
            con.query(query, function(err, response){
                if(err){
                    console.log(err);
                }else{
                    console.log(response);
                    callback(1);
                }

            });
        }
        else if(count==3){
            query = "INSERT INTO `swmem`.`t_duty` " +
                "(`date`, `user_id1`, `user_id2`, `user_id3`,  `user1_mode`, `user2_mode`, `user3_mode`) " +
                "VALUES (" +
                "'"+date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()+"', " +
                "'"+ duty.user1 +"', " +
                "'"+ duty.user2 +"', " +
                "'"+ duty.user3 +"', " +
                "'"+ duty.mode1 +"', " +
                "'"+ duty.mode2 +"', " +
                "'"+ duty.mode3 +"');";

            console.log(query);
            con.query(query, function(err, response){
                if(err){
                    console.log(err);
                }else{
                    console.log(response);
                    callback(1);
                }

            });
        }
        else if(count==4){
            query = "INSERT INTO `swmem`.`t_duty` " +
                "(`date`, `user_id1`, `user_id2`, `user_id3`, `user_id4`, `user1_mode`, `user2_mode`, `user3_mode`, `user4_mode`) " +
                "VALUES (" +
                "'"+date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()+"', " +
                "'"+ duty.user1 +"', " +
                "'"+ duty.user2 +"', " +
                "'"+ duty.user3 +"', " +
                "'"+ duty.user4 +"', " +
                "'"+ duty.mode1 +"', " +
                "'"+ duty.mode2 +"', " +
                "'"+ duty.mode3 +"', " +
                "'"+ duty.mode4 +"');";
            console.log(query);
            con.query(query, function(err, response){
                if(err){
                    console.log(err);
                }else{
                    console.log(response);
                    callback(1);
                }

            });
        }
    }
}


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
            res.send("fail");
        }else{

            var get_query1 = " select * from  `swmem`.`t_duty` WHERE (`date`='"+request_date1.getFullYear()+"-"  + (request_date1.getMonth()+1)
                + "-" + request_date1.getDate()+ "');";

            console.log(get_query1);
            con.query(get_query1, function(err, response){
                if(err){
                    console.log(err);
                }else{

                    if(response.length==0){
                        console.log("error");
                        res.send("fail");

                    }else{

                        console.log(response);

                        var tmp = getRequestInfo(response[0] , request_id1);
                        selected_user1 = tmp.selected_user;
                        selected_mode1 = tmp.selected_mode;
                        request_mode1 = tmp.request_mode;

                        var get_query2 = " select * from  `swmem`.`t_duty` WHERE (`date`='"+request_date2.getFullYear()+"-"  + (request_date2.getMonth()+1)
                            + "-" + request_date2.getDate()+ "');";


                        console.log(get_query2);
                        con.query(get_query2, function(err, response){
                            if(err){
                                console.log(err);
                            }else{

                                if(response.length==0){
                                    console.log("error");
                                    res.send("fail");

                                }else{

                                    console.log(response);

                                    var tmp = getRequestInfo(response[0] , request_id2);
                                    selected_user2 = tmp.selected_user;
                                    selected_mode2 = tmp.selected_mode;
                                    request_mode2 = tmp.request_mode;

                                    console.log(selected_user2 + selected_mode2 + request_mode2);

                                    var change_query1 = "UPDATE `swmem`.`t_duty` " +
                                        "SET `" + selected_user1+ "`='"+request_id2+"', " +
                                        "`"+selected_mode1+"`='" +request_mode2 + "' " +
                                        "WHERE (`date`='"+request_date1.getFullYear()+"-"  + (request_date1.getMonth()+1)
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
                                                res.send("fail");

                                            }else{

                                                console.log(response);

                                                var change_query2 = "UPDATE `swmem`.`t_duty` " +
                                                    "SET `" + selected_user2+ "`='"+request_id1+"', " +
                                                    "`"+selected_mode2+"`='" +request_mode1 + "' " +
                                                    "WHERE (`date`='"+request_date2.getFullYear()+"-"  + (request_date2.getMonth()+1)
                                                    + "-" + request_date2.getDate()+ "');";

                                                /*
                                                 request_user1 처리하는 부분
                                                 */

                                                console.log(change_query2);
                                                con.query(change_query2, function(err, response){
                                                    if(err){
                                                        console.log(err);
                                                        res.send("fail");
                                                    }else{
                                                        res.send("success");
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
    });



}



/**
    요청된 체인지 듀티를 바꾸는 확인
 */
function declineChangeDuty(con,req,res){

    console.log(req.body);


    var index = req.body.index;


    var update_query = "UPDATE `swmem`.`t_duty_change_history` SET `accepted`='2' WHERE `index`='" + index + "';";


    console.log(update_query);
    con.query(update_query, function(err, response){

        if(err){
            console.log(err);
            res.send("fail");
        }else{

            if(response.length==0){
                console.log("error");

                res.send("fail");
            }else{

                console.log(response);

                res.send("success");

            }
        }
    });


}

/**
 *  콜롬을 쌓아야 한다
 */
function getRequestInfo(data , request_id){


    console.log("getreq : " + request_id);

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
    var request_date1 = new Date(req.body.request_date1);
    var request_date2 = new Date(req.body.request_date2);
    var request_id1 = req.body.rq_id1;
    var request_id2 = req.body.rq_id2;
    var rq_id1 = request_id1;
    var rq_id2 = request_id2;
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
            res.send("fail");
        }else{

            if(response.length==0){
                console.log("error");
                res.send("fail");

            }else{

                console.log(response);

                var get_query1 = " select * from  `swmem`.`t_duty` WHERE (`date`='"+request_date1.getFullYear()+"-"  + (request_date1.getMonth()+1)
                    + "-" + request_date1.getDate()+ "');";


                console.log(get_query1);
                con.query(get_query1, function(err, response){
                    if(err){
                        console.log(err);
                        res.send("fail");
                    }else{

                        if(response.length==0){
                            console.log("error");
                            res.send("fail");

                        }else{

                            console.log(response[0]);

                            var tmp = getRequestInfo(response[0] , request_id1);
                            selected_user1 = tmp.selected_user;
                            selected_mode1 = tmp.selected_mode;
                            request_mode1 = tmp.request_mode;

                            var get_query2 = " select * from  `swmem`.`t_duty` WHERE (`date`='"+request_date2.getFullYear()+"-"  + (request_date2.getMonth()+1)
                                + "-" + request_date2.getDate()+ "');";


                            console.log(get_query2);
                            con.query(get_query2, function(err, response){
                                if(err){
                                    res.send("fail");
                                    console.log(err);
                                }else{

                                    if(response.length==0){
                                        res.send("fail");
                                        console.log("error");

                                    }else{

                                        //console.log(response[0]);

                                        var tmp = getRequestInfo(response[0] , request_id2);
                                        selected_user2 = tmp.selected_user;
                                        selected_mode2 = tmp.selected_mode;
                                        request_mode2 = tmp.request_mode;


                                        console.log(selected_user2);

                                        var change_query1 = "UPDATE `swmem`.`t_duty` " +
                                            "SET `" + selected_user1+ "`='"+rq_id2+"', " +
                                            "`"+selected_mode1+"`='" +request_mode2 + "' " +
                                            "WHERE (`date`='"+request_date1.getFullYear()+"-"  + (request_date1.getMonth()+1)
                                            + "-" + request_date1.getDate()+ "');";

                                        /*
                                         request_user1 처리하는 부분
                                         */

                                        console.log(change_query1);
                                        con.query(change_query1, function(err, response){
                                            if(err){
                                                res.send("fail");
                                                console.log(err);
                                            }else{

                                                if(response.length==0){
                                                    res.send("fail");
                                                    console.log("error");

                                                }else{

                                                    console.log(response);

                                                    var change_query2 = "UPDATE `swmem`.`t_duty` " +
                                                        "SET `" + selected_user2+ "`='"+rq_id1+"', " +
                                                        "`"+selected_mode2+"`='" +request_mode1 + "' " +
                                                        "WHERE (`date`='"+request_date2.getFullYear()+"-"  + (request_date2.getMonth()+1)
                                                        + "-" + request_date2.getDate()+ "');";

                                                    /*
                                                     request_user1 처리하는 부분
                                                     */

                                                    console.log(change_query2);
                                                    con.query(change_query2, function(err, response){
                                                        if(err){
                                                            res.send("fail");
                                                            console.log(err);
                                                        }else{

                                                            if(response.length==0){
                                                                console.log("error");

                                                                res.send("fail");
                                                            }else{

                                                                console.log(response);

                                                                res.send("success");

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


function showChangeDutyHistroryAll(con,req,res){

    console.log(req.body);


    var query = "SELECT * ,(select u_name from t_user where u_id = request_userid1),(select u_name from t_user where u_id = request_userid2) FROM swmem.t_duty_change_history ;";

    console.log(query);
    con.query(query, function(err, response){

        if(err){
            console.log(err);
            res.send({});
        }else{

            console.log(response);
            res.send(response);

        }
    });


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


            console.log(response);

            res.send(response);


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
                console.log("no data");
                res.send("no data");
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


function loadAllDuty(con,req,res){

    var year = req.body.year;
    var month = req.body.month;

    var loadDutyQuery = "select * , " +
        "(select u_name from t_user where user_id1= u_id)," +
        "(select u_name from t_user where user_id2= u_id)," +
        "(select u_name from t_user where user_id3= u_id)," +
        "(select u_name from t_user where user_id4= u_id) " +
        " from swmem.t_duty where month(date)= " + month + " and year(date) = " + year +";";


    console.log(loadDutyQuery);
    con.query(loadDutyQuery, function(err, response){

        if(err){
            console.log(err);
        }else{

            if(response.length==0){
                console.log("no data in duty where " +year + "-" + month);
                res.send("no data");
            }else{
                res.send(response);
                console.log(response);
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

    if(typeof receiveId == "string"){
        receiveId = new Array(receiveId);
    }

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
    var addTime = req.body.addTime;
    var mode = req.body.mode;
    var point = req.body.point;

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
        " u_manager_bad_duty_point, u_photo_url, u_register_date from t_user where u_state > 1";

    console.log(query);
    con.query(query, function(err, response){

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


    console.log(query);
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
                res.send({});

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
                        convertData[count].year = data.year;
                        convertData[count].month = data.month;
                        convertData[count].date = data.date;
                        convertData[count].addTime = data.addTime;
                        convertData[count].mode = data.mode;
                        convertData[count].point = data.point;
                        convertData[count].reason = data.reason;
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


    if(typeof recieveUserList == "string"){
        recieveUserList = new Array(recieveUserList);
    }


    console.log(typeof recieveUserList);
    console.log(recieveUserList);

    for( var i =0; i<recieveUserList.length;i++){

        var recieveUser = recieveUserList[i];
        var updatePointHistory = "INSERT INTO t_duty_point_history (`date`, `receive_user`, `send_user`, `mode`, `point`, `reason`) " +
            "VALUES ('"+ year  +"-" + month+ "-" + date + "', '" + recieveUser + "', '" + send_id +"', '" + mode +"', '" + point + "', '" +reason + "');";

        console.log(updatePointHistory);
        con.query(updatePointHistory, function(err, response){
            if(err){
                console.log(err);
                success_flag = 0;
            }else{
                console.log(response);

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
            if(err){
                console.log(err);
                success_flag = 0;
            }else{
                console.log(response);
            }
        });
    }
    var data;
    if(success_flag == 1) {
        data = "success";
    }
    else{
        data = "fail";
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
        " and t_user.u_id = t_duty_point_history.receive_user"+
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
    var query = "select * from swmem.t_duty where ( user_id1 = '" + id + "' or user_id2 = '" + id + "' or user_id3 = '" + id + "' or user_id4 = '" + id
        + "') and month(date)= " + month + " and year(date) = " + year;

    console.log(query);

    con.query(query, function(err, response){

        if(err){
            console.log(err);
        }else{
            var datas =[];

            for (var i=0;i<response.length;i++){
                var row = response[i];
                datas[i] ={};
                datas[i].year = year;
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
            console.log(err);
            throw err;
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


function loadTodayDuty(con,req,res){


    var currentDate = new Date();
    var year = currentDate.getFullYear();
    var month = currentDate.getMonth()+1;
    var date = currentDate.getDate();


    var query = "SELECT * , (SELECT u_name from t_user where u_id = user_id1  ),(SELECT u_name from t_user where u_id = user_id2  ),(SELECT u_name from t_user where u_id = user_id3  ),(SELECT u_name from t_user where u_id = user_id4  ) FROM swmem.t_duty " +
        "WHERE `date`=" +
        "'" + year + "" +
        "-" +
        "" + month + "" +
        "-" +
        "" +date + "';";

    con.query(query,function(err, response){

        if(err){
            console.log(err);
            res.send("error");
        }
        else{

            if(response.length ==0){

                res.send("no data");

            }
            else{
                var data = response[0];

                data.name1 = data['(SELECT u_name from t_user where u_id = user_id1  )'];
                data.name2 = data['(SELECT u_name from t_user where u_id = user_id2  )'];
                data.name3 = data['(SELECT u_name from t_user where u_id = user_id3  )'];
                data.name4 = data['(SELECT u_name from t_user where u_id = user_id4  )'];

                console.log(data);
                res.send(data);
            }
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



// 그달의 날짜수를 리턴해준다
function numberOfDays(year, month) {
    var d = new Date(year, month, 0);
    return d.getDate();
}

function compare(a,b) {
    if (a.last_month < b.last_month)
        return -1;
    if (a.last_month > b.last_month)
        return 1;
    return 0;
}


//
//function clone(obj) {
//    if (null == obj || "object" != typeof obj) return obj;
//    var copy = obj.constructor();
//    for (var attr in obj) {
//        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
//    }
//    return copy;
//}





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
exports.showChangeDutyHistroryAll = showChangeDutyHistroryAll;
exports.loadAllDuty = loadAllDuty;
exports.autoMakeDuty = autoMakeDuty;
exports.updateMemberPoint = updateMemberPoint;
exports.loadTodayDuty = loadTodayDuty;
exports.initLastDuty = initLastDuty;
