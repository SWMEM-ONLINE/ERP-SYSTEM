/**
 * Created by KIMDONGWON on 2016-01-08.
 */
var express = require('express');
var DB_handler = require('./DB_handler');
//var con = DB_handler.connectDB();
var router = express.Router();
var util = require('./util');

router.get('/', util.ensureAuthenticated, function(req, res, next) {
    res.render('schedule', {title: '스케줄', grade: util.getUserGrade(req)});
});

router.get('/sManage', util.ensureAuthenticated, function(req, res, next) {
    res.render('schedule_manage', {title: '스케줄 관리', grade: util.getUserGrade(req)});
});

module.exports = router;