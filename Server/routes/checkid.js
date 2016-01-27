/**
 * Created by KIMDONGWON on 2015-12-06.
 */
var express = require('express');
var router = express.Router();
var DB_handler = require('./DB_handler');
var util = require('./util');

/* GET home page. */
router.post('/', util.ensureAuthenticated, function(req, res) {
    var id = req.body.userid;
    var con = DB_handler.connectDB();

    con.query('select * from t_user where u_id=?',id,function(err,data){
        if(err){
            console.log(err);
            DB_handler.disconnectDB(con);
            return res.json({status: 'fail'});
        }
        else {
            if (data.length > 0 || id === '') { //impossible
                DB_handler.disconnectDB(con);
                return res.json({status: '0'});
            }
            else{
                DB_handler.disconnectDB(con);
                return res.json({status: '1'}); //possible
            }
        }
    });
});

module.exports = router;

