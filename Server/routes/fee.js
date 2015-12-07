/**
 * Created by DBK on 2015. 12. 6..
 */

var express = require('express');
var router = express.Router();
var util = require('./util');

router.get('/unpaid', util.ensureAuthenticated, function(req, res, next) {
    res.render('fee_unpaid', { title: '회비미납내역' });
});

router.get('/history', util.ensureAuthenticated, function(req, res, next) {
    res.render('fee_history', { title: '회비내역' });
});

router.post('/', util.ensureAuthenticated, function(req, res, next) {

    console.log(req);

});

module.exports = router;
