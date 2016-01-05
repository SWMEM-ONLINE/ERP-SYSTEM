/**
 * Created by jung-inchul on 2015. 11. 30..
 */
var express = require('express');
var DB_handler = require('./DB_handler');

var con = DB_handler.connectDB();
var router = express.Router();
var book_handler = require('./book_handler');
var book_my_handler = require('./book_mybook_handler');
var util = require('./util');

router.get('/tech', util.ensureAuthenticated, function(req, res, next) {
    res.render('book_tech', { title: '기술도서 대여', grade: util.getUserGrade(req)});
});

router.get('/humanities', util.ensureAuthenticated, function(req, res, next) {
    res.render('book_humanities', { title: '인문도서 대여', grade: util.getUserGrade(req)});
});

router.get('/mybook', util.ensureAuthenticated, function(req, res, next){
    res.render('book_mybook', { title : '내 도서 현황', grade: util.getUserGrade(req)});
});

router.post('/loadNewHumanitiesbook', util.ensureAuthenticated, function(req, res){
   book_handler.loadNewHumanitiesbook(con, res);
});

router.post('/loadNewTechbook', util.ensureAuthenticated, function(req, res){
    book_handler.loadNewTechbook(con, res);
});

router.post('/searchBook', util.ensureAuthenticated, function(req, res){
    book_handler.searchBook(con, req, res);  // { 카테고리 : 무엇인지, 찾으려는 단어 : 입력값 } 형태
});

router.post('/borrowBook', util.ensureAuthenticated, function(req, res){
    book_handler.borrowBook(con, req, res);
});

router.post('/reserveBook', util.ensureAuthenticated, function(req, res){
    book_handler.reserveBook(con, req, res);
});

router.post('/missingBook', util.ensureAuthenticated, function(req, res){
    book_handler.missingBook(con, req, res);
});

router.post('/mybook/borrowed', util.ensureAuthenticated, function(req, res){
    book_my_handler.loadBorrowedBook(con, req, res);
});

router.post('/mybook/reserved', util.ensureAuthenticated, function(req, res){
    book_my_handler.loadReservedBook(con, req, res);
});

router.post('/mybook/applied', util.ensureAuthenticated, function(req, res){
    book_my_handler.loadAppliedBook(con, req, res);
});

router.post('/mybook/turnIn', util.ensureAuthenticated, function(req, res){
    book_my_handler.turninBook(con, req, res);
});

router.post('/mybook/cancelReservation', util.ensureAuthenticated, function(req, res){
    book_my_handler.cancelReservation(con, req, res);
});

router.post('/mybook/postpone', util.ensureAuthenticated, function(req, res){
    book_my_handler.postponeBook(con, req, res);
});

router.post('/mybook/missing',util.ensureAuthenticated, function(req, res){
    book_my_handler.missingBook(con, req, res);
});

router.post('/mybook/cancelAppliedbook',util.ensureAuthenticated, function(req, res){
    book_my_handler.cancelAppliedbook(con, req, res);
});

router.get('/manage/history', util.ensureAuthenticated, function(req, res, next){
    res.render('book_manage_history', { title: '도서 히스토리', grade: util.getUserGrade(req)});
});

router.post('/manage/loadnowHistory', util.ensureAuthenticated, function(req, res){
    book_handler.loadnowHistory(con, req, res);
});

router.post('/manage/loadpastHistory', util.ensureAuthenticated, function(req, res){
    book_handler.loadpastHistory(con, req, res);
});

router.get('/manage/missing', util.ensureAuthenticated, function(req, res, next){
    res.render('book_manage_missing', { title: '분실도서목록', grade: util.getUserGrade(req)});
});

router.post('/manage/loadmissingBook', util.ensureAuthenticated, function(req, res){
    book_handler.loadmissingBook(con, req, res);
});

router.post('/manage/reenroll', util.ensureAuthenticated, function(req, res){
    book_handler.reenroll(con, req, res);
});

router.post('/manage/inArrears', util.ensureAuthenticated, function(req, res){
    book_handler.loadinArrears(con, req, res);
});

router.get('/manage/inArrears', util.ensureAuthenticated, function(req, res){
    res.render('book_manage_inArrears', { title : '연체자목록', grade: util.getUserGrade(req)});
});

router.post('/manage/loadinArrears', util.ensureAuthenticated, function(req, res){
    book_handler.loadinArrears(con, req, res);
});

router.get('/manage/apply', util.ensureAuthenticated, function(req, res){
    res.render('book_manage_apply', { title : '신청도서관리', grade: util.getUserGrade(req)});
});

router.post('/manage/loadapplylist', util.ensureAuthenticated, function(req, res){
    book_handler.loadApplylist(con, req, res);
});

router.post('/manage/enrollBook', util.ensureAuthenticated, function(req, res){
    book_handler.enrollBook(con, req, res);
});

router.post('/manage/buyComplete', util.ensureAuthenticated, function(req, res){
    book_handler.buyComplete(con, req, res);
});

router.get('/manage/item', util.ensureAuthenticated, function(req, res){
    res.render('book_manage_item', { title : '도서 관리', grade: util.getUserGrade(req)});
});

router.post('/manage/loadbooklist', util.ensureAuthenticated, function(req, res){
    book_handler.loadbooklist(con, req, res);
});

router.post('/manage/resetbookLocation', util.ensureAuthenticated, function(req, res){
    book_handler.resetbookLocation(con, req, res);
});

module.exports = router;