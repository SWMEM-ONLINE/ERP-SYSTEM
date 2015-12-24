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

router.post('/info', util.ensureAuthenticated, function(req, res, next) {

    var uId = util.getUserId(req);
    var encPW = crypto.createHash('sha256').update(req.body.password).digest('base64');
    var uPhone = req.body.phone;
    var eMail = req.body.mail;

    var connection = db_handler.connectDB();

    var query = 'update t_user set';
    if(0<encPW.length){
        query += ' u_password = '+encPW;
    }
    query += ' u_phone = '+uPhone+' u_email = '+eMail+' where u_id = '+uID;

    connection.query(query,function(err,result){
        if (err) {
            console.error(err);
            throw err;
        }
        db_handler.disconnectDB(connection);

        res.redirect('/');
    });

});

module.exports = router;