/**
 * Created by KIMDONGWON on 2016-01-08.
 */
var express = require('express');
var schedule_handler = require('./schedule_handler');

var router = express.Router();
var util = require('./util');

router.get('/', util.ensureAuthenticated, function(req, res, next) {
    res.render('schedule', {title: '스케줄', grade: util.getUserGrade(req)});
});

router.get('/sManage', util.ensureAuthenticated, function(req, res, next) {
    res.render('schedule_manage', {title: '스케줄 관리', grade: util.getUserGrade(req)});
});

router.post('/manage/loadSchedule', util.ensureAuthenticated, function(req, res){
    schedule_handler.loadSchedule( req, res);
});

router.post('/manage/enrollSchedule', util.ensureAuthenticated, function(req, res){
    schedule_handler.enrollSchedule( req, res);
});

router.post('/manage/deleteSchedule', util.ensureAuthenticated, function(req, res) {
    schedule_handler.deleteSchedule( req, res);
});

router.post('/getEvents', util.ensureAuthenticated, function(req, res){
    console.log("getevnets");
    schedule_handler.getEvents(req,res);
});

module.exports = router;