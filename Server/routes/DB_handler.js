/*
 * Created by jung-inchul on 2015. 11. 14..
 */

var mysql = require('mysql');
/*
 *  Try to connect Database.
 *  Setting host, user, port, password and datbase.
 *  If you success to connect, you can see 'connection success!'
 *  but if you not, 'mysql connection error' sentence will be shown.
*/
function connectDB(){
    var connection = mysql.createConnection({
        host : '127.0.0.1',
        user : 'root',
        port : '3306',
        password : 'qwer1234',
        database : 'swmem'
    });
    connection.connect(function(err){
        if(err){
            console.error('MySQL connection Error');
            console.error(err);
            throw err;
        }else{
            console.log('Connection Success!');
        }
    });
    return connection;
}
/*
 *  Send Query to DataBase.
 *  con = Connected DB variable
 *  sqlQuery = Query to send
 *  If you send 'select' query to DB, return table but else, nothing returned.
 */
//function sendQuery(con, flag, sqlQuery, callback){
//    var response;
//    con.query(sqlQuery, function(err, rows){
//        if(err) {
//            console.log('Failed to send query!');
//            throw err;
//        }
//        if(flag === 'SELECT' || flag === 'select') {
//            response = rows;
//            callback(response);
//        }
//    });
//}
/*
 *  Disconnect Database
 */
function disconnectDB(con){                                  // DB Disconnecting
    console.log('Database Disconnected!');
    con.end();
}

exports.connectDB = connectDB;
//exports.sendQuery = sendQuery;
exports.disconnectDB = disconnectDB;