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
    //book_handler.loadNewest(con, res);
});

router.get('/humanities', function(req, res, next) {
    res.render('book_humanities', { title: '인문도서 대여' });
    //book_handler.loadNewest(con, res);
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

router.post('/my/borrowed', function(req, res){
    book_my_handler.loadBorrowedBook(con, req, res);
});

router.post('/my/reserved', function(req, res){
    book_my_handler.loadReservedBook(con, req, res);
});

router.post('/my/applied', function(req, res){
    book_my_handler.loadAppliedBook(con, req, res);
});

module.exports = router;