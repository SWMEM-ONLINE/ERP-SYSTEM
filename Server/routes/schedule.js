/**
 * Created by jung-inchul on 2016. 1. 2..
 */
var express = require('express');
var DB_handler = require('./DB_handler');
var util = require('./util');

var con = DB_handler.connectDB();
var router = express.Router();
var schedule_handler = require('./schedule_handler');


router.get('/', util.ensureAuthenticated, function(req, res, next){
    res.render('schedule', {title : 스케줄});
});

