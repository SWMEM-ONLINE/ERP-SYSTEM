/**
 * Created by jung-inchul on 2015. 12. 7..
 */
function loadNormalHardware(con, req, res){
    var query = 'SELECT * FROM t_hardware where kind=0';
    con.query(query, function(err, response){
        res.send(response);
    });
}

function loadSpecialHardware(con, req, res){
    var query = 'SELECT * FROM t_hardware where kind=1';
    con.query(query, function(err, response){
        res.send(response);
    })
}

function borrowHardware(con, req, res){
    var query = 'INSERT into t_hardware ';
    var kind = req.kind;
    // 하드웨어 대여 쿼리 부분 추가
    con.query(query, function(err, response){
        res.send(response);
    })
}

function loadMynormalHardware(con, req, res){
    var query = 'SELECT * FROM t_hardware where kind=0';
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

exports.loadMynormalHardware = loadMynormalHardware;
exports.loadMyspecialHardware = loadMyspecialHardware;
exports.borrowHardware = borrowHardware;
exports.loadSpecialHardware = loadSpecialHardware;
exports.loadNormalHardware = loadNormalHardware;