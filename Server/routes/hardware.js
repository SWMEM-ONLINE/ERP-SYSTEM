/**
 * Created by jung-inchul on 2015. 12. 7..
 */
var express = require('express');
var DB_handler = require('./DB_handler');
var util = require('./util');

var con = DB_handler.connectDB();
var router = express.Router();
var hardware_handler = require('./hardware_handler');

/*
 *  Part. Borrow hardware
 */
router.get('/list', util.ensureAuthenticated, function(req, res, next) {
    res.render('hardware_list', { title: '하드웨어 대여' });
});

router.post('/normal', util.ensureAuthenticated, function(req, res){
    hardware_handler.loadNormalHardware(con, req, res);
});

router.post('/special',util.ensureAuthenticated,  function(req, res){
    hardware_handler.loadSpecialHardware(con, req, res);
});

router.post('/borrow',util.ensureAuthenticated, function(req, res){
    hardware_handler.borrowHardware(con, req, res);
});

router.post('/lender', util.ensureAuthenticated, function(req, res){
    hardware_handler.loadLender(con, req, res);
});

/*
 *  Part. My hardware
 */
router.get('/myhardware',util.ensureAuthenticated, function(req, res, next) {
    res.render('hardware_myhardware', { title: '나의 하드웨어' });
});

router.post('/myhardware/normal',util.ensureAuthenticated, function(req, res){
    hardware_handler.loadMynormalHardware(con, req, res);
});

router.post('/myhardware/special',util.ensureAuthenticated, function(req, res){
    hardware_handler.loadMyspecialHardware(con, req, res);
});

router.post('/myhardware/turnIn',util.ensureAuthenticated, function(req, res){
    console.log('/my/turnIn');
});

router.post('/myhardware/postpone',util.ensureAuthenticated, function(req, res){
    console.log('/my/postpone');
});
module.exports = router;