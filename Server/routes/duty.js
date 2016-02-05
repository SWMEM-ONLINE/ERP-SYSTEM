/**
 * Created by HyunJae on 2015. 12. 20..
 */

var express = require('express');
var DB_handler = require('./DB_handler');
var util = require('./util');

var router = express.Router();
var duty_handler = require('./duty_handler');
var checklist_handler = require('./duty_checklist_handler');

/*
 *  Part. 겟
 */
router.get('/inquiry', util.ensureAuthenticated, function(req, res, next) {
    res.render('duty_inquiry', { title: '당직 조회', grade: util.getUserGrade(req) });
});

router.get('/change', util.ensureAuthenticated, function(req, res, next) {
    res.render('duty_change', { title: '당직 교환', grade: util.getUserGrade(req)});
});

router.get('/point', util.ensureAuthenticated, function(req, res, next) {
    res.render('point_inquiry', { title: '상벌당직 조회', grade: util.getUserGrade(req)});
});

router.get('/checklist', util.ensureAuthenticated, function(req, res, next) {
    res.render('duty_checklist', { title: 'CheckList', grade: util.getUserGrade(req)});
});

router.get('/add', util.ensureAuthenticated, function(req, res, next) {
    res.render('point_add', { title: '상벌당직 추가', grade: util.getUserGrade(req)});
});

router.get('/modify', util.ensureAuthenticated, function(req, res, next) {
    res.render('point_modify', { title: '상벌당직 수정', grade: util.getUserGrade(req)});
});

router.get('/setting', util.ensureAuthenticated, function(req, res, next) {
    res.render('duty_setting', { title: '당직 설정', grade: util.getUserGrade(req)});
});

router.get('/manage', util.ensureAuthenticated, function(req, res, next) {
    res.render('duty_manage', { title: '당직 관리', grade: util.getUserGrade(req)});
});

router.get('/checkListSetting', util.ensureAuthenticated, function(req, res, next) {
    res.render('checklist_setting', { title: 'CheckList 관리', grade: util.getUserGrade(req)});
});


/*
 *  Part. 포스트
 */
router.post('/loadMyDuty', util.ensureAuthenticated, function(req, res){
    duty_handler.loadMyDuty(req,res);
});

router.post('/getUser', util.ensureAuthenticated, function(req, res){
    duty_handler.getUser(req,res);
});

router.post('/loadMyPointHistory', util.ensureAuthenticated, function(req, res){
    duty_handler.loadMyPointHistory(req,res);
});

router.post('/addPoint', util.ensureAuthenticated, function(req, res){
    duty_handler.addPoint(req,res);
});

router.post('/modifyPoint', util.ensureAuthenticated, function(req, res){
    duty_handler.modifyPoint(req,res);
});

router.post('/getAddPoint', util.ensureAuthenticated, function(req, res){
    duty_handler.getAddPoint(req,res);
});

router.post('/getMemberList', util.ensureAuthenticated, function(req, res){
    duty_handler.getMemberList(req,res);
});

router.post('/removePointHistory', util.ensureAuthenticated, function(req, res){
    duty_handler.removePointHistory(req,res);
});

router.post('/modifyPointHistoty', util.ensureAuthenticated, function(req, res){
    duty_handler.modifyPointHistoty(req,res);
});

router.post('/loadDuty', util.ensureAuthenticated, function(req, res){
    duty_handler.loadDuty(req,res);
});

router.post('/getName', util.ensureAuthenticated, function(req, res){
    duty_handler.getName(req,res);
});

router.post('/requestChangeDuty', util.ensureAuthenticated, function(req, res){
    duty_handler.requestChangeDuty(req,res);
});

router.post('/showChangeDutyHistrory', util.ensureAuthenticated, function(req, res){
    duty_handler.showChangeDutyHistrory(req,res);
});

router.post('/getID', util.ensureAuthenticated, function(req, res){
    duty_handler.getID(req,res);
});

router.post('/acceptChangeDuty', util.ensureAuthenticated, function(req, res){
    duty_handler.acceptChangeDuty(req,res);
});

router.post('/declineChangeDuty', util.ensureAuthenticated, function(req, res){
    duty_handler.declineChangeDuty(req,res);
});

router.post('/forceChangeDuty', util.ensureAuthenticated, function(req, res){
    duty_handler.forceChangeDuty(req,res);
});

router.post('/showChangeDutyHistroryAll', util.ensureAuthenticated, function(req, res){
    duty_handler.showChangeDutyHistroryAll(req,res);
});

router.post('/loadAllDuty', util.ensureAuthenticated, function(req, res){
    duty_handler.loadAllDuty(req,res);
});

router.post('/autoMakeDuty', util.ensureAuthenticated, function(req, res){
    duty_handler.autoMakeDuty(req,res);
});


router.post('/updateMemberPoint', util.ensureAuthenticated, function(req, res){
    duty_handler.updateMemberPoint(req,res);
});

router.post('/loadTodayDuty', util.ensureAuthenticated, function(req, res){
    duty_handler.loadTodayDuty(req,res);
});

router.post('/initLastDuty', util.ensureAuthenticated, function(req, res){
    duty_handler.initLastDuty(req,res);
});

router.post('/getAllPoint', util.ensureAuthenticated, function(req, res){
    duty_handler.getAllPoint(req,res);
});
router.post('/getAllPointHistory', util.ensureAuthenticated, function(req, res){
    duty_handler.getAllPointHistory(req,res);
});

router.post('/moveDuty', util.ensureAuthenticated, function(req, res){
    duty_handler.moveDuty(req,res);
});
router.post('/changeDutyMode', util.ensureAuthenticated, function(req, res){
    duty_handler.changeDutyMode(req,res);
});

router.post('/loadSpecificDuty', util.ensureAuthenticated, function(req, res){
    duty_handler.loadSpecificDuty(req,res);
});


/**
 *  checkList handle
 */
router.post('/inquireCheckList', util.ensureAuthenticated, function(req, res){
    checklist_handler.inquireCheckList(req,res);
});

router.post('/insertCheckList', util.ensureAuthenticated, function(req, res){
    checklist_handler.insertCheckList(req,res);
});

router.post('/modifyCheckList', util.ensureAuthenticated, function(req, res){
    checklist_handler.modifyCheckList(req,res);
});

router.post('/deleteCheckList', util.ensureAuthenticated, function(req, res){
    checklist_handler.deleteCheckList(req,res);
});
router.post('/inquireAllCheckList', util.ensureAuthenticated, function(req, res){
    checklist_handler.inquireAllCheckList(req,res);
});

router.post('/inquireBadCheckList', util.ensureAuthenticated, function(req, res){
    checklist_handler.inquireBadCheckList(req,res);
});

router.post('/inquireALLBadCheckList', util.ensureAuthenticated, function(req, res){
    checklist_handler.inquireALLBadCheckList(req,res);
});

router.post('/insertBadCheckList', util.ensureAuthenticated, function(req, res){
    checklist_handler.insertBadCheckList(req,res);
});

router.post('/modifyBadCheckList', util.ensureAuthenticated, function(req, res){
    checklist_handler.modifyBadCheckList(req,res);
});
router.post('/deleteBadCheckList', util.ensureAuthenticated, function(req, res){
    checklist_handler.deleteBadCheckList(req,res);
});

router.post('/getRecentGrade', util.ensureAuthenticated, function(req, res){
    checklist_handler.getRecentGrade(req,res);
});



module.exports = router;