/**
 * Created by KIMDONGWON on 2015-11-15.
 */
var express = require('express');
var router = express.Router();
var crypto = require('crypto');


/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index_signup', { title: '회원가입' });
});

router.post('/', function(req, res, next) {

    console.log(req.body) // form fields
    console.log(req.files) // form files

    var encPW = crypto.createHash('sha256').update(req.body.password).digest('base64');
    console.log('encPW: ' , encPW);

    res.json(req.body);
    //res.send(req.body);

   // repo.hasUserID(req.body, res);
});

exports.join = function(reqy, res){
};

module.exports = router;

