/**
 * Created by DBK on 2015. 12. 6..
 */

var express = require('express');
var router = express.Router();
var util = require('./util');
var db_handler = require('./DB_handler');

router.get('/unpaid', util.ensureAuthenticated, function(req, res, next) {
    res.render('fee_unpaid', { title: '회비미납내역' });
});

router.post('/unpaidList', util.ensureAuthenticated, function(req, res, next) {
    var category = req.body.Category;
    var state = req.body.State.bool();

    var connection = db_handler.connectDB();
    var query = connection.query('select * from t_fee where f_type = ? AND f_state = ? ORDER BY f_write_date', category,state, function(err,rows){

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

router.post('/category', util.ensureAuthenticated, function(req, res, next) {

    var connection = db_handler.connectDB();
    var query = connection.query('select * from t_fee_type' , function(err,rows){

        if (err) {
            console.error(err);
            res.json({status:'101'});
            throw err;
        }

        var send = JSON.stringify(rows);
        res.json({result:JSON.parse(send)});

    });

});


router.post('/userList', util.ensureAuthenticated, function(req, res, next) {

    var connection = db_handler.connectDB();
    var query = connection.query('select u_id, u_name from t_user where u_state = 2 OR u_state = 3 ORDER BY u_name' , function(err,rows){

        if (err) {
            console.error(err);
            res.json({status:'101'});
            throw err;
        }

        var send = JSON.stringify(rows);
        res.json({result:JSON.parse(send)});

    });

});




router.get('/history', util.ensureAuthenticated, function(req, res, next) {

    var date = '\''+util.getCurDate().substring(0,7)+'%\'';
    var query = 'select * from t_fee_manage where fm_date like '+date+' Order by fm_date DESC';

    var connection = db_handler.connectDB();

    var query = connection.query(query, function(err,rows){
        if (err) {
            console.error(err);
            throw err;
        }
        var send = JSON.stringify(rows);
        var deposit = getTotalDeposit(rows);
        var withdraw = getTotalWithdraw(rows);
        res.render('fee_history', { title: '회비내역', result:JSON.parse(send), deposit:deposit,withdraw:withdraw});
    });



});

router.post('/history', util.ensureAuthenticated, function(req, res, next) {

    var date = '\''+req.body.date+'%\'';
    var query = 'select * from t_fee_manage where fm_date like '+date+' Order by fm_date DESC';
    console.log(query);
    var connection = db_handler.connectDB();

    var query = connection.query(query, function(err,rows){
        if (err) {
            console.error(err);
            throw err;
        }
        var send = JSON.stringify(rows);
        var deposit = getTotalDeposit(rows);
        var withdraw = getTotalWithdraw(rows);
        res.json({result:JSON.parse(send), deposit:deposit,withdraw:withdraw});
    });


});


router.get('/register', util.ensureAuthenticated, function(req, res, next) {

    res.render('fee_register', { title: '회비등록' });
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


    var connection = db_handler.connectDB();

    var query = connection.query('insert into t_fee_manage(fm_id, fm_money_type, fm_money_content,fm_price,fm_monthly_deposit,fm_monthly_withdraw,fm_remain_money,fm_writer,fm_date,fm_write_date) values ?', [values], function(err,result){
        if (err) {
            console.error(err);
            throw err;
            res.json({status:'101'});
        }
        db_handler.disconnectDB(connection);

        res.json({status:'0'});
    });

});

router.get('/charge', util.ensureAuthenticated, function(req, res, next) {
    res.render('fee_charge',{title:'회비 추가'});
});

router.post('/charge', util.ensureAuthenticated, function(req, res, next) {

    var arr = req.body;
    var arrLength = arr.length;
    var values = new Array(arrLength);

    for(var i=0; i<arrLength; i++){

        var id = 0;
        var payer = arr[i].Payer;
        var name = arr[i].Name;
        var content = arr[i].Content;
        var type = arr[i].Type;
        var price =  parseInt(arr[i].Price);
        var state = 0;
        var date = util.getCurDateWithTime();

        values[i] = [id, money_type, money_content, price, monthly_deposit, monthly_withdraw, remain_money, writer, date, ];

    }

    var connection = db_handler.connectDB();

    var query = connection.query('insert into t_fee(f_id, f_payer, f_name,f_content,f_type,f_price,f_state,f_write_date) values ?', [values], function(err,result){
        if (err) {
            console.error(err);
            throw err;
            res.json({status:'101'});
        }
        db_handler.disconnectDB(connection);

        res.json({status:'0'});
    });


});


function getTotalDeposit(arr){
    var price = 0;
    var length = arr.length;
    for(var i=0; i<length; i++){
        var obj = arr[i];
        if(obj.fm_money_type == 0){
            price += obj.fm_price;
        }
    }
    return price;
}

function getTotalWithdraw(arr){
    var price = 0;
    var length = arr.length;
    for(var i=0; i<length; i++){
        var obj = arr[i];
        if(obj.fm_money_type == 1){
            price += obj.fm_price;
        }
    }
    return price;
}

module.exports = router;
