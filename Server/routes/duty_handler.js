/**
 * Created by HyunJae on 2015. 12. 20..
 */



function getMemberList(con,req,res){

    var query = "select u_id, u_name, u_sex, u_birth, u_phone, u_email, u_state, u_period," +
        " u_branch, u_device , u_token, u_mileage, u_good_duty_point, u_bad_duty_point," +
        " u_manager_bad_duty_point, u_photo_url, u_register_date from t_user";

    console.log(query);
    con.query(query, function(err, response){

        console.log(response);
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

        var datas =[];
       // console.log(response);

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


       // console.log(datas);
        console.log(datas[0].addTime.toString());
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
    });


}


function modifyPoint(con,req,res){

    var send_id = req.session.passport.user.id;



    // Client에서 오는 데이터터
    var currentDate = new Date();
    var recieveUserList = ["111111","222222"];
    var month = currentDate.getMonth()+1;
    var year = currentDate.getFullYear();
    var date = currentDate.getDate();
    var point = 2;
    var mode = 1;
    var reason = "한번 줘봤어 세캬"




}


function addPoint(con,req,res){

    var send_id = req.session.passport.user.id;
    var success_flag = 1;


    // Client에서 오는 데이터터
    var currentDate = new Date();
    var recieveUserList = ["111111","222222"];
    var month = currentDate.getMonth()+1;
    var year = currentDate.getFullYear();
    var date = currentDate.getDate();
    var point = 2;
    var mode = 1;
    var reason = "한번 줘봤어 세캬"


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
    var currentDate = new Date();
    var month = currentDate.getMonth()+1;
    var year = currentDate.getFullYear();


    var query = "select date ,(select u_name from t_user where u_id = send_user), mode ,point, reason from t_duty_point_history Inner join t_user " +
        'on t_duty_point_history.receive_user = "' + id +'" '+
        "and month(t_duty_point_history.date) = " + month  +
        " and year(t_duty_point_history.date) = " + year +
        " and t_user.u_id = t_duty_point_history.receive_user"
        "  ;";
    console.log(query);
    con.query(query, function(err, response){

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
    });

}


function loadMyDuty(con,req,res){

    var id = req.session.passport.user.id;


    //클라이언트에서 오는 데이터터
   var currentDate = new Date();
    var month = currentDate.getMonth()+1;
    var year = currentDate.getFullYear();



    var query = "select * from swmem.t_duty where user_id1 = " + id + " or user_id2 = " + id + " or user_id3 = " + id + " or user_id4 = " + id
        + " and month(date)= " + month + " and year(date) = " + year;

    con.query(query, function(err, response){


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
    });


}

function getUser(con, req, res){
    var id = req.session.passport.user.id;
    var name = req.session.passport.user.name;

    var query = 'SELECT u_good_duty_point, u_bad_duty_point, u_manager_bad_duty_point FROM swmem.t_user where u_id = "'+ id + '";';
    con.query(query, function(err, response){
        console.log(response);
        var data = {};
        data.id = id;
        data.name = name;
        data.good_duty_point = response[0].u_good_duty_point;
        data.bad_duty_point = response[0].u_bad_duty_point;
        data.manager_bad_duty_point = response[0].u_manager_bad_duty_point;
        res.send(data);
        console.log(data);
    });


}


function loadNormalHardware(con, req, res){
    var query = 'select * from t_hardware where h_type=0';
    con.query(query, function(err, response){
        res.send(response);
    });
}

function loadSpecialHardware(con, req, res){
    var query = 'select * from t_hardware where h_type=1';
    con.query(query, function(err, response){
        res.send(response);
    })
}

function borrowHardware(con, req, res){
    var query1 = 'insert into t_hardware_rental SET ?';
    var dataset = {
        hr_user : req.session.passport.user.id,
        hr_hardware_id : req.body.hardware_id,
        hr_rental_date : getDate(new Date(), 0),
        hr_due_date : getDate(new Date(), 14)
    };
    con.query(query1, dataset);
    var query2 = 'update t_hardware set h_remaining=h_remaining-1 where h_id="'+req.body.hardware_id+'"';
    con.query(query2);
}

function loadLender(con, req, res){
    var query = 'select * from t_user a join t_hardware_rental b on a.u_id=b.hr_user where b.hr_hardware_id="'+req.body.hardware_id+'"';
    con.query(query, function(err, response){
        res.send(response);
    });
}

function turnInHardware(con, req, res){
    var query1 = 'update t_hardware set h_remaining=h_remaining+1 where h_id="' + req.body.hardware_id + '"';
    con.query(query1);
    var query2 = 'insert into t_hardware_return SET ?';
    var dataset = {
        ht_user : req.session.passport.user.id,
        ht_hardware_id: req.body.hardware_id,
        ht_rental_date: req.body.rental_date,
        ht_return_date: getDate(new Date(), 0)
    };
    con.query(query2, dataset);
    var query3 = 'delete from t_hardware_rental where hr_id="' + req.body.rental_id + '"';
    con.query(query3);
}

function postponeHardware(con, req, res){
    var changed_date = getDate(req.body.due_date, 14);
    var query = 'update t_hardware_rental set hr_extension_cnt=hr_extension_cnt+1, hr_due_date="' + changed_date + '" where hr_id="' + req.body.rental_id + '"';
    con.query(query);
}

function loadMynormalHardware(con, req, res){
    var query = 'select * from t_hardware a join t_hardware_rental b on a.h_id=b.hr_hardware_id where a.h_type=0 and hr_user="'+ req.session.passport.user.id +'"';
    con.query(query, function(err, response){
        res.send(response);
    });
}

function loadMyspecialHardware(con, req, res){
    var query = 'select * from t_hardware a join t_hardware_rental b on a.h_id=b.hr_hardware_id where a.h_type=1 and hr_user="'+ req.session.passport.user.id +'"';
    con.query(query, function(err, response){
        res.send(response);
    })
}

function getDate(base, plusDate){
    var tempDate = new Date(base);
    tempDate.setDate(tempDate.getDate() + plusDate);
    var date = tempDate.getFullYear() + '/' + (tempDate.getMonth()+1) + '/' + (tempDate.getDate());
    return date;
}


exports.loadMyDuty = loadMyDuty;
exports.getUser = getUser;
exports.loadMyPointHistory =loadMyPointHistory;
exports.addPoint = addPoint;
exports.modifyPoint = modifyPoint;
exports.getAddPoint = getAddPoint;
exports.getMemberList = getMemberList;


exports.postponeHardware = postponeHardware;
exports.loadLender = loadLender;
exports.turnInHardware = turnInHardware;
exports.loadMynormalHardware = loadMynormalHardware;
exports.loadMyspecialHardware = loadMyspecialHardware;
exports.borrowHardware = borrowHardware;
exports.loadSpecialHardware = loadSpecialHardware;
exports.loadNormalHardware = loadNormalHardware;