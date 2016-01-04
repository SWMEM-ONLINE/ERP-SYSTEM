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
    var query1 = 'insert into t_hardware_waiting SET hw_user="' + req.session.passport.user.id + '", hw_hardware_id=' + req.body.hardware_id + ', hw_request_date="' + getDate(new Date(), 0) + '", hw_kind=0;';
    query1 += 'update t_hardware set h_remaining=h_remaining-1 where h_id="'+req.body.hardware_id+'"';
    //var dataset = {
    //    hw_user : req.session.passport.user.id,
    //    hw_hardware_id : req.body.hardware_id,
    //    hw_request_date : getDate(new Date(), 0),
    //    hw_kind : 0
    //};

    con.query(query, function(err, response){
        if(response[0].h_remaining > 0){                // If remaining.
            con.query(query1, function(err2, response2){
                if(err2){
                    res.send('failed');
                    throw err2
                }
                res.send('success');
            });
            // 운영자님에게 push 알림을 날린다.
        }else{                                          // nothing there.
            res.send('failed');
        }
    });
}

function loadLender(con, req, res){
    var query = 'select * from t_hardware_rental a inner join t_user b on a.hr_user=b.u_id where a.hr_hardware_id="'+req.body.hardware_id+'"';
    con.query(query, function(err, response){
        res.send(response);
    });
}

function turnInHardware(con, req, res){
    var query = 'select * from t_hardware_waiting where hw_rental_id="' + req.body.rental_id + '"';
    con.query(query, function(err1, response1){
        if(response1.length === 0){
            var query1 = 'insert into t_hardware_waiting SET ?';
            var dataset = {
                hw_user : req.session.passport.user.id,
                hw_hardware_id: req.body.hardware_id,
                hw_request_date: getDate(new Date(), 0),
                hw_kind : 2,
                hw_rental_id : req.body.rental_id
            };
            con.query(query1, dataset, function(err2, response2){
                if(err2){
                    res.send('failed_2');
                    throw err2
                }
                res.send('success');
            });
        }else{
            res.send('failed_1');
        }
    });

    // 운영자님에게 push 알림을 날린다.
}

function postponeHardware(con, req, res){
    var query = 'select * from t_hardware_waiting where hw_rental_id="' + req.body.rental_id + '"';
    con.query(query, function(err1, response1){
        if(response1.length === 0){
            var query1 = 'insert into t_hardware_waiting SET ?';
            var dataset = {
                hw_user : req.session.passport.user.id,
                hw_hardware_id : req.body.hardware_id,
                hw_request_date : getDate(new Date(), 0),
                hw_kind : 1,
                hw_rental_id : req.body.rental_id
            };
            con.query(query1, dataset, function(err, response){
                if(err){
                    res.send('failed_2');
                    throw err
                }
                res.send('success');
                // 운영자님에게 push 알림을 날린다.
            });
        }else{
            res.send('failed_1');
        }
    });
}
function deleteRequest(con, req, res){
    var query = 'delete from t_hardware_waiting where hw_id="' + req.body.waiting_id + '";';
    query += 'update t_hardware set h_remaining=h_remaining+1 where h_id="' + req.body.hardware_id + '"';
    con.query(query, function(err, response){
        if(err){
            res.send('failed');
            throw err
        }
        res.send('success');
    });
}

function loadmyRequestedHardware(con, req, res){
    var query = 'select * from t_hardware_waiting a inner join t_hardware b on a.hw_hardware_id=b.h_id where a.hw_user="'+ req.session.passport.user.id +'"';
    con.query(query, function(err, response){
        res.send(response);
    });
}

function loadmyHardware(con, req, res){
    var query = 'select * from t_hardware_rental a inner join t_hardware b on a.hr_hardware_id=b.h_id where a.hr_user="'+ req.session.passport.user.id +'"';
    con.query(query, function(err, response){
        res.send(response);
    })
}

function loadmyappliedHardware(con, req, res){
    var query = 'select *, b.u_name from t_hardware_apply a inner join t_user b on a.ha_requester=b.u_id where a.ha_requester="' + req.session.passport.user.id + '"';
    con.query(query, function(err, response){
        res.send(response);
    });
}

function cancelmyApply(con, req, res){
    var query = 'delete from t_hardware_apply where ha_id="' + req.body.apply_id + '"';
    con.query(query, function(err, response){
        if(err){
            res.send('failed');
            throw err
        }
        res.send('success');
    });
}

function enrollHardware(con, req, res){
    var query = '';
    for(var i = 0; i < req.body.length; i++){
        query += 'insert into t_hardware set h_name="' + req.body[i].name + '", h_total=' + req.body[i].amount + ', h_remaining=' + req.body[i].amount + ', h_serial="' + req.body[i].serial + '";';
        //var item = {
        //    h_name : req.body[i].name,
        //    h_total : req.body[i].amount,
        //    h_remaining : req.body[i].amount,
        //    h_serial : req.body[i].serial
        //};
    }

    console.log(query);
    con.query(query, function(err, response){
        if(err){
            res.send('failed');
            throw err
        }
        res.send('success');
    });
}

function alterHardware(con, req, res){
    var query = 'update t_hardware set h_name="' + req.body.name + '", h_total=' + req.body.total + ', h_remaining=' + req.body.remaining + ', h_serial="' + req.body.serial + '" where h_id=' + req.body.id;
    con.query(query, function(err, response){
        if(err){
            res.send('failed');
            throw err;
        }
        res.send('success');
    });
}

function deleteHardware(con, req, res){
    var query = 'delete from t_hardware where h_id="' + req.body.hardware_id + '"';
    con.query(query, function(err, response){
        if(err){
            res.send('failed');
            throw err;
        }
        res.send('success');
    })
}

function loadNow(con, req, res){
    var query = 'select * from t_hardware_rental a inner join t_hardware b on a.hr_hardware_id=b.h_id inner join t_user c on a.hr_user=c.u_id';
    con.query(query, function(err, response){
        if(err)
            res.send('failed');
        res.send(response);
    });
}

function loadPast(con, req, res){
    var query = 'select * from t_hardware a inner join t_hardware_return b on a.h_id=b.ht_hardware_id inner join t_user c on b.ht_user=c.u_id';
    con.query(query, function(err, response){
        if(err){
            res.send('failed');
            throw err
        }
        res.send(response);
    });
}

function loadRequest(con, req, res){
    var query = 'select * from t_hardware_waiting a inner join t_hardware b on a.hw_hardware_id=b.h_id inner join t_user c on a.hw_user=c.u_id where a.hw_kind=' + req.body.kind;
    con.query(query, function(err, response){
        if(err){
            res.send('failed');
            throw err
        }
        res.send(response);
    });
}

function loadApply(con, req, res){
    var query = 'select *, b.u_name from t_hardware_apply a inner join t_user b on a.ha_requester=b.u_id';
    con.query(query, function(err, response){
       res.send(response);
    });
}

function approveRequest(con, req, res){
    if(req.body.type != 3){
        var today = getDate(new Date(), 0);
        var due_date = getDate(new Date(), 30);

        var approveIdlist = req.body.approveIdlist;

        var query = 'update t_hardware_waiting set hw_result=1 where hw_id IN (';
        query += approveIdlist + ')';
        con.query(query);

        approveIdlist = approveIdlist.split(',');
        var userIdlist = (req.body.userIdlist).split(',');
        var hardwareIdlist = (req.body.hardwareIdlist).split(',');

        var count = approveIdlist.length;

        switch(parseInt(req.body.type)){
            case 0:         // # 대여
                var query_borrow = '';
                for(var i = 0; i < count; i++){
                    query_borrow += 'insert into t_hardware_rental set hr_user="' + userIdlist[i] + '", hr_hardware_id='+parseInt(hardwareIdlist[i])+', hr_rental_date="' + today + '", hr_due_date="' + due_date + '";';
                }
                con.query(query_borrow);
                break;
            case 1:         // # 대여연장
                var query_postpone = '';
                var rentalIdlist = (req.body.rentalIdlist).split(',');
                for(var j = 0; j < count; j++){
                    query_postpone += 'update t_hardware_rental set hr_extension_cnt=hr_extension_cnt+1, hr_due_date=ADDDATE(hr_due_date, 14) where hr_id=' + parseInt(rentalIdlist[j]) + ';';
                }
                con.query(query_postpone);
                break;
            case 2:         // # 반납
                var query_turnin1 = 'select * from t_hardware_rental where hr_id IN (' + req.body.rentalIdlist + ')';
                con.query(query_turnin1, function(err, response){
                    var query_turnin2 = '';
                    for(var i = 0; i < response.length; i++){
                        query_turnin2 += 'insert into t_hardware_return set ht_user="' + response[i].hr_user + '", ht_hardware_id="' + response[i].hr_hardware_id + '", ht_return_date="' + today + '", ht_rental_date="' + response[i].hr_rental_date + '";';
                    }
                    query_turnin2 += 'update t_hardware set h_remaining=h_remaining+1 where h_id IN (' + req.body.hardwareIdlist + ');';
                    query_turnin2 += 'delete from t_hardware_rental where hr_id IN (' + req.body.rentalIdlist + ')';
                    con.query(query_turnin2)
                });
                break;
            default:        // # 새로 신청
        }
        res.send('success');
    }else{
        var query_improveApply = 'update t_hardware_apply set ha_result=1 where ha_id IN (' + req.body.approveIdlist + ')';
        con.query(query_improveApply, function(err, response){
            if(err){
                res.send('failed');
                throw err
            }
            res.send('success');
        });
    }
}

function rejectRequest(con, req, res){
    if(req.body.type != 3){
        var query = 'update t_hardware_waiting set hw_result=2 where hw_id IN (';
        query += req.body.rejectlist + ')';
        con.query(query, function(err, response){
            if(err){
                res.send('failed');
                throw err;
            }
            res.send('success');
        });
    }else{
        var query_rejectApply = 'update t_hardware_apply set ha_result=2 where ha_id IN (' + req.body.rejectlist + ')';
        con.query(query_rejectApply, function(err, response){
            if(err){
                res.send('failed');
                throw err
            }
            res.send('success');
        });
    }
}

function getDate(base, plusDate){
    var tempDate = new Date(base);
    tempDate.setDate(tempDate.getDate() + plusDate);
    var date = tempDate.getFullYear() + '/' + (tempDate.getMonth()+1) + '/' + (tempDate.getDate());
    return date;
}

exports.loadApply = loadApply;
exports.approveRequest = approveRequest;
exports.rejectRequest = rejectRequest;
exports.loadRequest = loadRequest;
exports.loadNow = loadNow;
exports.loadPast = loadPast;
exports.deleteHardware = deleteHardware;
exports.alterHardware = alterHardware;
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