/**
 * Created by DBK on 2015. 12. 20..
 */

var express = require('express');
var router = express.Router();
var util = require('./util');
var db_handler = require('./DB_handler');

router.get('/add', util.ensureAuthenticated, function(req, res, next) {
    res.render('qna_add', { title: '문의등록'});
}

router.post('/add', util.ensureAuthenticated, function(req, res, next) {

    var arr = req.body;
    var arrLength = arr.length;
    var values = new Array(arrLength);


    var id = 0;
    var title = arr[i].Title;
    var content = arr[i].Content;
    var state = 0;  //0:등록, 1:응답대기, 2:해결
    var writer = util.getUserId(req);
    var date = util.getCurDateWithTime();

    values[0] = [id, title, content, state, writer, date];


    var connection = db_handler.connectDB();

    var query = connection.query('insert into t_qna(q_id, q_title, q_content, q_state, q_writer, q_write_date) values ?', [values], function(err,result){
        if (err) {
            console.error(err);
            throw err;
            res.json({status:'101'});
        }
        db_handler.disconnectDB(connection);

        res.json({status:'0'});
    });

});

router.get('/myqnalist', util.ensureAuthenticated, function(req, res, next) {

    var writer = util.getUserId(req);
    var query = 'select * from t_qna where q_writer ='+writer+' Order by q_write_date';

    var connection = db_handler.connectDB();

    var query = connection.query(query, function(err,rows){
        if (err) {
            console.error(err);
            throw err;
        }
        var send = JSON.stringify(rows);
        res.render('my_qna', { title: '나의 문의내역', result:JSON.parse(send)});
    });

});

router.post('/myqna', util.ensureAuthenticated, function(req, res, next) {

    var qid = res.body;
    var writer = util.getUserId(req);
    var query = 'select * from t_qna a inner join t_qna_reply b on a.q_id = b.qr_id where a.q_writer = '+writer+' and a.q_id = '+qid+' Order by b.qr_write_date';

    var connection = db_handler.connectDB();

    var query = connection.query(query, function(err,rows){
        if (err) {
            console.error(err);
            throw err;
        }
        var send = JSON.stringify(rows);
        res.render('my_qna', { title: '나의 문의내역', result:JSON.parse(send)});
    });

});

router.get('/qnalist', util.ensureAuthenticated, function(req, res, next) {

    var writer = util.getUserId(req);
    var query = 'select * from t_qna Order by q_write_date';

    var connection = db_handler.connectDB();

    var query = connection.query(query, function(err,rows){
        if (err) {
            console.error(err);
            throw err;
            res.json({status:'101'});
        }
        var send = JSON.stringify(rows);
        res.json({result:JSON.parse(send)});
    });

});


router.post('/qnareply', util.ensureAuthenticated, function(req, res, next) {

    var values = new Array;
    var id = 0;
    var content = req.body;
    var writer = util.getUserId(req);
    var date = util.getCurDateWithTime();

    values = [id, content, writer, date];


    var connection = db_handler.connectDB();

    var query = connection.query('insert into t_qna_reply(qr_id, qr_content, qr_writer, qr_write_date) values ?', [values], function(err,result){
        if (err) {
            console.error(err);
            throw err;
            res.json({status:'101'});
        }
        db_handler.disconnectDB(connection);

        res.json({status:'0'});
    });

});
