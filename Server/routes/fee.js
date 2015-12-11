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

router.get('/history', util.ensureAuthenticated, function(req, res, next) {


    var connection = db_handler.connectDB();

    res.render('fee_history', { title: '회비내역' });

    db_handler.disconnectDB(connection);
});

router.post('/history', util.ensureAuthenticated, function(req, res, next) {


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

        console.log("test02:"+i);
        var id = 0;
        var money_type = false;
        if(arr[i].money_type == '지출'){
            money_type = true;
        }
        var money_content = arr[i].Content;
        var price = parseInt(arr[i].Price);
        var monthly_deposit = 0;
        var monthly_withdraw = 0;
        var remain_money = 0;
        var writer = util.getUserId(req);
        var date = arr[i].Date;

        values[i] = [id, money_type, money_content, price, monthly_deposit, monthly_withdraw, remain_money, writer, date, util.getDate()];

    }
    var connection = db_handler.connectDB();

    var query = connection.query('insert into t_fee_manage(fm_id, fm_money_type, fm_money_content,fm_price,fm_monthly_deposit,fm_monthly_withdraw,fm_remain_money,fm_writer,fm_date,fm_write_date) values ?', [values], function(err,result){
        if (err) {
            console.error(err);
            throw err;
            res.json({status:'101'});
        }
        console.log(query);
        db_handler.disconnectDB(connection);

        res.json({status:'0'});
    });

/*
    var sql = "INSERT INTO Test (name, email, n) VALUES ?";
    var values = [
        ['demian', 'demian@gmail.com', 1],
        ['john', 'john@gmail.com', 2],
        ['mark', 'mark@gmail.com', 3],
        ['pete', 'pete@gmail.com', 4]
    ];
    conn.query(sql, [values], function(err) {
        if (err) throw err;

        db_handler.disconnectDB(connection);

        res.json({status:'0'});
    });
    */
});


module.exports = router;
