/**
 * Created by KIMDONGWON on 2015-12-07.
 */
var express = require('express');
var DB_handler = require('./DB_handler');
var apply_newbook_handler = require('./apply_newbook_handler');

var con = DB_handler.connectDB();
var router = express.Router();
var util = require('./util');
var gcm = require('./../libs/gcm');

/* @book */
router.get('/newbook', util.ensureAuthenticated, function(req, res, next) {
    res.render('apply_newbook', { title: '도서 신청'});
});

router.post('/newbook/request', util.ensureAuthenticated, function(req, res){
    apply_newbook_handler.request(con, req, res);   // { 책의 내용들 } 형태
});

router.post('/newbook/loadMyapply', util.ensureAuthenticated, function(req, res){
    apply_newbook_handler.loadMyapply(con, req, res);   // id 만 딱 전송
});

router.post('/newbook/deleteMyapply', util.ensureAuthenticated,  function(req, res){
    apply_newbook_handler.deleteMyapply(con, req, res);   // { b_isbn : 숫자 } 형태
});
/* book@ */

/* apply push */
/* @room */
router.get('/room', util.ensureAuthenticated, function(req, res, next) {
    var query = 'SELECT * FROM t_url'; //query change absolutely
    con.query(query, function(err, response){
        var room_send = JSON.stringify(response);
        res.render('apply_room', {title: '프로젝트실 신청', lists: JSON.parse(room_send)});
    });
});
router.post('/room', util.ensureAuthenticated, function(req, res, next) {
    var title ='SWSSM NOTICE';
    var content = '프로젝트실 신청 알림';
    gcm.send(title,content,'AIzaSyAQnrOAvlFfVZpjug3ndXBHg_HTIcSm_AY','eh-qMqapWQY:APA91bGWXSmHuA3RwIC7XPIs2R2MrrvaLX3Er7BGqCSr3sRR_hrlOoIyCJKl1vD1-ZJKUDgvWL82z_OGmH1DlYufh9twsvmYgIS0DJs8pphVruLnURHkQPJ9E5UmFurfr1EaguaFrLAq');
    res.json({status:'success'});
});
/* room@ */

/* @server */
router.get('/server', util.ensureAuthenticated, function(req, res, next) {
    var query = 'SELECT * FROM t_url'; //query change absolutely
    con.query(query, function(err, response){
        var server_send = JSON.stringify(response);
        res.render('apply_server', {title: '서버 신청', lists: JSON.parse(server_send)});
    });
});
router.post('/server', util.ensureAuthenticated, function(req, res, next) {
    var title ='SWSSM NOTICE';
    var content = '서버 신청 알림';
    gcm.send(title,content,'AIzaSyAQnrOAvlFfVZpjug3ndXBHg_HTIcSm_AY','eh-qMqapWQY:APA91bGWXSmHuA3RwIC7XPIs2R2MrrvaLX3Er7BGqCSr3sRR_hrlOoIyCJKl1vD1-ZJKUDgvWL82z_OGmH1DlYufh9twsvmYgIS0DJs8pphVruLnURHkQPJ9E5UmFurfr1EaguaFrLAq');
    res.json({status:'success'});
});
/* server@ */

/* @equipment */
router.get('/equipment', util.ensureAuthenticated, function(req, res, next) {
    var query = 'SELECT * FROM t_url'; //query change absolutely
    con.query(query, function(err, response){
        var equipment_send = JSON.stringify(response);
        res.render('apply_equipment', {title: '비품 신청', lists: JSON.parse(equipment_send)});
    });
});
router.post('/equipment', util.ensureAuthenticated, function(req, res, next) {
    var title ='SWSSM NOTICE';
    var content = '비품 신청 알림';
    gcm.send(title,content,'AIzaSyAQnrOAvlFfVZpjug3ndXBHg_HTIcSm_AY','eh-qMqapWQY:APA91bGWXSmHuA3RwIC7XPIs2R2MrrvaLX3Er7BGqCSr3sRR_hrlOoIyCJKl1vD1-ZJKUDgvWL82z_OGmH1DlYufh9twsvmYgIS0DJs8pphVruLnURHkQPJ9E5UmFurfr1EaguaFrLAq');
    res.json({status:'success'});
});
/* equipment@ */

/* @hardware */
router.get('/hardware', util.ensureAuthenticated, function(req, res, next) {
    res.render('apply_hardware', {title: '하드웨어 신청'});
});
router.post('/hardware', util.ensureAuthenticated, function(req, res, next) {
    var query = 'INSERT into t_hardware SET ?';
    console.log(req.body);
    //con.query(query, data, function(err, response){
    //    res.send('책이 신청되었습니다');
    //});
    res.send({status:'success'});
});
/* hardware@ */
module.exports = router;