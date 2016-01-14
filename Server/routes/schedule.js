/**
 * Created by KIMDONGWON on 2016-01-08.
 */
var express = require('express');
var DB_handler = require('./DB_handler');
var schedule_handler = require('./schedule_handler');
var con = DB_handler.connectDB();
var router = express.Router();
var util = require('./util');

router.get('/', util.ensureAuthenticated, function(req, res, next) {
    res.render('schedule', {title: '스케줄', grade: util.getUserGrade(req)});
});

router.get('/manage', util.ensureAuthenticated, function(req, res, next) {
    res.render('schedule_manage', {title: '스케줄 관리', grade: util.getUserGrade(req)});
});

router.post('/manage/loadSchedule', util.ensureAuthenticated, function(req, res){
    schedule_handler.loadSchedule(con, req, res);
});

router.post('/manage/enrollSchedule', util.ensureAuthenticated, function(req, res){
    schedule_handler.enrollSchedule(con, req, res);
});

router.post('/manage/deleteSchedule', util.ensureAuthenticated, function(req, res) {
    schedule_handler.deleteSchedule(con, req, res);
});

router.post('/getEvents', util.ensureAuthenticated, function(req, res){
    console.log("getevnets");
    schedule_handler.getEvents(con,req,res);
});

module.exports = router;