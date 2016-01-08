/**
 * Created by KIMDONGWON on 2016-01-08.
 */
var express = require('express');
var DB_handler = require('./DB_handler');
//var con = DB_handler.connectDB();
var router = express.Router();
var util = require('./util');

router.get('/', util.ensureAuthenticated, function(req, res, next) {
    res.render('schedule', {title: '스케쥴'});
});

router.get('/manage', util.ensureAuthenticated, function(req, res, next) {
    res.render('schedule_manage', {title: '스케쥴 관리'});
});

module.exports = router;