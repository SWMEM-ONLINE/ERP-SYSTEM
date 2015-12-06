/**
 * Created by KIMDONGWON on 2015-11-29.
 */
var express = require('express');
var router = express.Router();
var util = require('./util');
/*
/* GET users listing. */
router.get('/', util.ensureAuthenticated, function(req, res, next) {

    res.render('main', { title: '메인' });

});

router.post('/', util.ensureAuthenticated, function(req, res, next) {

    console.log(req);

});

module.exports = router;
