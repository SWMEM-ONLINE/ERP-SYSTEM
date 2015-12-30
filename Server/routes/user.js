/**
 * Created by KIMDONGWON on 2015-12-14.
 */
var express = require('express');
var DB_handler = require('./DB_handler');
var con = DB_handler.connectDB();
var router = express.Router();
var util = require('./util');
var crypto = require('crypto');

router.get('/info', util.ensureAuthenticated, function(req, res, next) {
    var query = 'select u_id,u_name,u_sex,u_period,u_device,u_birth,u_photo_url from t_user where u_id="' + req.session.passport.user.id + '"';
    con.query(query, function(err, response){
        console.log(response);
        var send = JSON.stringify(response);
        console.log(JSON.parse(send));
        res.render('user_info', {title: '사용자 정보',result:JSON.parse(send)});
    });
});

router.post('/info', util.ensureAuthenticated, function(req, res, next) {

    var uId = util.getUserId(req);
    var encPW = crypto.createHash('sha256').update(req.body.password).digest('base64');
    var uPhone = req.body.phone;
    var eMail = req.body.mail;

    var query = 'update t_user set';
    if(0<encPW.length){
        query += ' u_password = '+encPW;
    }
    query += ' u_phone = '+uPhone+' u_email = '+eMail+' where u_id = '+uID;

    con.query(query,function(err,result){
        if (err) {
            console.error(err);
            throw err;
        }
        res.json({status:'0'});
    });

});

router.post('/userlist', util.ensureAuthenticated, function(req, res, next) {

    var query = 'select * from t_user order by u_period';

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


    var query = 'update t_user set u_state = '+state+' where u_id = "'+u_id + '"';

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

router.get('/manage', util.ensureAuthenticated, function(req, res, next) {
    res.render('user_manage', {title: '회원 관리'});
});

router.post('/resetUserPassword', util.ensureAuthenticated, function(req, res, next) {

    var id = req.body.id;
    var encPW = crypto.createHash('sha256').update('0000').digest('base64');

    var connection = db_handler.connectDB();

    var query = 'update t_user set u_password = "'+encPW+'" where u_id = "'+id+'"';

    connection.query(query,function(err,rows){
        if (err) {
            console.error(err);
            throw err;
        }

        res.json({status:'0'});
    });

});

module.exports = router;