/**
 * Created by KIMDONGWON on 2015-11-15.
 */
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index_login', { title: '로그인' });
});

router.post('/', function(req, res, next) {
    res.json(req.body);
});

module.exports = router;
