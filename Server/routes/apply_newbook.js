///**
// * Created by jung-inchul on 2015. 11. 26..
// */
//var express = require('express');
//var DB_handler = require('./DB_handler');
//var apply_newbook_handler = require('../public/javascripts/apply_newbook_handler');
//
//var con = DB_handler.connectDB();
//var router = express.Router();
//
//router.get('/', function(req, res, next) {
//    res.render('apply_newbook', { title: '도서 신청' });
//});
//
//router.get('/newbook', function(req, res, next) {
//    res.render('apply_newbook', { title: '도서 신청' });
//});
//
//router.post('/request', function(req, res){
//    apply_newbook_handler.request(con, req.body, res);   // { 책의 내용들 } 형태
//});
//
//router.post('/loadMyapply', function(req, res){
//    apply_newbook_handler.loadMyapply(con, req.body.userId, res);   // id 만 딱 전송
//});
//
//router.post('/deleteMyapply', function(req, res){
//    apply_newbook_handler.deleteMyapply(con, req.body, res);   // { b_isbn : 숫자 } 형태
//});
//
//module.exports = router;