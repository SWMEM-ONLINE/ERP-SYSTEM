/**
 * Created by jung-inchul on 2015. 12. 15..
 */
function loadBookMain(con, req, res){
    var query = 'select b.b_name name, DATEDIFF(CURDATE(), b.b_due_date) diff from t_book_rental a inner join t_book b on a.br_book_id=b.b_id where br_user="' + req.session.passport.user.id + '"';
    con.query(query, function(err, response){
        res.send(response);
    });
}

function loadHardwareMain(con, req, res){
    var query = 'select b.h_name name, DATEDIFF(CURDATE(), a.hr_due_date) diff from t_hardware_rental a inner join t_hardware b on a.hr_hardware_id=b.h_id where a.hr_user="' + req.session.passport.user.id + '"';
    con.query(query, function(err, response){
        res.send(response);
    });
}

function loadMileageMain(con, req, res){

}

function loadTodaydutyMain(con, req, res){

}

function loadMydutyMain(con, req, res){

}

function getUserpermission(con, req, res){
    var query = 'select u_state from t_user where u_id="' + req.session.passport.user.id + '"';
    con.query(query, function(err, response){
        if(err){
            res.send('failed');
            throw err;
        }
        res.send(response);
    });
}

exports.getUserpermission = getUserpermission;
exports.loadHardwareMain = loadHardwareMain;
exports.loadBookMain = loadBookMain;
exports.loadMileageMain = loadMileageMain;
exports.loadTodaydutyMain = loadTodaydutyMain;
exports.loadMydutyMain = loadMydutyMain;
