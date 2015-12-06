/**
 * Created by KIMDONGWON on 2015-11-15.
 */
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    console.log("login index_login get");
    res.render('index_login', { title: '로그인' });
});

module.exports = router;
