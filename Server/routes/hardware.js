/**
 * Created by jung-inchul on 2015. 12. 7..
 */
var express = require('express');
var DB_handler = require('./DB_handler');

var con = DB_handler.connectDB();
var router = express.Router();
var hardware_handler = require('./hardware_handler');

/*
 *  Part. Borrow hardware
 */
router.get('/list', function(req, res, next) {
    res.render('hardware_list', { title: '하드웨어 대여' });
});

router.post('/normal', function(req, res){
    hardware_handler.loadNormalHardware(con, req, res);
});

router.post('/special', function(req, res){
    hardware_handler.loadSpecialHardware(con, req, res);
});

router.post('/borrow', function(req, res){
    console.log('/borrow');
    //hardware_handler.borrowHardware(con, req.body, res);
});

/*
 *  Part. My hardware
 */
router.get('/my', function(req, res, next) {
    res.render('hardware_my', { title: '나의 하드웨어' });
});

router.post('/my/normal', function(req, res){
    hardware_handler.loadMynormalHardware(con, req, res);
});

router.post('/my/special', function(req, res){
    hardware_handler.loadMyspecialHardware(con, req, res);
});

router.post('/my/turnIn', function(req, res){
    console.log('/my/turnIn');
});

router.post('/my/postpone', function(req, res){
    console.log('/my/postpone');
});
module.exports = router;