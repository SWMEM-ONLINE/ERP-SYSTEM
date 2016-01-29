/**
 * Created by DBK on 2015. 12. 20..
 */

var express = require('express');
var router = express.Router();
var util = require('./util');
var DB_handler = require('./DB_handler');
var myApplyListCnt;

router.get('/', util.ensureAuthenticated, function(req, res, next) {
    res.render('qna', { title: '문의 등록', grade: util.getUserGrade(req)});
});

router.get('/qnaManage', util.ensureAuthenticated, function(req, res, next) {
    res.render('qna_manage', { title: '문의 관리', grade: util.getUserGrade(req)});
});

router.post('/qnaAdd', util.ensureAuthenticated, function(req, res, next) {

    var id = 0;
    var title = req.body.title;
    var content = req.body.content;
    var state = 0;  //0:등록, 1:응답대기, 2:해결, 3:삭제
    var writer = util.getUserId(req);
    var date = util.getCurDateWithTime();

    var query = 'insert into t_qna(q_id, q_title, q_content, q_state, q_writer, q_write_date) values ("'+id+'","'+title+'","'+content+'","'+state+'","'+writer+'","'+date+'")';
    var con = DB_handler.connectDB();

    con.query(query, function(err,result){
        if (err) {
            console.error(err);
            DB_handler.disconnectDB(con);
            return res.json({status:'101'});
        }
        else{
            DB_handler.disconnectDB(con);
            res.json({status:'0'});
        }
    });
});

router.post('/myqnalist', util.ensureAuthenticated, function(req, res, next) {

    var writer = util.getUserId(req);
    var page = parseInt(req.body.pageIdx);
    var curIdx = (page-1)*20;
    var length = 20;

    var query = 'select * from t_qna where q_writer = "'+writer+'" and q_state not in ( 3 ) order by q_write_date DESC limit '+curIdx+','+length+'; select Count(q_ID) from t_qna where q_state not in ( 3 )';

    var con = DB_handler.connectDB();

    con.query(query, function(err,rows){
        if (err) {
            console.error(err);
            DB_handler.disconnectDB(con);
            return res.json({status:'fail'});
        }
        else {
            var countRow = JSON.parse(JSON.stringify(rows[rows.length - 1]));
            var obj = countRow[0];
            var rowLength = parseInt(obj['Count(q_ID)']);
            var totalPaget = parseInt(rowLength / 20);
            if (0 < rowLength % 20) {
                totalPaget++;
            }

            rows.pop();

            var list = JSON.parse(JSON.stringify(rows))[0];

            var json = {"list": list, "totalPage": totalPaget, "curPage": page};
            DB_handler.disconnectDB(con);
            return res.json(json);
        }
    });

});


router.post('/setQnaReply', util.ensureAuthenticated, function(req, res, next) {

    var values = new Array();
    var id = req.body.q_id;
    var content = req.body.content;
    var writer = util.getUserId(req);
    var date = util.getCurDateWithTime();

    values = [id, content, writer, date];

    var con = DB_handler.connectDB();
    var query = 'insert into t_qna_reply(qr_id, qr_content, qr_writer, qr_write_date) values ('+id+',"'+content+'","'+writer+'","'+date+'")';
    con.query(query, function(err,result){
        if (err) {
            console.error(err);
            DB_handler.disconnectDB(con);
            return res.json({status:'101'});
        }
        else{
            DB_handler.disconnectDB(con);
            return res.json({status:'0'});
        }
    });

});


router.post('/getQnaReply', util.ensureAuthenticated, function(req, res, next) {

    var q_id = req.body.q_id;
    var query = 'select t_qna_reply.*, u_name from t_qna_reply left join t_user on t_qna_reply.qr_writer = t_user.u_id where t_qna_reply.qr_id = '+q_id+' order by t_qna_reply.qr_write_date DESC';

    var con = DB_handler.connectDB();

    con.query(query, function(err,rows){
        if (err) {
            DB_handler.disconnectDB(con);
            return res.json({status:'fail'});
        }
        else{
            var send = JSON.stringify(rows);
            DB_handler.disconnectDB(con);
            return res.json(JSON.parse(send));
        }
    });

});

router.post('/qnalist', util.ensureAuthenticated, function(req, res, next) {

    var page = parseInt(req.body.pageIdx);
    var curIdx = (page-1)*20;
    var length = 20;

    var query = 'select * from t_qna where q_state not in ( 3 ) order by q_write_date DESC limit '+curIdx+','+length+'; select Count(q_ID) from t_qna where q_state not in ( 3 )';

    var con = DB_handler.connectDB();

    con.query(query, function(err,rows){
        if (err) {
            console.error(err);
            DB_handler.disconnectDB(con);
            return res.json({status:'fail'});
        }
        else {

            var countRow = JSON.parse(JSON.stringify(rows[rows.length - 1]));
            var obj = countRow[0];
            var rowLength = parseInt(obj['Count(q_ID)']);
            var totalPaget = parseInt(rowLength / 20);
            if (0 < rowLength % 20) {
                totalPaget++;
            }

            rows.pop();

            var list = JSON.parse(JSON.stringify(rows))[0];

            var json = {"list": list, "totalPage": totalPaget, "curPage": page};
            DB_handler.disconnectDB(con);
            return res.json(json);
        }
    });

});



router.post('/qnaModify', util.ensureAuthenticated, function(req, res, next) {

    var id = req.body.q_id;
    var state = req.body.state;
    var con = DB_handler.connectDB();
    var query = 'update t_qna set q_state = '+state+' where q_id = '+id;
    con.query(query, function(err,result){
        if (err) {
            console.error(err);
            DB_handler.disconnectDB(con);
            return res.json({status:'101'});
        }
        else {
            DB_handler.disconnectDB(con);
            res.json({status: '0'});
        }
    });

});

router.post('/qnaDelete', util.ensureAuthenticated, function(req, res, next) {

    var id = req.body.q_id;

    var con = DB_handler.connectDB();
    var query = 'update t_qna set q_state = 3 where q_id = '+id;
    con.query(query, function(err,result){
        if (err) {
            console.error(err);
            DB_handler.disconnectDB(con);
            return res.json({status:'101'});
        }
        else {
            DB_handler.disconnectDB(con);
            res.json({status: '0'});
        }
    });

});


module.exports = router;