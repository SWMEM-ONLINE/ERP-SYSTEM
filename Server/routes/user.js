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
    var query = 'select u_id,u_name,u_sex,u_period,u_device,u_birth,u_email,u_phone,u_photo_url from t_user where u_id="' + req.session.passport.user.id + '"';
    con.query(query, function(err, response){
        console.log(response);
        var send = JSON.stringify(response);
        console.log(JSON.parse(send));
        res.render('user_info', {title: '사용자 정보',result:JSON.parse(send)});
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
            console.log(query);
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
    else if(type == 'finished'){
        query += ' WHERE u_state = 102';
    }
    query += ' order by u_period';


    con.query(query,function(err,rows){
        if (err) {
            console.error(err);
            throw err;
        }
        console.log(rows);
        var send = JSON.stringify(rows);
        res.json(JSON.parse(send));
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
        console.log(rows);
        var send = JSON.stringify(rows);
        res.json(JSON.parse(send));
    });
});

router.post('/getUserInfo', util.ensureAuthenticated, function(req, res, next) {
    var uid = req.body.uid;
    var query = 'select u_id,u_name,u_sex,u_period,u_device,u_birth,u_photo_url from t_user where u_id="' + uid + '"';
    con.query(query, function(err, response){
        console.log(response);
        var send = JSON.stringify(response);
        res.json({status:'0', result:JSON.parse(send)});
    });
});

router.post('/updateUserGrade', util.ensureAuthenticated, function(req, res, next) {

    var state = req.body.grade;
    var u_id = req.body.u_id;

    var u_fee = 0;
    var u_book = 0;
    var u_hardware = 0;

    if(state == '102'){
        /*회비미납 내역 체크*/
        var query = 'select * from t_fee where f_payer = "' + u_id + '" AND f_state = 0';

        con.query(query,function(err,rows1){
            if (err) {
                console.error(err);
                throw err;
            }
            if(0<rows1.length)
                u_fee = 1;

            /*도서미납 내역 체크*/
            query = 'select b_name name, DATEDIFF(CURDATE(), b_due_date) diff from t_book where b_rental_username ="' + u_id + '"';

            con.query(query,function(err,rows2){
                if (err) {
                    console.error(err);
                    throw err;
                }
                console.log(rows2);
                if(0<rows2.length){
                    u_book = 1;
                    console.log("미반납 도서 있음");
                }
                /*하드웨어미납 내역 체크*/
                query = 'select b.h_name name, DATEDIFF(CURDATE(), a.hr_due_date) diff from t_hardware_rental a inner join t_hardware b on a.hr_hardware_id=b.h_id where a.hr_user_id="' + u_id + '"';

                con.query(query,function(err,rows3){
                    if (err) {
                        console.error(err);
                        throw err;
                    }
                    if(0<rows3.length)
                        u_hardware = 1;

                    query = 'update t_user set u_state = '+state+', u_fee = '+u_fee+', u_book = '+u_book+', u_hardware = '+u_hardware+' where u_id = "'+u_id + '"';
                    console.log(query);
                    con.query(query,function(err,rows4){
                        if (err) {
                            console.error(err);
                            throw err;
                        }

                        res.json({status:'0'});
                    });
                });
            });
        });

    }else{
        var query = 'update t_user set u_state = '+state+' where u_id = "'+u_id + '"';

        con.query(query,function(err,rows){
            if (err) {
                console.error(err);
                throw err;
            }

            res.json({status:'0'});
        });
    }

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
    var query = 'update t_user set u_device = "" where u_id = "'+uId + '"';
    con.query(query,function(err,rows){
        if (err) {
            console.error(err);
            throw err;
        }
        res.json({status:'0'});
    });
});

router.get('/manage', util.ensureAuthenticated, function(req, res, next) {
    res.render('user_manage', {title: '회원 관리'});
});

router.get('/members', util.ensureAuthenticated, function(req, res, next) {
    res.render('member_info', {title: '회원 목록'});
});

router.get('/finished', util.ensureAuthenticated, function(req, res, next) {
    res.render('user_finish', {title: '수료예정회원관리'});
});

module.exports = router;