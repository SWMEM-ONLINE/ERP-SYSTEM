/**
 * Created by KIMDONGWON on 2015-11-29.
 */
var express = require('express');
var router = express.Router();
/*
/* GET users listing. */
router.get('/', ensureAuthenticated, function(req, res, next) {

    res.render('main', { title: '메인' });

});

function ensureAuthenticated(req, res, next) {
    console.log("ensureAuthenticated");
    // 로그인이 되어 있으면, 다음 파이프라인으로 진행
    if (req.isAuthenticated()) {
        return next();
    }
    // 로그인이 안되어 있으면, login 페이지로 진행
    res.redirect('/');
}

module.exports = router;
