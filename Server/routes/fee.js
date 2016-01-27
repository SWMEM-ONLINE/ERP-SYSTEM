/**
 * Created by DBK on 2015. 12. 6..
 */

var express = require('express');
var router = express.Router();
var util = require('./util');
var DB_handler = require('./DB_handler');

router.get('/unpaid', util.ensureAuthenticated, function(req, res, next) {

    var query = 'select * from t_fee where f_payer = "'+util.getUserId(req)+'" AND f_state = 0 ORDER BY f_write_date';
    var con = DB_handler.connectDB();
    con.query(query, function(err,rows){
        if (err) {
            console.error(err);
            DB_handler.disconnectDB(con);
            return res.render('error',{title:'잘못된 접근'});
        }
        else{
            var send = JSON.stringify(rows);
            DB_handler.disconnectDB(con);
            return res.render('fee_unpaid', { title: '회비미납내역', grade: util.getUserGrade(req), result:JSON.parse(send)});
        }
    });
});
/*
router.post('/unpaidList', util.ensureAuthenticated, function(req, res, next) {
    var category = req.body.Category;
    var state = req.body.State.bool();

    var connection = db_handler.connectDB();
    var query = connection.query('select * from t_fee where f_state = 0 ORDER BY f_write_date', function(err,rows){

        if (err) {
            console.error(err);
            res.json({status:'101'});
            throw err;
        }

        console.log(rows);
        if(0<rows.length){
            res.json({status:'0',result:rows});
            db_handler.disconnectDB(connection);
        }else{
            res.json({status:'0'});
            db_handler.disconnectDB(connection);
        }
    });

});
*/

router.post('/category', util.ensureAuthenticated, function(req, res, next) {

    var con = DB_handler.connectDB();
    con.query('select * from t_fee_type' , function(err,rows){

        if (err) {
            console.error(err);
            DB_handler.disconnectDB(con);
            return res.json({status:'101'});
        }
        else{
            var send = JSON.stringify(rows);
            DB_handler.disconnectDB(con);
            return res.json({result:JSON.parse(send)});
        }
    });

});


router.post('/userList', util.ensureAuthenticated, function(req, res, next) {

    var con = DB_handler.connectDB();
    con.query('select u_id, u_name from t_user where u_state != 1 AND u_state != 103 AND u_state != 104 AND u_state != 105 ORDER BY u_name' , function(err,rows){
        if (err) {
            console.error(err);
            DB_handler.disconnectDB(con);
            return res.json({status:'fail'});
        }
        else {
            var send = JSON.stringify(rows);
            return res.json({result: JSON.parse(send)});
        }
    });
});




router.get('/history', util.ensureAuthenticated, function(req, res, next) {

    var date = '"'+util.getCurDate().substring(0,7)+'%"';
    var query = 'select * from t_fee_manage where fm_date like '+date+' Order by fm_date DESC';

    var con = DB_handler.connectDB();

    con.query(query, function(err,rows){
        if (err) {
            console.error(err);
            DB_handler.disconnectDB(con);
            return res.render('error',{title:'잘못된 접근'});
        }
        else{
            var send = JSON.stringify(rows);
            var deposit = util.getTotalDeposit(rows);
            var withdraw = util.getTotalWithdraw(rows);
            var total = deposit - withdraw;
            DB_handler.disconnectDB(con);
            return res.render('fee_history', { title: '회비내역', grade: util.getUserGrade(req), result:JSON.parse(send), deposit:deposit, withdraw:withdraw, total:total});
        }
    });
});

router.post('/history', util.ensureAuthenticated, function(req, res, next) {

    var date = '"'+req.body.date+'%"';
    var query = 'select * from t_fee_manage where fm_date like '+date+' Order by fm_date DESC';
    var con = DB_handler.connectDB();

    con.query(query, function(err,rows){
        if (err) {
            console.error(err);
            DB_handler.disconnectDB(con);
            return res.json({status:'fail'});
        }
        else {
            var send = JSON.stringify(rows);
            var deposit = util.getTotalDeposit(rows);
            var withdraw = util.getTotalWithdraw(rows);
            var total = deposit - withdraw;
            DB_handler.disconnectDB(con);
            return res.json({result: JSON.parse(send), deposit: deposit, withdraw: withdraw, total:total});
        }
    });


});


router.get('/register', util.ensureAuthenticated, function(req, res, next) {
    res.render('fee_register', { title: '회비등록', grade: util.getUserGrade(req) });
});

router.post('/register/add', util.ensureAuthenticated, function(req, res, next) {
    /* get json data */

    var arr = req.body;
    var arrLength = arr.length;
    var values = new Array(arrLength);

    for(var i=0; i<arrLength; i++){

        var id = 0;
        var money_type = false;
        if(arr[i].Type == '1'){
            money_type = true;
        }
        var money_content = arr[i].Content;
        var price = parseInt(arr[i].Price);
        var monthly_deposit = 0;
        var monthly_withdraw = 0;
        var remain_money = 0;
        var writer = util.getUserId(req);
        var date = arr[i].Date;

        values[i] = [id, money_type, money_content, price, monthly_deposit, monthly_withdraw, remain_money, writer, date, util.getCurDateWithTime()];

    }


    var con = DB_handler.connectDB();

    con.query('insert into t_fee_manage(fm_id, fm_money_type, fm_money_content,fm_price,fm_monthly_deposit,fm_monthly_withdraw,fm_remain_money,fm_writer,fm_date,fm_write_date) values ?', [values], function(err,result) {
        if (err) {
            console.error(err);
            DB_handler.disconnectDB(con);
            return res.json({status: '101'});
        }
        else{
            DB_handler.disconnectDB(con);
            res.json({status: '0'});
        }
    });

});

router.get('/charge', util.ensureAuthenticated, function(req, res, next) {
    res.render('fee_charge',{title:'회비 추가', grade: util.getUserGrade(req)});
});

router.post('/charge', util.ensureAuthenticated, function(req, res, next) {
    var arr = req.body;
    var arrLength = arr.length;
    var values = new Array();
    var payerRow = 0;
    var j = 0;
    var chargee = [];

    for(var i=0; i<arrLength; i++){
        var obj = arr[i];
        var id = 0;
        var content = obj.Content;
        var type = obj.Type;
        var price =  parseInt(obj.Price);
        var state = 0;
        var date = obj.Date;
        var write_date = util.getCurDateWithTime();
        var payerCnt = obj.Payer.length;
        var payerIndex = 0;
        for(;j<payerRow+payerCnt; j++) {
            var payer = obj.Payer[payerIndex++];
            chargee.push(payer);
            values[j] = [id, payer, content, type, price, state, date, write_date];
        }
        payerRow += payerCnt;
        j = payerRow;
    }
    var con = DB_handler.connectDB();

    con.query('insert into t_fee(f_id, f_payer,f_content,f_type,f_price,f_state,f_date,f_write_date) values ?', [values], function(err,result){
        if (err) {
            console.error(err);
            DB_handler.disconnectDB(con);
            return res.json({status:'101'});
        }
        else{
            if(chargee.length == 1){
                util.send(chargee[0],'SWSSM NOTICE','회비가 청구되었습니다',function(err,data){
                    if (err) {
                        console.log(err);
                        DB_handler.disconnectDB(con);
                        return res.json({status:'101'});
                    } else {
                        DB_handler.disconnectDB(con);
                        return res.json({status:'0'});
                    }
                });
            }
            else{
                util.sendList(chargee,'SWSSM NOTICE','회비가 청구되었습니다',function(err,data){
                    if (err) {
                        console.log(err);
                        DB_handler.disconnectDB(con);
                        return res.json({status:'101'});
                    } else {
                        DB_handler.disconnectDB(con);
                        return res.json({status:'0'});
                    }
                });
            }
        }
    });
});

router.get('/manage', util.ensureAuthenticated, function(req, res, next) {
    res.render('fee_manage',{title:'회비 관리', grade: util.getUserGrade(req)});
});

router.post('/manage/search', util.ensureAuthenticated, function(req, res, next) {
    var con = DB_handler.connectDB();
    var term = req.body[0];
    var fee = req.body[1];
    var paid = req.body[2];
    var name = req.body[3];
    var flag = 0;
    var query = 'select * from t_fee a INNER JOIN t_user b ON a.f_payer = b.u_id';

    if((term != null && term < 4) || (fee != null && fee < 4 )|| (paid != null && paid < 2) || name != ''){
        query += ' where';
    }
    if(term != null){
        if(term < 4){
            var curDate = new Date();
            var during;
            curDate.setMonth(curDate.getMonth() - term);
            during = curDate.getFullYear()+'/'+(curDate.getMonth()+1)+'/'+curDate.getDate();
            query += ' f_write_date > ' + during;
            flag = 1;
        }
    }

    if(fee != null){
        if(fee < 4){
            if(flag){
                query += ' and';
            }
            query += ' f_type = '+ fee;
            flag = 1;
        }
    }

    if(paid != null){
        if(paid < 2){
            if(flag){
                query += ' and';
            }
            query += ' f_state = '+ paid;
            flag = 1;
        }
    }

    if(name != '' && name != undefined){
        if(flag){
            query += ' and';
        }
        query += ' u_name = "'+ name +'"';
    }
    query += ' order by f_write_date DESC';
    con.query(query,function(err,data){
        if(err){
            console.log(err);
            DB_handler.disconnectDB(con);
            return res.json({status:'fail'});
        }
        else{
            var rows = JSON.stringify(data);
            DB_handler.disconnectDB(con);
            return res.json(JSON.parse(rows));
        }
    });
});

router.post('/manage/delete', util.ensureAuthenticated, function(req, res, next) {
    var con = DB_handler.connectDB();
    var id = req.body.id;
    var query = 'delete from t_fee where f_id="'+id+'"';
    con.query(query,function(err,data){
        if (err) {
            console.error(err);
            DB_handler.disconnectDB(con);
            res.json({status:'101'});
        }
        else{
            DB_handler.disconnectDB(con);
            res.json({status:'0'});
        }
    });
});

router.post('/manage/paid', util.ensureAuthenticated, function(req, res, next) {
    var con = DB_handler.connectDB();
    var query = 'update t_fee set f_state=1 where f_id="'+req.body.id+'"';
    con.query(query,function(err,data){
        if (err) {
            console.error(err);
            DB_handler.disconnectDB(con);
            res.json({status:'101'});
        }
        else {
            DB_handler.disconnectDB(con);
            res.json({status:'0'});
        }
    });
});

/**
 * deleteFeeManage
 * 회비 삭제 메소드
 * @param id
 */

router.post('/deleteFeeManage', util.ensureAuthenticated, function(req, res, next) {

    var id = req.body.id;
    var con = DB_handler.connectDB();

    con.query('delete from t_fee_manage where fm_id = '+id, function(err,result){
        if (err) {
            console.error(err);
            DB_handler.disconnectDB(con);
            res.json({status:'101'});
        }
        else{
            DB_handler.disconnectDB(con);
            res.json({status:'0'});
        }
    });
});

module.exports = router;
