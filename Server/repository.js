
/**
 * Created by DBK on 2015. 11. 15..
 */

var mysql = require('mysql');

var config = {
    host:"localhost",
    port:"3306",
    user:"root",
    password:"qwer1234",
    database:"swmem"
}

var conn = mysql.createConnection(config);

var TABLE_USER = "t_user";



function getUserInfo(req, res){

    conn.query("SELECT * FROM "+TABLE_USER+" where u_id = ?", [req.userName], function(err,rows){

        if(err){
            console.log("MySQL Failure.");
            console.log(err);
            return false;
        }

        console.log(rows);
        conn.destroy();
        return rows;


    });
};

function setUserInfo(req, res){

    var sex = (req.sex_info == "mail") ? 1 : 2;
    var state = 5; //승인대기
    var branch = 1; //수원
    var device = 0;
    var token = "";
    var mileage = 0;
    var good_point = 0;
    var bad_point = 0;
    var manager_bad_point = 0;
    var photo_url = "";
    var register_date = Date.now();

    conn.query("INSERT INTO "+TABLE_USER+" SET u_id = ?, u_password = ?, u_name = ?, u_sex = ?, u_birth = ?, u_phone = ?, u_email = ?, u_state = ?, u_period = ?, u_branch = ?, u_device = ?, u_token = ?, u_mileage = ?, u_good_duty_point = ?, u_bad_duty_point = ?, u_manager_bad_duty_point = ?, u_photo_url = ?, u_register_date = ?",
        [req.id, req.password, req.name, sex, req.birth, req.phone, req.mail, state, req.period, branch, device, token, mileage, good_point, bad_point, manager_bad_point, photo_url, register_date],
        function(err,rows){

        if(err){
            console.log("MySQL Failure.");
            console.log(err);
            return false;
        }

        conn.destroy();

        return true;

    });
};

function checkUserId(req, res){

    conn.query("SELECT * FROM "+TABLE_USER+" where u_id = ?", [req.userName], function(err,rows){

        if(err){
            console.log("MySQL Failure.");
            console.log(err);
            return false;
        }

        console.log(rows.length);

        if(0<rows.length){
            //already exist
            conn.destroy();
            return false;
        }else{
            //you can use this id.
            conn.destroy();
            return true;
        }

    });
};


exports.getUserInfo = getUserInfo;
exports.getUserInfo = setUserInfo;
exports.checkUserId = checkUserId;