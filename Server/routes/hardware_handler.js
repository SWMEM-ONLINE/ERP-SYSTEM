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
        hr_rental_date : getDate(0),
        hr_due_date : getDate(14)
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

}

function loadMynormalHardware(con, req, res){
    var query = 'select * from t_hardware a join t_hardware_rental b on a.h_id=b.hr_hardware_id where a.h_type=0 and hr_user="'+ req.session.passport.user.id +'"';
    con.query(query, function(err, response){
        res.send(response);
    });
}

function loadMyspecialHardware(con, req, res){
    var query = 'SELECT * FROM t_hardware where kind=1';
    con.query(query, function(err, response){
        res.send(response);
    })
}

function getDate(plus){
    var tempDate = new Date();
    var date = tempDate.getFullYear() + '/' + (tempDate.getMonth()+1) + '/' + (tempDate.getDate()+plus);
    return date;
}

exports.loadLender = loadLender;
exports.turnInHardware = turnInHardware;
exports.loadMynormalHardware = loadMynormalHardware;
exports.loadMyspecialHardware = loadMyspecialHardware;
exports.borrowHardware = borrowHardware;
exports.loadSpecialHardware = loadSpecialHardware;
exports.loadNormalHardware = loadNormalHardware;