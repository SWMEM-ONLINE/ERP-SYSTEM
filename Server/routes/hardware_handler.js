/**
 * Created by jung-inchul on 2015. 12. 7..
 */
function loadHardwarelist(con, req, res){
    var query = 'select * from t_hardware';
    con.query(query, function(err, response){
        res.send(response);
    });
}

function borrowHardware(con, req, res){
    var query = 'select h_remaining from t_hardware where h_id="' + req.body.hardware_id + '"';
    var query1 = 'insert into t_hardware_waiting SET ?';
    var query2 = 'update t_hardware set h_remaining=h_remaining-1 where h_id="'+req.body.hardware_id+'"';
    var dataset = {
        hw_user : req.session.passport.user.id,
        hw_hardware_id : req.body.hardware_id,
        hw_request_date : getDate(new Date(), 0),
        hw_kind : 0
    };

    con.query(query, function(err, response){
        if(response[0].h_remaining > 0){                // If remaining.
            con.query(query1, dataset);
            con.query(query2);
            // 운영자님에게 push 알림을 날린다.
        }else{                                          // nothing there.
            res.send('failed');
        }
    });
}

function loadLender(con, req, res){
    var query = 'select * from t_user a inner join t_hardware_rental b on a.u_id=b.hr_user where b.hr_hardware_id="'+req.body.hardware_id+'"';
    con.query(query, function(err, response){
        res.send(response);
    });
}

function turnInHardware(con, req, res){
    var query1 = 'insert into t_hardware_waiting SET ?';
    var dataset = {
        hw_user : req.session.passport.user.id,
        hw_hardware_id: req.body.hardware_id,
        hw_request_date: getDate(new Date(), 0),
        hw_kind : 1,
        hw_rental_id : req.body.rental_id
    };
    con.query(query1, dataset);
    // 운영자님에게 push 알림을 날린다.
}

function postponeHardware(con, req, res){
    var query1 = 'insert into t_hardware_waiting SET ?';
    var dataset = {
        hw_user : req.session.passport.user.id,
        hw_hardware_id : req.body.hardware_id,
        hw_request_date : getDate(new Date(), 0),
        hw_kind : 2,
        hw_rental_id : req.body.rental_id
    };
    con.query(query1, dataset);
    // 운영자님에게 push 알림을 날린다.
}
function deleteRequest(con, req, res){
    var query = 'delete from t_hardware_waiting where hw_id="' + req.body.waiting_id + '"';
    con.query(query);
}

function loadmyRequestedHardware(con, req, res){
    var query = 'select * from t_hardware a inner join t_hardware_waiting b on a.h_id=b.hw_hardware_id where hw_user="'+ req.session.passport.user.id +'"';
    con.query(query, function(err, response){
        res.send(response);
    });
}

function loadmyHardware(con, req, res){
    var query = 'select * from t_hardware a inner join t_hardware_rental b on a.h_id=b.hr_hardware_id where hr_user="'+ req.session.passport.user.id +'"';
    con.query(query, function(err, response){
        res.send(response);
    })
}

function loadmyappliedHardware(con, req, res){
    var query = 'select * from t_hardware_apply where ha_requester="' + req.session.passport.user.id + '"';
    con.query(query, function(err, response){
        res.send(response);
    });
}

function cancelmyApply(con, req, res){
    var query = 'delete from t_hardware_apply where ha_id="' + req.body.apply_id + '"';
    con.query(query);
}

function enrollHardware(con, req, res){
    var query = 'insert into t_hardware set ?';
    var queryData = {
        h_name : req.body.name,
        h_total : req.body.amount,
        h_serial : req.body.serial,
        h_remaining : req.body.amount
    };
    con.query(query, queryData);
}

function getDate(base, plusDate){
    var tempDate = new Date(base);
    tempDate.setDate(tempDate.getDate() + plusDate);
    var date = tempDate.getFullYear() + '/' + (tempDate.getMonth()+1) + '/' + (tempDate.getDate());
    return date;
}

exports.enrollHardware = enrollHardware;
exports.cancelmyApply = cancelmyApply;
exports.loadmyappliedHardware = loadmyappliedHardware;
exports.deleteRequest = deleteRequest;
exports.postponeHardware = postponeHardware;
exports.loadLender = loadLender;
exports.turnInHardware = turnInHardware;
exports.loadmyHardware = loadmyHardware;
exports.loadmyRequestedHardware = loadmyRequestedHardware;
exports.borrowHardware = borrowHardware;
exports.loadHardwarelist = loadHardwarelist;