/**
 * Created by jung-inchul on 2015. 12. 7..
 */
var express = require('express');
var DB_handler = require('./DB_handler');
var util = require('./util');

var con = DB_handler.connectDB();
var router = express.Router();
var hardware_handler = require('./hardware_handler');

/*
 *  Part. Borrow hardware
 */
router.get('/assign', util.ensureAuthenticated, function(req, res, next) {
    res.render('hardware_list', { title: '하드웨어 대여', grade: util.getUserGrade(req) });
});

router.post('/loadHardwarelist', util.ensureAuthenticated, function(req, res){
    hardware_handler.loadHardwarelist(con, req, res);
});

router.post('/borrow',util.ensureAuthenticated, function(req, res){
    hardware_handler.borrowHardware(con, req, res);
});

router.post('/lender', util.ensureAuthenticated, function(req, res){
    hardware_handler.loadLender(con, req, res);
});

/*
 *  Part. My hardware
 */
router.get('/myhardware',util.ensureAuthenticated, function(req, res, next) {
    res.render('hardware_myhardware', { title: '나의 하드웨어', grade: util.getUserGrade(req) });
});

router.post('/myhardware/borrowed',util.ensureAuthenticated, function(req, res){
    hardware_handler.loadmyHardware(con, req, res);
});

router.post('/myhardware/requested',util.ensureAuthenticated, function(req, res){
    hardware_handler.loadmyRequestedHardware(con, req, res);
});

router.post('/myhardware/applied', util.ensureAuthenticated, function(req, res){
    hardware_handler.loadmyappliedHardware(con, req, res);
});

router.post('/myhardware/turnIn',util.ensureAuthenticated, function(req, res){
    hardware_handler.turnInHardware(con, req, res);
});

router.post('/myhardware/postpone',util.ensureAuthenticated, function(req, res){
    hardware_handler.postponeHardware(con, req, res);
});

router.post('/myhardware/deleteRequest', util.ensureAuthenticated, function(req, res){
    hardware_handler.deleteRequest(con, req, res);
});

router.post('/myhardware/cancelmyApply', util.ensureAuthenticated, function(req, res){
    hardware_handler.cancelmyApply(con, req, res);
});

/*
 *   Part. Manage
 */

router.get('/manage/item', util.ensureAuthenticated, function(req, res, next){
    res.render('hardware_manage_item', { title: '하드웨어 관리', grade: util.getUserGrade(req)});
});

router.post('/manage/enroll', util.ensureAuthenticated, function(req, res){
    hardware_handler.enrollHardware(con, req, res);
});

router.post('/manage/alter', util.ensureAuthenticated, function(req, res){
    hardware_handler.alterHardware(con, req, res);
});

router.post('/manage/delete', util.ensureAuthenticated, function(req, res){
    hardware_handler.deleteHardware(con, req, res);
});

router.get('/manage/request', util.ensureAuthenticated, function(req, res){
    res.render('hardware_manage_request', {title: '하드웨어 신청 관리', grade: util.getUserGrade(req)});
});

router.post('/manage/loadRequest', util.ensureAuthenticated, function(req, res){
    hardware_handler.loadRequest(con, req, res);
});

router.post('/manage/loadApply', util.ensureAuthenticated, function(req, res){
    hardware_handler.loadApply(con, req, res);
});

router.post('/manage/approveRequest', util.ensureAuthenticated, function(req, res){
    hardware_handler.approveRequest(con, req, res);
});

router.post('/manage/rejectRequest', util.ensureAuthenticated, function(req, res){
    hardware_handler.rejectRequest(con, req, res);
});

router.get('/manage/history', util.ensureAuthenticated, function(req, res){
    res.render('hardware_manage_history', {title : '하드웨어 대여기록', grade: util.getUserGrade(req)});
});

router.post('/manage/loadNow', util.ensureAuthenticated, function(req, res){
    hardware_handler.loadNow(con, req, res);
});

router.post('/manage/loadPast', util.ensureAuthenticated, function(req, res){
    hardware_handler.loadPast(con, req, res);
});




module.exports = router;