/**
 * Created by KIMDONGWON on 2016-01-08.
 */
var express = require('express');
var DB_handler = require('./DB_handler');
//var con = DB_handler.connectDB();
var router = express.Router();
var util = require('./util');

router.get('/', util.ensureAuthenticated, function(req, res, next) {
    res.render('vote', {title: '설문조사'});
});

router.get('/manage', util.ensureAuthenticated, function(req, res, next) {
    res.render('vote_manage', {title: '설문조사 관리'});
});

module.exports = router;