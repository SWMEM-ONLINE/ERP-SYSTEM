/**
 * Created by DBK on 2015. 12. 6..
 */

var express = require('express');
var router = express.Router();
var util = require('./util');

router.get('/', util.ensureAuthenticated, function(req, res, next) {

    res.render('fee', { title: '회비' });

});

router.post('/', util.ensureAuthenticated, function(req, res, next) {

    console.log(req);

});

module.exports = router;
