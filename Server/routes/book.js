/**
 * Created by jung-inchul on 2015. 11. 30..
 */
var express = require('express');
var DB_handler = require('./DB_handler');

var con = DB_handler.connectDB();
var router = express.Router();
var book_borrow_handler = require('./book_handler');
var book_my_handler = require('./book_mybook_handler');

router.get('/tech', function(req, res, next) {
    res.render('book_tech', { title: '기술도서 대여' });
});

router.get('/humanities', function(req, res, next) {
    res.render('book_humanities', { title: '인문도서 대여' });
});

router.get('/mybook', function(req, res, next){
    res.render('book_mybook', { title : '내 도서 현황' });
});

router.post('/loadNewHumanitiesbook', function(req, res){
   book_borrow_handler.loadNewHumanitiesbook(con, res);
});

router.post('/loadNewTechbook', function(req, res){
    book_borrow_handler.loadNewTechbook(con, res);
});

router.post('/searchBook', function(req, res){
    book_borrow_handler.searchBook(con, req, res);  // { 카테고리 : 무엇인지, 찾으려는 단어 : 입력값 } 형태
});

router.post('/borrowBook', function(req, res){
    book_borrow_handler.borrowBook(con, req, res);
});

router.post('/reserveBook', function(req, res){
    book_borrow_handler.reserveBook(con, req, res);
});

router.post('/missingBook', function(req, res){
    book_borrow_handler.missingBook(con, req, res);
});

router.post('/mybook/borrowed', function(req, res){
    book_my_handler.loadBorrowedBook(con, req, res);
});

router.post('/mybook/reserved', function(req, res){
    book_my_handler.loadReservedBook(con, req, res);
});

router.post('/mybook/applied', function(req, res){
    book_my_handler.loadAppliedBook(con, req, res);
});

router.post('/mybook/turnIn', function(req, res){
    console.log(req);
    book_my_handler.turninBook(con, req, res);
});

router.post('/mybook/cancelReservation', function(req, res){
    book_my_handler.cancelReservation(con, req, res);
});

router.post('/mybook/postpone', function(req, res){
    book_my_handler.postponeBook(con, req, res);
});

router.post('/mybook/missing', function(req, res){
    book_my_handler.missingBook(con, req, res);
});

router.post('/mybook/cancelAppliedbook', function(req, res){
    book_my_handler.cancelAppliedbook(con, req, res);
});

module.exports = router;