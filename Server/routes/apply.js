/**
 * Created by KIMDONGWON on 2015-12-07.
 */
var express = require('express');
var DB_handler = require('./DB_handler');
var apply_newbook_handler = require('./apply_newbook_handler');

var con = DB_handler.connectDB();
var router = express.Router();

/* @book */
router.get('/newbook', function(req, res, next) {
    res.render('apply_newbook', { title: '도서 신청' });
});

router.post('/newbook/request', function(req, res){
    apply_newbook_handler.request(con, req, res);   // { 책의 내용들 } 형태
});

router.post('/newbook/loadMyapply', function(req, res){
    apply_newbook_handler.loadMyapply(con, req, res);   // id 만 딱 전송
});

router.post('/newbook/deleteMyapply', function(req, res){
    apply_newbook_handler.deleteMyapply(con, req, res);   // { b_isbn : 숫자 } 형태
});

router.post('/newbook/checkDuplication', function(req, res){
    apply_newbook_handler.checkDuplication(con, req, res);
});
/* book@ */
module.exports = router;