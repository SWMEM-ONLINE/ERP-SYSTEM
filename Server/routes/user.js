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
    var currentPW = req.body.currentPW;
    var newPW = req.body.newPW;
    var newPhone = req.body.newPhone;
    var newMail = req.body.newMail;

    var encCurrentPW = crypto.createHash('sha256').update(currentPW).digest('base64');
    var encNewPW = crypto.createHash('sha256').update(newPW).digest('base64');

    var query = 'update t_user set';
    var flag = false;
    con.query('select u_password from t_user where u_id="'+uId+'"', function (err,result) {
        if(result[0].u_password == encCurrentPW){
            if(newPW != ''){
                query += ' u_password = "'+encNewPW+'"';
                flag = true;
            }
            if(newMail != ''){
                if(flag){
                    query += ',';
                }
                query += ' u_email="' + newMail + '"';
                flag = true;
            }
            if(newPhone != ''){
                if(flag){
                    query += ',';
                }
                query += ' u_phone="'+newPhone+'"';
                flag = true;
            }

            /*
                img need
            */

            query += ' where u_id = "'+uId+'"';
            console.log(query);
            con.query(query,function(err,result){
                res.json({status:'0'});
            });
        }
        else{
            res.json({status:'101'});
        }
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

module.exports = router;