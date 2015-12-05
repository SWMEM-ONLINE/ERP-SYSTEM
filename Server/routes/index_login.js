/**
 * Created by KIMDONGWON on 2015-11-15.
 */
var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var db_handler = require('./DB_handler');

/* GET home page. */
router.get('/', function(req, res, next) {
    console.log("login index_login get");
    res.render('index_login', { title: '로그인' });
});

/*
router.post('/', function(req, res, next) {
    console.log("login index_login");
    var id = req.body.id;
    var encPW = crypto.createHash('sha256').update(req.body.password).digest('base64');

    console.log(id);
    console.log(encPW);

    var connection = db_handler.connectDB();
    var query = connection.query('select * from t_user where u_id=?', id, function(err,rows){
        if (err) {
            console.error(err);
            throw err;
        }
        console.log(rows[0]);
        if(0<rows.length){
            //비번 체크
            console.log('pw check');
            if(encPW == rows[0].u_password){
                //성공
                console.log('goto main');

                res.redirect('/main');
            }else{
                //로그인 실패
            }

        }else{
            //아이디 없음

        }



        db_handler.disconnectDB(connection);

        //res.render('index_login', { title: '로그인' });
    });

});
*/
module.exports = router;
