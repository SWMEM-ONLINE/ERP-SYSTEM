/**
 * Created by DBK on 2016. 1. 4..
 */

var today = new Date();
today.setHours(9);

function loadBookInfo(con, req, res){
    var query = 'select b_name, b_due_date from t_book where b_rental_username="' + util.getUserId(req) + '"';
    con.query(query, function(err, rows){
        var cnt = rows.length;
        if(0<cnt)

    });
}

function loadHardwareInfo(con, req, res){
    var query = 'select * from t_hardware a inner join t_hardware_rental b on a.h_id=b.hr_hardware_id where b.hr_user="' + util.getUserId(req) + '"';
    con.query(query, function(err, rows){
        var cnt = rows.length;
        if(0<cnt)

    });
}

function loadFeeInfo(con, req, res){

    var query = 'select * from t_fee where f_payer = "'+util.getUserId(req)+'" AND f_state = 0 ORDER BY f_write_date';
    var connection = db_handler.connectDB();
    con.query(query, function(err,rows){
        var cnt = rows.length;
        if(0<cnt)

    });

}

function calculate_D_day(time){
    var string = 'D';
    var duedate = new Date(time);
    duedate.setHours(9);
    if(duedate.getTime() <= today.getTime()){
        var overdue = parseInt((today.getTime() - duedate.getTime()) / (1000 * 3600 * 24));
        string += '+' + overdue;
    }else{
        var yet = parseInt((duedate.getTime() - today.getTime()) / (1000 * 3600 * 24));
        string += '-' + yet;
    }
    return string;
}

exports.loadBookInfo = loadBookInfo;
exports.loadHardwareInfo = loadHardwareInfo;
exports.loadFeeInfo = loadFeeInfo;
