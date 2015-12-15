/**
 * Created by jung-inchul on 2015. 12. 15..
 */

var today = new Date();
today.setHours(9);

function loadBookMain(con, req, res){
    var query = 'select b_name, b_due_date from t_book where b_rental_username="' + req.session.passport.user.name + '"';
    con.query(query, function(err, response){
        var mybookArr = new Array();
        for(var i = 0; i < response.length; i++){
            var d_day = calculate_D_day(response[i].b_due_date);
            mybookArr.push({name:response[i].b_name, Dday:d_day});
        }
        console.log(mybookArr);
    });
}

function loadHardwareMain(con, req, res){
    var query = 'select * from t_hardware a inner join t_hardware_rental b on a.h_id=b.hr_hardware_id where b.hr_user="' + req.session.passport.user.id + '"';
    con.query(query, function(err, response){
        var myhardwareArr = new Array();
        for(var i = 0; i < response.length; i++){
            var d_day = calculate_D_day(response[i].hr_due_date);
            myhardwareArr.push({name: response[i].h_name, Dday:d_day});
        }
        console.log(myhardwareArr);
    });
}

function loadMileageMain(con, req, res){

}

function loadTodaydutyMain(con, req, res){

}

function loadMydutyMain(con, req, res){

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

exports.loadHardwareMain = loadHardwareMain;
exports.loadBookMain = loadBookMain;
exports.loadMileageMain = loadMileageMain;
exports.loadTodaydutyMain = loadTodaydutyMain;
exports.loadMydutyMain = loadMydutyMain;
