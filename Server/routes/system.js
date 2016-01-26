/**
 * Created by KIMDONGWON on 2016-01-02.
 */
var express = require('express');
var DB_handler = require('./DB_handler');
var router = express.Router();
var util = require('./util');
var COMMAND_DEGREE = 9;

router.get('/appinfo', util.ensureAuthenticated, function(req, res, next) {
    res.render('sys_appinfo', { title: '시스템 정보', grade: util.getUserGrade(req)});
});

router.post('/appinfo', util.ensureAuthenticated, function(req, res, next) {
    var query = 'select u_state,u_name from t_user where u_state <= '+COMMAND_DEGREE+' order by u_state';
    var con = DB_handler.connectDB();
    con.query(query, function(err, data){
        if(err){
            console.log(err);
            DB_handler.disconnectDB(con);
            throw err;
        }
        else{
            var send = JSON.stringify(data);
            DB_handler.disconnectDB(con);
            return res.json(JSON.parse(send));
        }
    });
});

router.get('/manual', util.ensureAuthenticated, function(req, res, next) {
    res.render('sys_manual', { title: '메뉴얼', grade: util.getUserGrade(req)});
});

module.exports = router;