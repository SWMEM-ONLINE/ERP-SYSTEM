/**
 * Created by jung-inchul on 2015. 12. 7..
 */
function loadNormalHardware(con, req, res){
    var query = 'SELECT * FROM t_hardware where h_type=0';
    con.query(query, function(err, response){
        res.send(response);
    });
}

function loadSpecialHardware(con, req, res){
    var query = 'SELECT * FROM t_hardware where h_type=1';
    con.query(query, function(err, response){
        res.send(response);
    })
}

function borrowHardware(con, req, res){
    var query1 = 'INSERT into t_hardware_rental SET ?';
    var dataset = {
        hr_user : req.session.passport.user.id,
        hr_hardware_id : req.body.hardware_id,
        hr_rental_date : getDate(new Date(), 0),
        hr_due_date : getDate(new Date(), 14)
    };
    con.query(query1, dataset);
    var query2 = 'update t_hardware set h_remaining=h_remaining-1 where h_id="'+req.body.hardware_id+'"';
    con.query(query2);
}

function loadLender(con, req, res){
    var query = 'select * from t_user a join t_hardware_rental b on a.u_id=b.hr_user where b.hr_hardware_id="'+req.body.hardware_id+'"';
    con.query(query, function(err, response){
        res.send(response);
    });
}

function turnInHardware(con, req, res){
    var query1 = 'update t_hardware set h_remaining=h_remaining+1 where h_id="' + req.body.hardware_id + '"';
    con.query(query1);
    var query2 = 'insert into t_hardware_return SET ?';
    var dataset = {
        ht_user : req.session.passport.user.id,
        ht_hardware_id: req.body.hardware_id,
        ht_rental_date: req.body.rental_date,
        ht_return_date: getDate(new Date(), 0)
    };
    con.query(query2, dataset);
    var query3 = 'delete from t_hardware_rental where hr_id="' + req.body.rental_id + '"';
    con.query(query3);
}

function postponeHardware(con, req, res){
    console.log(req.body.due_date);
    var changed_date = getDate(req.body.due_date, 14);
    var query = 'update t_hardware_rental set hr_extension_cnt=hr_extension_cnt+1, hr_due_date="' + changed_date + '" where hr_id="' + req.body.rental_id + '"';
    con.query(query);
}

function loadMynormalHardware(con, req, res){
    var query = 'select * from t_hardware a join t_hardware_rental b on a.h_id=b.hr_hardware_id where a.h_type=0 and hr_user="'+ req.session.passport.user.id +'"';
    con.query(query, function(err, response){
        res.send(response);
    });
}

function loadMyspecialHardware(con, req, res){
    var query = 'select * from t_hardware a join t_hardware_rental b on a.h_id=b.hr_hardware_id where a.h_type=1 and hr_user="'+ req.session.passport.user.id +'"';
    con.query(query, function(err, response){
        res.send(response);
    })
}

function getDate(base, plus){
    var tempDate = new Date(base);
    tempDate.setDate(tempDate.getDate() + plus);
    var date = tempDate.getFullYear() + '/' + (tempDate.getMonth()+1) + '/' + (tempDate.getDate());
    return date;
}

exports.postponeHardware = postponeHardware;
exports.loadLender = loadLender;
exports.turnInHardware = turnInHardware;
exports.loadMynormalHardware = loadMynormalHardware;
exports.loadMyspecialHardware = loadMyspecialHardware;
exports.borrowHardware = borrowHardware;
exports.loadSpecialHardware = loadSpecialHardware;
exports.loadNormalHardware = loadNormalHardware;