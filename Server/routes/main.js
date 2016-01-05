/**
 * Created by KIMDONGWON on 2015-11-29.
 */
var express = require('express');
var router = express.Router();
var util = require('./util');
var main_handler = require('./main_handler');
var DB_handler = require('./DB_handler');
var con = DB_handler.connectDB();


/* GET users listing. */
router.get('/', util.ensureAuthenticated, function(req, res, next) {
    res.render('main', { title: '메인', grade: util.getUserGrade(req) });
    //main_handler.loadBookMain(con, req, res);
    //main_handler.loadHardwareMain(con, req, res);
});

router.post('/', util.ensureAuthenticated, function(req, res, next) {
    console.log(req);
});

router.post('/loadmyBook', util.ensureAuthenticated, function(req, res, next){
    main_handler.loadBookMain(con, req, res);
});

router.post('/loadmyHardware', util.ensureAuthenticated, function(req, res, next){
    main_handler.loadHardwareMain(con, req, res);
});

router.post('/getUserpermission', util.ensureAuthenticated, function(req, res, next){
    main_handler.getUserpermission(con, req, res);
});

router.post('/hasToken', util.ensureAuthenticated, function(req, res, next){
    main_handler.hasToken(con, req, res);
});

router.post('/getToken', util.ensureAuthenticated, function(req, res, next){
    main_handler.getToken(con, req, res);
});

module.exports = router;
