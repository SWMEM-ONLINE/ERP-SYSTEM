/**
 * Created by KIMDONGWON on 2015-12-14.
 */
var express = require('express');
var DB_handler = require('./DB_handler');
var con = DB_handler.connectDB();
var router = express.Router();
var util = require('./util');
var crypto = require('crypto');
//var user_handler = require('./user_handler');

router.get('/info', util.ensureAuthenticated, function(req, res, next) {
    var query = 'select u_id,u_name,u_sex,u_period,u_device,u_birth,u_email,u_phone,u_photo_url,u_push_flag,u_mail_flag from t_user where u_id="' + req.session.passport.user.id + '"';
    con.query(query, function(err, response){
        var send = JSON.stringify(response);
        res.render('user_info', {title: '사용자 정보', grade: util.getUserGrade(req), result:JSON.parse(send)});
    });
});

router.post('/info/edit', util.ensureAuthenticated, function(req, res, next) {

    var uId = util.getUserId(req);
    var currentPW = req.body.currentpw;
    var newPW = req.body.newpw;
    var newPhone = req.body.newphone;
    var newMail = req.body.newmail;
    var newImg = req.files.newimg;
    var newImgUrl;
    var encNewPW;
    if(newImg != undefined){
        newImgUrl = newImg.name;
    }

    var encCurrentPW = crypto.createHash('sha256').update(currentPW).digest('base64');
    if(newPW != undefined) {
        encNewPW = crypto.createHash('sha256').update(newPW).digest('base64');
    }

    var query = 'update t_user set';
    var flag = false;
    con.query('select u_password from t_user where u_id="'+uId+'"', function (err,result) {
        if (result[0].u_password == encCurrentPW) {
            if (newPW != undefined) {
                query += ' u_password = "' + encNewPW + '"';
                flag = true;
            }
            if (newMail != undefined) {
                if (flag) {
                    query += ',';
                }
                query += ' u_email="' + newMail + '"';
                flag = true;
            }
            if (newPhone != undefined) {
                if (flag) {
                    query += ',';
                }
                query += ' u_phone="' + newPhone + '"';
                flag = true;
            }

            if (newImgUrl != undefined) {
                if (flag) {
                    query += ',';
                }
                query += ' u_photo_url="' + newImgUrl + '"';
                flag = true;
            }

            query += ' where u_id = "' + uId + '"';
            con.query(query, function (err, result) {
                res.redirect('/user/info');
            });
        }
        else{
            res.redirect('/user/info');
        }
    });
});

router.post('/userlist', util.ensureAuthenticated, function(req, res, next) {

    var type = req.body.type;

    var query = 'select * from t_user';

    if(type == 'members'){
        query += ' WHERE u_state <= 103';
    }
    else if(type == 'command'){
        query += ' WHERE u_state <= 104';
    }

    query += ' order by u_period';

    con.query(query,function(err,rows){
        if (err) {
            console.error(err);
            throw err;
        }
        var send = JSON.stringify(rows);
        res.json(JSON.parse(send));
    });
});


router.post('/getFinishUserlist', util.ensureAuthenticated, function(req, res, next) {


    var connection = DB_handler.connectDB();
    connection.query('select * from t_user WHERE u_state = 102', function(err,data){

        if (err) {
            console.error(err);
            DB_handler.disconnectDB(connection);
            return res.json({status:'101'});
        }

        var userIds = data;

        var query = '';
        var userCnt = userIds.length;
        for(var i=0 ; i<userCnt ; i++){
            var uId = userIds[i].u_id;

            query += 'select f_id from t_fee where f_payer = "' + uId + '" AND f_state = 0;';
            query += 'select b.b_name name, DATEDIFF(CURDATE(), b.b_due_date) diff from t_book_rental a inner join t_book b on a.br_book_id=b.b_id where br_user="' + uId + '";';
            query += 'select b.h_name name, DATEDIFF(CURDATE(), a.hr_due_date) diff from t_hardware_rental a inner join t_hardware b on a.hr_hardware_id=b.h_id where a.hr_user="' + uId + '";';
        }

        connection.query(query,function(err,rows){
            if (err) {
                console.error(err);
                DB_handler.disconnectDB(connection);
                return res.json({status:'101'});
            }

            query = '';

            for(var i=0 ; i<userCnt ; i++){
                var uId = userIds[i].u_id;
                var u_fee = 0;
                var u_book = 0;
                var u_hardware = 0;

                if(rows[i].length > 0 )
                    u_fee = 1;
                if(rows[i+1].length > 0 )
                    u_book = 1;
                if(rows[i+2].length > 0 )
                    u_hardware = 1;

                userIds[i].u_fee = u_fee;
                userIds[i].u_book = u_book;
                userIds[i].u_hardware = u_hardware;

                query += 'update t_user set u_fee = '+u_fee+', u_book = '+u_book+', u_hardware = '+u_hardware+' where u_id = "'+uId + '";';

            }

            connection.query(query,function(err,rows) {
                if (err) {
                    console.error(err);
                    DB_handler.disconnectDB(connection);
                    return res.json({status: '101'});
                }

                var send = JSON.stringify(userIds);
                res.json(JSON.parse(send));
            });

        });

    });
});

router.post('/memberinfo', util.ensureAuthenticated, function(req, res, next) {
    var id = req.body.u_id;
    var query = 'select * from t_user where u_id = "'+id+'"';

    con.query(query,function(err,rows){
        if (err) {
            console.error(err);
            throw err;
        }
        var send = JSON.stringify(rows);
        res.json(JSON.parse(send));
    });
});

router.post('/getUserInfo', util.ensureAuthenticated, function(req, res, next) {
    var uid = req.body.uid;
    var query = 'select u_id,u_name,u_sex,u_period,u_device,u_birth,u_photo_url from t_user where u_id="' + uid + '"';
    con.query(query, function(err, response){
        var send = JSON.stringify(response);
        res.json({status:'0', result:JSON.parse(send)});
    });
});

router.post('/updateUserGrade', util.ensureAuthenticated, function(req, res, next) {

    var grade = req.body.origin_grade;
    var state = req.body.grade;
    var u_id = req.body.u_id;

    var query = 'update t_user set u_state = '+state;
    if(grade == '104'){
        query += ', u_register_date = NOW()';
    }
    query += ' where u_id = "'+u_id + '"';

    con.query(query,function(err,rows){
        if (err) {
            console.error(err);
            throw err;
        }

        res.json({status:'0'});
    });

});

router.post('/reset', util.ensureAuthenticated, function(req, res, next) {
    var id = req.body.u_id;
    var encPW = crypto.createHash('sha256').update('0000').digest('base64');
    var query = 'update t_user set u_password = "'+encPW+'" where u_id = "'+id + '"';
    con.query(query,function(err,rows){
        if (err) {
            console.error(err);
            throw err;
        }
        res.json({status:'0'});
    });
});

router.post('/info/deleteDevice', util.ensureAuthenticated, function(req, res, next) {
    var uId = util.getUserId(req);
    var query = 'update t_user set u_device = "",u_token = "" where u_id = "'+uId + '"';
    con.query(query,function(err,rows){
        if (err) {
            console.error(err);
            throw err;
        }
        res.json({status:'0'});
    });
});

router.get('/manage', util.ensureAuthenticated, function(req, res, next) {
    res.render('user_manage', {title: '회원 관리', grade: util.getUserGrade(req)});
});

router.get('/members', util.ensureAuthenticated, function(req, res, next) {
    res.render('member_info', {title: '회원 목록', grade: util.getUserGrade(req)});
});

router.get('/finished', util.ensureAuthenticated, function(req, res, next) {
    res.render('user_finish', {title: '수료예정회원관리', grade: util.getUserGrade(req)});
});

router.get('/lifeEvaluation', util.ensureAuthenticated, function(req, res, next){
    res.render('user_lifeEvaluation', {title: '생활등급', grade: util.getUserGrade(req)});
});

router.post('/load_curlifeEval', util.ensureAuthenticated, function(req, res){
    var query = 'select * from t_life where l_recent=1;';
    query += 'select u_state from t_user where u_id="' + req.session.passport.user.id + '";';
    query += 'select * from t_life_cut';
    con.query(query, function(err, response){
        if(err){
            res.send('failed');
            throw err
        }
        res.send(response);
    });
});

router.post('/load_pastlifeEval', util.ensureAuthenticated, function(req, res){
    var query = 'select l_year, l_month, l_total, l_grade from t_life order by l_id desc';
    con.query(query, function(err, response){
        if(err){
            res.send('failed');
            throw err
        }
        res.send(response);
    })
});

router.post('/enroll_lifeEval', util.ensureAuthenticated, function(req, res){
    var datalist = req.body;
    var today = new Date();

    var query = 'update t_life set l_recent=0;';
    query += 'insert into t_life set l_year="' + today.getFullYear() + '", l_month="' + (today.getMonth()+1) + '", l_first="' + datalist[0].content + '", l_first_cnt="' + datalist[0].cnt + '", l_first_point="' + datalist[0].point + '", ';
    query += 'l_second="' + datalist[1].content + '", l_second_cnt="' + datalist[1].cnt + '", l_second_point="' + datalist[1].point + '", ';
    query += 'l_third="' + datalist[2].content + '", l_third_cnt="' + datalist[2].cnt + '", l_third_point="' + datalist[2].point + '", ';
    query += 'l_fourth="' + datalist[3].content + '", l_fourth_cnt="' + datalist[3].cnt + '", l_fourth_point="' + datalist[3].point + '", ';
    query += 'l_fifth="' + datalist[4].content + '", l_fifth_cnt="' + datalist[4].cnt + '", l_fifth_point="' + datalist[4].point + '", '
    query += 'l_total=' + datalist[1].total + ', l_grade="' + datalist[1].grade + '";';

    con.query(query, function(err, response){
        if(err){
            res.send('failed');
            throw err
        }
        res.send('success');
    });
});

router.post('/alter_gradeCut', util.ensureAuthenticated, function(req, res){
    var query = 'update t_life_cut set lc_a=' + parseInt(req.body.cut_A) + ', lc_b=' + parseInt(req.body.cut_B) + 'where lc_id=1';
    con.query(query, function(err, response){
        if(err){
            res.send('failed');
            throw err
        }
        res.send('success');
    })
});

/**
 * getAlarmInfo
 * 알람 가져오기 메소드
 * @param type (1:푸시, 2:메일)
 * @return u_push_flag or u_mail_flag
 */

router.post('/getAlarmInfo', util.ensureAuthenticated, function(req, res){

    var alarmType = req.body.type;
    if(alarmType == null){
        return res.json({status:'101'});
    }

    var query = 'select ';
    if(alarmType == 1){
        query += 'u_push_flag';
    }else if(alarmType == 2){
        query += 'u_mail_flag';
    }

    query += ' from t_user where t_user = "'+util.getUserId(req)+'"';

    var connection = DB_handler.connectDB();

    connection.query(query, function(err, row){

        if (err) {
            console.error(err);
            DB_handler.disconnectDB(connection);
            return res.json({status:'101'});
        }

        var rows = JSON.stringify(row);
        return res.json(JSON.parse(rows));
    });
});

/**
 * setAlarmInfo
 * 알람 저장하기 메소드
 * @param type (1:푸시, 2:메일)
 * @param flag (true:on, false:off)
 * @return result
 */

router.post('/setAlarmInfo', util.ensureAuthenticated, function(req, res){

    var alarmType = req.body.type;
    var alarmFlag = req.body.flag;

    if(alarmType == null || alarmFlag == null){
        return res.json({status:'101'});
    }

    var query = 'update t_user set ';

    if(alarmType == 1){
        query += 'u_push_flag = '+alarmFlag;
    }else if(alarmType == 2){
        query += 'u_mail_flag = '+alarmFlag;
    }
    query += ' where u_id = "'+util.getUserId(req)+'"';

    var connection = DB_handler.connectDB();

    connection.query(query, function(err, row){

        if (err) {
            console.error(err);
            DB_handler.disconnectDB(connection);
            return res.json({status:'101'});
        }

        return res.json({status:'0'});
    });
});

router.get('/mileage', util.ensureAuthenticated, function(req, res, next){
    res.render('user_mileage', {title: '마일리지 관리', grade: util.getUserGrade(req)});
});

router.post('/getUserlist', util.ensureAuthenticated, function(req, res, next){
    var sort_flag = req.body.sort_flag;
    var query = 'select u_id, u_name, u_period, u_mileage from t_user order by ';
    if(sort_flag === 'period'){
        query += 'u_period asc';
    }else{
        query += 'u_mileage desc';
    }
    con.query(query, function(err, response){
        if(err){
            console.log('Load DB ERROR in "user.js -> /getUserlist"');
        }
        res.send(response);
    });
});

router.post('/mileage_enroll', util.ensureAuthenticated, function(req, res, next){
    var classify = req.body.classify;
    var userIdlist = req.body.userIdlist;
    var point = req.body.point;
    var reason = req.body.reason;

    var query_temp = 'update t_user set u_mileage=u_mileage';
    if(classify === 'PLUS'){
        query_temp += ('+' + req.body.point);
    }else{
        query_temp += ('-' + req.body.point);
    }

    var temp = new Date();
    var date = temp.getFullYear() + '/' + (temp.getMonth()+1) + '/' + temp.getDay();
    var user = userIdlist.split(',');

    var query1 = '';
    var query2 = '';
    for(var i = 0; i < user.length; i++){
        query1 += query_temp + ' where u_id="' + user[i] + '";';
        query2 += 'insert into t_mileage set m_point=' + point + ', m_date="' + date + '", m_giver="' + req.session.passport.user.id + '", m_reason="' + reason + '", m_receiver="' + user[i] + '", m_type="' + classify + '";';
    }


    con.query(query1, function(err, response){
        if(err){
            console.log('DB update ERROR in "user.js -> /mileage_enroll');
            res.send('failed');
        }else{
            con.query(query2, function(err2, response2){
                if(err2){
                    console.log('DB insert ERROR in "user.js -> /mileage_enroll');
                    res.send('failed');
                }else{
                    res.send('success');
                }
            });
        }
    });
});

router.post('/mileage_history', util.ensureAuthenticated, function(req, res, next){
    var query = 'select b.u_name,a.* from t_mileage a inner join t_user b on a.m_giver=b.u_id order by a.m_id desc;';
    query += 'select b.u_name from t_mileage a inner join t_user b on a.m_receiver=b.u_id order by a.m_id desc';
    con.query(query, function(err, response){
        if(err){
            console.log('DB select ERROR in "user.js -> /mileage_history"');
            res.send('failed');
        }else{
            res.send(response);
        }
    });
});

router.post('/mileage_delete', util.ensureAuthenticated, function(req, res, next){
    var deletelist = req.body;
    var pointQuery = '';
    var deleteQuery = '';

    for(var i = 0; i < deletelist.length; i++){
        if(deletelist[i].type === 'PLUS')   pointQuery += 'update t_user set u_mileage=u_mileage-'+deletelist[i].point + ' where u_id="' + deletelist[i].receiver + '";';
        else    pointQuery += 'update t_user set u_mileage=u_mileage+' + deletelist[i].point + ' where u_id="' + deletelist[i].receiver + '";';
        deleteQuery += 'delete from t_mileage where m_id=' + deletelist[i].deleteId +';';
    }
    con.query(pointQuery, function(err1, response1){
        if(err1){
            console.log('DB update ERROR in "user.js -> /mileage_delete"');
            res.send('failed');
        }else{
            con.query(deleteQuery, function(err2, response2){
                if(err2){
                    console.log('DB delete ERROR in "user.js -> /mileage_delete"');
                    res.send('failed');
                }else{
                    res.send('success');
                }
            })
        }
    });
});

router.get('/push', util.ensureAuthenticated, function(req, res, next){
    res.render('user_push', {title: 'Push 전송', grade: util.getUserGrade(req)});
});

router.post('/push', util.ensureAuthenticated, function(req, res, next){
    var pushList = req.body.list;
    var message = req.body.message;
    var pusher = util.getUserName(req);
    if(pushList.length == 1){
        util.send(pushList[0],pusher+'님 알림',message,function(err,data){
            if (err) {
                console.log(err);
                res.json({status:'101'});
            } else {
                res.json({status:'0'});
            }
        });
    }
    else{
        util.sendList(pushList,pusher+'님 알림',message,function(err,data){
            if (err) {
                console.log(err);
                res.json({status:'101'});
            } else {
                res.json({status:'0'});
            }
        });
    }
});

module.exports = router;