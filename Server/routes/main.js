/**
 * Created by KIMDONGWON on 2015-11-29.
 */
var express = require('express');
var router = express.Router();
var util = require('./util');
var main_handler = require('./main_handler');


/* GET users listing. */
router.get('/', util.ensureAuthenticated, function(req, res, next) {
    res.render('main', { title: '메인', grade: util.getUserGrade(req) });
});

router.post('/', util.ensureAuthenticated, function(req, res, next) {
    console.log(req);
});

router.post('/loadmyBook', util.ensureAuthenticated, function(req, res, next){
    main_handler.loadBookMain(req, res);
});

router.post('/loadmyHardware', util.ensureAuthenticated, function(req, res, next){
    main_handler.loadHardwareMain(req, res);
});

router.post('/loadmyMileage', util.ensureAuthenticated, function(req, res, next){
    main_handler.loadmyMileage(req, res);
});

router.post('/getUserpermission', util.ensureAuthenticated, function(req, res, next){
    main_handler.getUserpermission(req, res);
});

router.post('/hasToken', util.ensureAuthenticated, function(req, res, next){
    main_handler.hasToken(req, res);
});

router.post('/getToken', util.ensureAuthenticated, function(req, res, next){
    main_handler.getToken(req, res);
});

module.exports = router;
