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

    /*
    console.log(req.body) // form fields
    console.log(req.files) // form files
*/
    var uId = req.body.id;
    var encPW = crypto.createHash('sha256').update(req.body.password).digest('base64');
    var userName = req.body.username;
    var uSex = 1;
    if(req.body.sex_info == 'female')
        uSex = 2;
    var uBirth = req.body.birth;
    var uPhone = req.body.phone;
    var eMail = req.body.mail;
    var uState = 4;
    var uPeriod = req.body.period;
    var uBranch = 'sw';
    var uDevice = 0;
    var uToken = '';
    var uMileage = 0;
    var uGoodPoint = 0;
    var uBadPoint = 0;
    var uManagerBadPoint = 0;
    var uPhotoUrl = req.files.sign_up_img.name;
    var uRegisterDate = 0;


    console.log('u_name:'+userName) // form files
    console.log('uPhotoUrl:'+uPhotoUrl) // form files

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
                    'u_register_date':uRegisterDate};

    var query = connection.query('insert into t_user set ?',user,function(err,result){
        if (err) {
            console.error(err);
            throw err;
        }
        console.log(query);
        db_handler.disconnectDB(connection);

        res.render('index_login', { title: '로그인' });
    });

    //res.json(req.body);
    //res.send(req.body);

   // repo.hasUserID(req.body, res);
});

exports.join = function(reqy, res){
};

module.exports = router;

