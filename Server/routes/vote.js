/**
 * Created by KIMDONGWON on 2016-01-08.
 */
var express = require('express');
var DB_handler = require('./DB_handler');
//var con = DB_handler.connectDB();
var router = express.Router();
var util = require('./util');

router.get('/', util.ensureAuthenticated, function(req, res, next) {
    res.render('vote', {title: '설문조사', grade: util.getUserGrade(req)});
});

router.get('/vManage', util.ensureAuthenticated, function(req, res, next) {
    res.render('vote_manage', {title: '설문조사 관리', grade: util.getUserGrade(req)});
});

/**
 * createNewVote
 * 투표 생성 메소드
 * @param vTitle
 * @param vContent
 * @param vType
 * @param vItems
 */

router.post('/createNewVote', util.ensureAuthenticated, function(req, res, next) {

    var title = req.body.vTitle;
    var content = req.body.vContent;
    var state = 1;                      //0: 삭제, 1: 투표중 2: 투표완료
    var type = req.body.vType;
    var writter = util.getUserId(req);
    var itemsArr = req.body.vItems;
    var itemCnt = itemsArr.length;

    var vote = {    'v_id':0,
        'v_title':title,
        'v_content':content,
        'v_state':state,
        'v_type':type,
        'v_writer':writter};

    var connection = db_handler.connectDB();

    var query = connection.query('insert into t_vote set ?',vote,function(err,row){
        if (err) {
            console.error(err);
            db_handler.disconnectDB(connection);
            return res.json({status:'101'});
        }

        var pid = query.values.v_id;
        var voteItems = new Array(itemCnt);

        for(var i=0; i<itemCnt; i++){
            var vi_title = itemsArr[i].title;
            var vi_cnt = 0;

            voteItems[i] = [0, pid, vi_title, vi_state, vi_cnt];
        }

        connection.query('insert into t_vote_item(vi_id, vi_pid, vi_title, vi_cnt) values ?', [voteItems], function(err,row){
            if (err) {
                console.error(err);
                db_handler.disconnectDB(connection);
                return res.json({status:'101'});
            }

            db_handler.disconnectDB(connection);
            return res.json({status:'0'});
        });

    });
});

/**
 * getVoteList
 * 투표 리스트 가져오기 메소드
 * @param type  (투표완료:0, 투표중:1)
 * @return vList
 */

router.post('/getVoteList', util.ensureAuthenticated, function(req, res, next) {

    var type = req.body.Type;

    var connection = db_handler.connectDB();

    var query = 'select * from t_vote';

    if(type == 1){
        query += 'where v_state = 1';
    }else if(type == 0){
        query += 'where v_state = 0';
    }

    query += 'ORDER BY v_write_date';

    connection.query(query, function(err,row){
        if (err) {
            console.error(err);
            db_handler.disconnectDB(connection);
            return res.json({status:'101'});
        }


    });
});


/**
 * getVoteInfo
 * 투표정보 가져오기 메소드
 * @param id
 * @return vInfos
 */

router.post('/getVoteInfo', util.ensureAuthenticated, function(req, res, next) {

    var id = req.body.id;

    var connection = db_handler.connectDB();

    var query = 'select * from t_vote_item where vi_pid = '+id+' ORDER BY vi_id DESC';

    connection.query(query, function(err,data){
        if (err) {
            console.error(err);
            db_handler.disconnectDB(connection);
            return res.json({status:'101'});
        }

        var rows = JSON.stringify(data);
        return res.json(JSON.parse(rows));
    });
});


/**
 * deleteVote
 * 투표정보 삭제 메소드
 * @param id
 * @return result
 */

router.post('/deleteVote', util.ensureAuthenticated, function(req, res, next) {

    var id = req.body.id;

    var connection = db_handler.connectDB();

    var query = 'update t_vote set v_state = 0 where v_id = '+id;

    connection.query(query, function(err,data){
        if (err) {
            console.error(err);
            db_handler.disconnectDB(connection);
            return res.json({status:'101'});
        }

        return res.json({status:'0'});
    });
});

module.exports = router;