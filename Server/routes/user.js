/**
 * Created by KIMDONGWON on 2015-12-14.
 */
var express = require('express');
var DB_handler = require('./DB_handler');
var con = DB_handler.connectDB();
var router = express.Router();
var util = require('./util');

router.get('/info', util.ensureAuthenticated, function(req, res, next) {
    var query = 'select u_id,u_name,u_sex,u_period,u_device,u_birth,u_photo_url from t_user where u_id="' + req.session.passport.user.id + '"';
    con.query(query, function(err, response){
        console.log(response);
        var send = JSON.stringify(response);
        console.log(JSON.parse(send));
        res.render('user_info', {title: '사용자 정보',result:JSON.parse(send)});
    });
});

module.exports = router;