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


    var money_type = 0;
    var money_content = 0;
    var price = 0;
    var monthly_deposit = 0;
    var monthly_withdraw = 0;
    var remain_money = 0;
    var date = util.getDate();

    var connection = db_handler.connectDB();

    var fee = {
        'fm_id':0,
        'fm_money_type':money_type,
        'fm_money_content':money_content,
        'fm_price':price,
        'fm_monthly_deposit':monthly_deposit,
        'fm_monthly_withdraw':monthly_withdraw,
        'fm_remain_money':remain_money,
        'fm_date':date};

    var query = connection.query('insert into t_fee_manage set ?',fee,function(err,result){
        if (err) {
            console.error(err);
            throw err;
        }
        console.log(query);
        db_handler.disconnectDB(connection);

        res.render('fee_history', { title: '회비내역' });
    });

});

module.exports = router;
