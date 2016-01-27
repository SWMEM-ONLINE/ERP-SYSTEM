/**
 * Created by jung-inchul on 2015. 12. 15..
 */

var DB_handler = require('./DB_handler');


function loadBookMain(req, res){
    var con = DB_handler.connectDB();
    var query = 'select b.b_name name, DATEDIFF(CURDATE(), b.b_due_date) diff from t_book_rental a inner join t_book b on a.br_book_id=b.b_id where br_user="' + req.session.passport.user.id + '"';
    con.query(query, function(err, response){
        if(err){
            console.log('DB select ERROR in "main_handler.js -> loadBookMain"');
        }else{
            res.send(response);
        }
        DB_handler.disconnectDB(con);
    });
}

function loadHardwareMain(req, res){
    var con = DB_handler.connectDB();
    var query = 'select b.h_name name, DATEDIFF(CURDATE(), a.hr_due_date) diff from t_hardware_rental a inner join t_hardware b on a.hr_hardware_id=b.h_id where a.hr_user="' + req.session.passport.user.id + '"';
    con.query(query, function(err, response){
        if(err){
            console.log('DB select ERROR in "main_handler.js -> loadHardwareMain"');
        }else{
            res.send(response);

        }
        DB_handler.disconnectDB(con);
    });
}

function loadmyMileage(req, res){
    var con = DB_handler.connectDB();
    var query = 'select u_mileage from t_user where u_id="' + req.session.passport.user.id + '"';
    con.query(query, function(err, response){
        if(err){
            console.log('DB select ERROR in "main_handler.js -> loadmyMileage"');
        }else{
            res.send(response);
        }
        DB_handler.disconnectDB(con);
    });
}

function getUserpermission(req, res){
    var con = DB_handler.connectDB();
    var query = 'select u_state from t_user where u_id="' + req.session.passport.user.id + '"';
    con.query(query, function(err, response){
        if(err){
            res.send('failed');
            console.log('DB select ERROR in "main_handler.js -> getUserpermission"');
        }else{
            res.send(response);
        }
        DB_handler.disconnectDB(con);
    });
}

function hasToken(req, res){
    var con = DB_handler.connectDB();
    var id = req.session.passport.user.id;

    var query = "select u_token from t_user " +
        "where u_id = '" + id+"'; " ;


    con.query(query, function(err,response){
        if(err){
            console.log(err);
            res.send("error");
        }
        else{

            if(response.length ==1){
                var data = response[0];
                var token = data.u_token;
                if(token == null || token == "undefined" || token == "")
                {
                    res.send("false");
                }
                else
                {
                    res.send("true");
                }
            }
            else
            {
                res.send("false");
            }
        }
        DB_handler.disconnectDB(con);
    });
}
function getToken(req, res){
    var con = DB_handler.connectDB();

    var token = req.body.token;
    var device = req.body.device;

    var id = req.session.passport.user.id;

    var query ="UPDATE `swmem`.`t_user` SET " +
        "`u_device`='" + device + "', " +
        "`u_token`='" + token + "' WHERE " +
        "`u_id`='" + id + "';";

    con.query(query,function(err,response){

        if(err){
            console.log(err);
            res.send("error");
        }
        else{
            console.log(response);
            res.send("success");
        }
        DB_handler.disconnectDB(con);
    });
}


exports.getUserpermission = getUserpermission;
exports.loadHardwareMain = loadHardwareMain;
exports.loadBookMain = loadBookMain;
exports.loadmyMileage = loadmyMileage;
exports.hasToken = hasToken;
exports.getToken = getToken;
