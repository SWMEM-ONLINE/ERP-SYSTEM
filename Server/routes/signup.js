/**
 * Created by KIMDONGWON on 2015-11-15.
 */
var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var db_handler = require('./DB_handler');


/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index_signup', { title: '회원가입' });
});

router.post('/', function(req, res, next) {

    var uId = req.body.id;
    var encPW = crypto.createHash('sha256').update(req.body.password).digest('base64');
    var userName = req.body.username;
    var uSex = 1;
    if(req.body.sex_info == 'female')
        uSex = 2;
    var uBirth = req.body.birth;
    var uPhone = req.body.phone;
    var eMail = req.body.mail;
    var uState = 104;
    var uPeriod = req.body.period;
    var uBranch = 'sw';
    var uDevice = '';
    var uToken = '';
    var uMileage = 0;
    var uGoodPoint = 0;
    var uBadPoint = 0;
    var uManagerBadPoint = 0;
    var uPhotoUrl = req.files.sign_up_img.name;
    var uLastDuty = 0;
    var uFee = false;
    var uHardware = false;
    var uBook = false;
    var uPush = true;
    var uMail = true;

    console.log('u_name:'+userName); // form files
    console.log('uPhotoUrl:'+uPhotoUrl); // form files

    var connection = db_handler.connectDB();

    var user = {    'u_id':uId,
                    'u_password':encPW,
                    'u_name':userName,
                    'u_sex':uSex,
                    'u_birth':uBirth,
                    'u_phone':uPhone,
                    'u_email':eMail,
                    'u_state':uState,
                    'u_period':uPeriod,
                    'u_branch':uBranch,
                    'u_device':uDevice,
                    'u_token':uToken,
                    'u_mileage':uMileage,
                    'u_good_duty_point':uGoodPoint,
                    'u_bad_duty_point':uBadPoint,
                    'u_manager_bad_duty_point':uManagerBadPoint,
                    'u_photo_url':uPhotoUrl,
                    'u_last_duty':uLastDuty,
                    'u_fee':uFee,
                    'u_hardware':uHardware,
                    'u_book':uBook,
                    'u_push_flag':uPush,
                    'u_mail_flag':uMail};

    var query = connection.query('insert into t_user set ?',user,function(err,result){
        if (err) {
            console.error(err);
            throw err;
        }
        console.log(query);
        db_handler.disconnectDB(connection);

        res.redirect('/');
    });

});

router.post('/checkid', function(req, res) {
    var id = req.body.userid;
    var connection = db_handler.connectDB();

    connection.query('select * from t_user where u_id=?',id,function(err,data){
        if(err){
            console.log(err);
        }
        else {
            if (data.length > 0 || id === '') { //impossible
                res.json({status: '0'});
            }
            else{
                res.json({status: '1'}); //possible
            }
        }
        db_handler.disconnectDB(connection);
    });
});


exports.join = function(reqy, res){
};

module.exports = router;

