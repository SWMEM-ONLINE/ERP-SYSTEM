/**
 * Created by HyunJae on 2015. 12. 20..
 */

var express = require('express');
var DB_handler = require('./DB_handler');
var util = require('./util');

var con = DB_handler.connectDB();
var router = express.Router();
var duty_handler = require('./duty_handler');

/*
 *  Part. Borrow hardware
 */
router.get('/inquiry', util.ensureAuthenticated, function(req, res, next) {
    res.render('duty_inquiry', { title: '당직 조회' });

});

router.get('/change', util.ensureAuthenticated, function(req, res, next) {
    res.render('duty_change', { title: '당직 교환' });
});

router.get('/point', util.ensureAuthenticated, function(req, res, next) {
    res.render('point_inquiry', { title: '상벌당직 조회' });
});

router.get('/checklist', util.ensureAuthenticated, function(req, res, next) {
    res.render('duty_checklist', { title: 'CheckList' });
});

router.get('/add', util.ensureAuthenticated, function(req, res, next) {
    res.render('point_add', { title: '상벌당직추가' });
});

router.get('/modify', util.ensureAuthenticated, function(req, res, next) {
    res.render('point_modify', { title: '상벌당직수정' });
});

router.get('/setting', util.ensureAuthenticated, function(req, res, next) {
    res.render('duty_setting', { title: '당직설정' });
});




router.post('/loadMyDuty', util.ensureAuthenticated, function(req, res){
    duty_handler.loadMyDuty(con,req,res);
});


router.post('/getUser', util.ensureAuthenticated, function(req, res){
    duty_handler.getUser(con,req,res);
});


router.post('/loadMyPointHistory', util.ensureAuthenticated, function(req, res){
    duty_handler.loadMyPointHistory(con,req,res);
});

router.post('/addPoint', util.ensureAuthenticated, function(req, res){
    console.log("dd");
    duty_handler.addPoint(con,req,res);
});

router.post('/modifyPoint', util.ensureAuthenticated, function(req, res){
    duty_handler.modifyPoint(con,req,res);
});

router.post('/getAddPoint', util.ensureAuthenticated, function(req, res){
    duty_handler.getAddPoint(con,req,res);
});

router.post('/getMemberList', util.ensureAuthenticated, function(req, res){
    duty_handler.getMemberList(con,req,res);
});


router.post('/removePointHistory', util.ensureAuthenticated, function(req, res){
    duty_handler.removePointHistory(con,req,res);
});

router.post('/modifyPointHistoty', util.ensureAuthenticated, function(req, res){
    duty_handler.modifyPointHistoty(con,req,res);
});



module.exports = router;