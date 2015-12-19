/**
 * Created by HyunJae on 2015. 12. 20..
 */

var express = require('express');
var DB_handler = require('./DB_handler');
var util = require('./util');

var con = DB_handler.connectDB();
var router = express.Router();
var duty_handler = require('./duty_handler');

/*
 *  Part. Borrow hardware
 */
router.get('/list', util.ensureAuthenticated, function(req, res, next) {
    res.render('hardware_list', { title: '하드웨어 대여' });
});

router.post('/normal', util.ensureAuthenticated, function(req, res){
    duty_handler.loadNormalHardware(con, req, res);
});

router.post('/special',util.ensureAuthenticated,  function(req, res){
    duty_handler.loadSpecialHardware(con, req, res);
});

router.post('/borrow',util.ensureAuthenticated, function(req, res){
    duty_handler.borrowHardware(con, req, res);
});

router.post('/lender', util.ensureAuthenticated, function(req, res){
    duty_handler.loadLender(con, req, res);
});

/*
 *  Part. My hardware
 */
router.get('/myhardware',util.ensureAuthenticated, function(req, res, next) {
    res.render('hardware_myhardware', { title: '나의 하드웨어' });
});

router.post('/myhardware/normal',util.ensureAuthenticated, function(req, res){
    duty_handler.loadMynormalHardware(con, req, res);
});

router.post('/myhardware/special',util.ensureAuthenticated, function(req, res){
    duty_handler.loadMyspecialHardware(con, req, res);
});

router.post('/myhardware/turnIn',util.ensureAuthenticated, function(req, res){
    duty_handler.turnInHardware(con, req, res);
});

router.post('/myhardware/postpone',util.ensureAuthenticated, function(req, res){
    duty_handler.postponeHardware(con, req, res);
});
module.exports = router;