/**
 * Created by DBK on 2015. 12. 20..
 */

var express = require('express');
var router = express.Router();
var util = require('./util');
var db_handler = require('./DB_handler');

router.get('/', util.ensureAuthenticated, function(req, res, next) {
    res.render('qna', { title: '문의등록'});
});

router.post('/add', util.ensureAuthenticated, function(req, res, next) {

    var arr = req.body;

    var id = 0;
    var title = arr.title;
    var content = arr.content;
    var state = 0;  //0:등록, 1:응답대기, 2:해결
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

router.get('/myqnalist', util.ensureAuthenticated, function(req, res, next) {

    var writer = util.getUserId(req);
    var query = 'select * from t_qna where q_writer = "'+writer+'" Order by q_ID DESC';

    var connection = db_handler.connectDB();

    connection.query(query, function(err,rows){
        if (err) {
            console.error(err);
            throw err;
        }
        var send = JSON.stringify(rows);
        res.json(JSON.parse(send));
    });

});

router.post('/myqna', util.ensureAuthenticated, function(req, res, next) {

    var qid = req.body.q_id;
    var writer = util.getUserId(req);
    var query = 'select * from t_qna a inner join t_qna_reply b on a.q_id = b.qr_id where a.q_writer = "'+writer+'" and a.q_id = '+qid;
    console.log(query);
    var connection = db_handler.connectDB();

    connection.query(query, function(err,rows){
        if (err) {
            console.error(err);
            throw err;
        }
        var send = JSON.stringify(rows);
        res.json(JSON.parse(send));
    });

});

router.get('/qnalist', util.ensureAuthenticated, function(req, res, next) {

    var writer = util.getUserId(req);
    var query = 'select * from t_qna Order by q_write_date';

    var connection = db_handler.connectDB();

    connection.query(query, function(err,rows){
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

module.exports = router;