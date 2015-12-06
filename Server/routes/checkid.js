/**
 * Created by KIMDONGWON on 2015-12-06.
 */
var express = require('express');
var router = express.Router();
var db_handler = require('./DB_handler');

/* GET home page. */
router.post('/', function(req, res) {
    var id = req.body.userid;
    var connection = db_handler.connectDB();

    connection.query('select * from t_user where u_id=?',id,function(err,data){
        if(err){
            console.log(err);
        }
        else {
            if (data.length > 0 || id === '') { //impossible
                res.json({status: '0'});
            }
            else{
                res.json({status: '1'}); //possible
            }
        }
        db_handler.disconnectDB(connection);
    });
});

module.exports = router;

