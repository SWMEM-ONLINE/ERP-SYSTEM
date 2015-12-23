/**
 * Created by DBK on 2015. 12. 20..
 */

var express = require('express');
var router = express.Router();
var util = require('./util');
var db_handler = require('./DB_handler');
var myApplyListCnt;

router.get('/', util.ensureAuthenticated, function(req, res, next) {
    res.render('qna', { title: '문의등록'});
});

router.post('/add', util.ensureAuthenticated, function(req, res, next) {

    var arr = req.body;

    var id = 0;
    var title = arr.title;
    var content = arr.content;
    var state = 0;  //0:등록, 1:응답대기, 2:해결, 3:삭제
    var writer = util.getUserId(req);
    var date = util.getCurDateWithTime();

    var query = 'insert into t_qna(q_id, q_title, q_content, q_state, q_writer, q_write_date) values ("'+id+'","'+title+'","'+content+'","'+state+'","'+writer+'","'+date+'")';
    console.log(query);
    var connection = db_handler.connectDB();

    connection.query(query, function(err,result){
        if (err) {
            console.error(err);
            throw err;
            res.json({status:'101'});
        }
        db_handler.disconnectDB(connection);

        res.json({status:'0'});
    });
});

router.post('/myqnalist', util.ensureAuthenticated, function(req, res, next) {

    var writer = util.getUserId(req);
    var curIdx = req.body.pageIdx;
    var length = 20;

    var query = 'select * from t_qna where q_writer = "'+writer+'" and q_state not in ( 3 ) order by q_write_date limit '+curIdx+','+length+'; select Count(q_ID) from t_qna where q_state not in ( 3 )';

    var connection = db_handler.connectDB();

    connection.query(query, function(err,rows){
        if (err) {
            console.error(err);
            throw err;
        }

        var countRow = JSON.parse(JSON.stringify(rows[rows.length-1]));
        var obj = countRow[0];
        var rowLength = parseInt(obj['Count(q_ID)']);
        var maxCnt = parseInt(rowLength/20);
        if(0<rowLength%20){
            maxCnt++;
        }

        rows.pop();

        var list = JSON.parse(JSON.stringify(rows))[0];

        var json = {"list":list, "totalIdx":maxCnt, "curIdx":curIdx};
        res.json(json);
    });

});


router.post('/myqna', util.ensureAuthenticated, function(req, res, next) {

    var qid = req.body.q_id;

    var query = 'select * from t_qna_reply where qr_id = '+qid+' order by qr_write_date';
    console.log(query);

    var connection = db_handler.connectDB();

    connection.query(query, function(err,rows){
        if (err) {
            console.error(err);
            throw err;
        }

        var send = JSON.stringify(rows);
        console.log(send);
        res.json(JSON.parse(send));
    });

});

router.post('/qnalist', util.ensureAuthenticated, function(req, res, next) {

    var curIdx = req.body.pageIdx;
    var length = 20;

    var query = 'select * from t_qna where q_state not in ( 3 ) order by q_write_date limit '+curIdx+','+length+'; select Count(q_ID) from t_qna where q_state not in ( 3 )';

    var connection = db_handler.connectDB();

    connection.query(query, function(err,rows){
        if (err) {
            console.error(err);
            throw err;
        }

        var countRow = JSON.parse(JSON.stringify(rows[rows.length-1]));
        var obj = countRow[0];
        var rowLength = parseInt(obj['Count(q_ID)']);
        var maxCnt = parseInt(rowLength/20);
        if(0<rowLength%20){
            maxCnt++;
        }

        rows.pop();

        var list = JSON.parse(JSON.stringify(rows))[0];

        var json = {"list":list, "totalIdx":maxCnt, "curIdx":curIdx};
        res.json(json);
    });

});


router.post('/qnareply', util.ensureAuthenticated, function(req, res, next) {

    var values = new Array;
    var id = req.body.id;
    var content = req.body.content;
    var writer = util.getUserId(req);
    var date = util.getCurDateWithTime();

    values = [id, content, writer, date];


    var connection = db_handler.connectDB();

    connection.query('insert into t_qna_reply(qr_id, qr_content, qr_writer, qr_write_date) values ?', [values], function(err,result){
        if (err) {
            console.error(err);
            throw err;
            res.json({status:'101'});
        }
        db_handler.disconnectDB(connection);

        res.json({status:'0'});
    });

});


router.post('/qnaModify', util.ensureAuthenticated, function(req, res, next) {

    var id = req.body.id;
    var state = req.body.state;

    var connection = db_handler.connectDB();

    connection.query('update t_qna set q_state = '+state+' where q_id = '+id, function(err,result){
        if (err) {
            console.error(err);
            throw err;
            res.json({status:'101'});
        }
        db_handler.disconnectDB(connection);

        res.json({status:'0'});
    });

});


module.exports = router;