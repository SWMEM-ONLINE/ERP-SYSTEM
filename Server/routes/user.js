/**
 * Created by KIMDONGWON on 2015-12-14.
 */
var express = require('express');
var DB_handler = require('./DB_handler');
var con = DB_handler.connectDB();
var router = express.Router();
var util = require('./util');

router.get('/info', util.ensureAuthenticated, function(req, res, next) {
    res.render('user_info', { title: '사용자 정보' });
});

module.exports = router;