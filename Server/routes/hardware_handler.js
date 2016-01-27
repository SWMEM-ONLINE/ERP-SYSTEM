/**
 * Created by jung-inchul on 2015. 12. 7..
 */
var util = require('./util');
var DB_handler = require('./DB_handler');

function loadHardwarelist(req, res){
    var con = DB_handler.connectDB();
    var query = 'select * from t_hardware';
    con.query(query, function(err, response){
        res.send(response);
        DB_handler.disconnectDB(con);
    });
}

function borrowHardware(req, res){
    var con = DB_handler.connectDB();
    var query = 'select h_remaining from t_hardware where h_id="' + req.body.hardware_id + '"';
    var query1 = 'insert into t_hardware_waiting SET hw_user="' + req.session.passport.user.id + '", hw_hardware_id=' + req.body.hardware_id + ', hw_request_date="' + getDate(new Date(), 0) + '", hw_kind=0;';
    query1 += 'update t_hardware set h_remaining=h_remaining-1 where h_id="'+req.body.hardware_id+'"';
    con.query(query, function(err, response){
        if(response[0].h_remaining > 0){                // If remaining.
            con.query(query1, function(err2, response2){
                if(err2){
                    res.send('failed');
                    throw err2
                }
                var query2 = 'select u_id from t_user where u_state = 1';
                con.query(query2, function(err2, response2){

                    var manager_list = [];
                    for(var i = 0; i < response2.length; i++){
                        manager_list.push(response2[i].u_id);
                    }

                    util.sendList(manager_list, '하드웨어 대여신청', util.pushContents.h_requestBorrow, function(err_push, data){
                        if(err_push){
                            console.log(err_push);
                        }else{
                            console.log(data);
                        }
                    });
                    res.send('success');
                });
            });
        }else{                                          // nothing there.
            res.send('failed');
        }
        DB_handler.disconnectDB(con);
    });
}

function loadLender(req, res){
    var con = DB_handler.connectDB();
    var query = 'select * from t_hardware_rental a inner join t_user b on a.hr_user=b.u_id where a.hr_hardware_id="'+req.body.hardware_id+'"';
    con.query(query, function(err, response){
        res.send(response);
        DB_handler.disconnectDB(con);
    });
}

function turnInHardware(req, res){
    var con = DB_handler.connectDB();
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

                var query2 = 'select u_id from t_user where u_state = 1';
                con.query(query2, function(err3, response3){

                    var manager_list = [];
                    for(var i = 0; i < response3.length; i++){
                        manager_list.push(response3[i].u_id);
                    }

                    util.sendList(manager_list, '하드웨어 반납신청', util.pushContents.h_requestTurnin, function(err_push, data){
                        if(err_push){
                            console.log(err_push);
                        }else{
                            console.log(data);
                        }
                    });
                    res.send('success');
                });
            });
        }else{
            res.send('failed_1');
        }
        DB_handler.disconnectDB(con);
    });
}

function postponeHardware(req, res){
    var con = DB_handler.connectDB();
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

                var query2 = 'select u_id from t_user where u_state = 1';
                con.query(query2, function(err3, response3){

                    var manager_list = [];
                    for(var i = 0; i < response3.length; i++){
                        manager_list.push(response3[i].u_id);
                    }

                    util.sendList(manager_list, '하드웨어 연장신청', util.pushContents.h_requestPostpone, function(err_push, data){
                        if(err_push){
                            console.log(err_push);
                        }else{
                            console.log(data);
                        }
                    });
                    res.send('success');
                });
            });
        }else{
            res.send('failed_1');
        }
        DB_handler.disconnectDB(con);
    });
}

function loadmyRequestedHardware(req, res){
    var con = DB_handler.connectDB();
    var query = 'select * from t_hardware_waiting a inner join t_hardware b on a.hw_hardware_id=b.h_id where a.hw_user="'+ req.session.passport.user.id +'"';
    con.query(query, function(err, response){
        res.send(response);
        DB_handler.disconnectDB(con);
    });
}

function loadmyHardware(req, res){
    var con = DB_handler.connectDB();
    var query = 'select *, DATEDIFF(CURDATE(), a.hr_due_date) diff from t_hardware_rental a inner join t_hardware b on a.hr_hardware_id=b.h_id where a.hr_user="'+ req.session.passport.user.id +'"';
    con.query(query, function(err, response){
        res.send(response);
        DB_handler.disconnectDB(con);
    })
}

function loadmyappliedHardware(req, res){
    var con = DB_handler.connectDB();
    var query = 'select *, b.u_name from t_hardware_apply a inner join t_user b on a.ha_requester=b.u_id where a.ha_requester="' + req.session.passport.user.id + '"';
    con.query(query, function(err, response){
        res.send(response);
        DB_handler.disconnectDB(con);
    });
}

function deleteRequest(req, res){
    var con = DB_handler.connectDB();
    var query = 'delete from t_hardware_waiting where hw_id="' + req.body.waiting_id + '"';
    con.query(query, function(err, response){
        if(err){
            res.send('failed');
            throw err
        }
        res.send('success');
        DB_handler.disconnectDB(con);
    });
}

function cancelmyApply(req, res){
    var con = DB_handler.connectDB();
    var query = 'delete from t_hardware_apply where ha_id="' + req.body.apply_id + '"';
    con.query(query, function(err, response){
        if(err){
            res.send('failed');
            throw err
        }
        res.send('success');
        DB_handler.disconnectDB(con);
    });
}

function enrollHardware(req, res){
    var con = DB_handler.connectDB();
    var query = '';
    for(var i = 0; i < req.body.length; i++){
        query += 'insert into t_hardware set h_name="' + req.body[i].name + '", h_total=' + req.body[i].amount + ', h_remaining=' + req.body[i].amount + ', h_serial="' + req.body[i].serial + '";';
    }
    con.query(query, function(err, response){
        if(err){
            res.send('failed');
            throw err
        }
        res.send('success');
        DB_handler.disconnectDB(con);
    });
}

function alterHardware(req, res){
    var con = DB_handler.connectDB();
    var query = 'update t_hardware set h_name="' + req.body.name + '", h_total=' + req.body.total + ', h_remaining=' + req.body.remaining + ', h_serial="' + req.body.serial + '" where h_id=' + req.body.id;
    con.query(query, function(err, response){
        if(err){
            res.send('failed');
            throw err;
        }
        res.send('success');
        DB_handler.disconnectDB(con);
    });
}

function deleteHardware(req, res){
    var con = DB_handler.connectDB();
    var query = 'delete from t_hardware where h_id="' + req.body.hardware_id + '"';
    con.query(query, function(err, response){
        if(err){
            res.send('failed');
            throw err;
        }
        res.send('success');
        DB_handler.disconnectDB(con);
    })
}

function loadNow(req, res){
    var con = DB_handler.connectDB();
    var query = 'select * from t_hardware_rental a inner join t_hardware b on a.hr_hardware_id=b.h_id inner join t_user c on a.hr_user=c.u_id';
    con.query(query, function(err, response){
        if(err)
            res.send('failed');
        res.send(response);
        DB_handler.disconnectDB(con);
    });
}

function loadPast(req, res){
    var con = DB_handler.connectDB();
    var query = 'select * from t_hardware a inner join t_hardware_return b on a.h_id=b.ht_hardware_id inner join t_user c on b.ht_user=c.u_id';
    con.query(query, function(err, response){
        if(err){
            res.send('failed');
            throw err
        }
        res.send(response);
        DB_handler.disconnectDB(con);
    });
}

function loadRequest(req, res){
    var con = DB_handler.connectDB();
    var query = 'select * from t_hardware_waiting a inner join t_hardware b on a.hw_hardware_id=b.h_id inner join t_user c on a.hw_user=c.u_id where a.hw_kind=' + req.body.kind;
    con.query(query, function(err, response){
        if(err){
            res.send('failed');
            throw err
        }
        res.send(response);
        DB_handler.disconnectDB(con);
    });
}

function loadApply(req, res){
    var con = DB_handler.connectDB();
    var query = 'select *, b.u_name from t_hardware_apply a inner join t_user b on a.ha_requester=b.u_id';
    con.query(query, function(err, response){
       res.send(response);
        DB_handler.disconnectDB(con);
    });
}

function approveRequest(req, res){
    var con = DB_handler.connectDB();
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
                con.query(query_borrow, function(err, response){
                    if(err){
                        res.send('failed');
                        throw err
                    }
                    util.sendList(userIdlist, '하드웨어 대여승인', util.pushContents.h_approveBorrow, function(err_push, data){
                        if(err_push){
                            console.log(err_push);
                        }else{
                            console.log(data);
                        }
                    });
                    res.send('success');
                });
                break;
            case 1:         // # 대여연장
                var query_postpone = '';
                var rentalIdlist = (req.body.rentalIdlist).split(',');
                for(var j = 0; j < count; j++){
                    query_postpone += 'update t_hardware_rental set hr_extension_cnt=hr_extension_cnt+1, hr_due_date=ADDDATE(hr_due_date, 14) where hr_id=' + parseInt(rentalIdlist[j]) + ';';
                }
                con.query(query_postpone, function(err, response){
                    if(err){
                        res.send('failed');
                        throw err
                    }
                    util.sendList(userIdlist, '하드웨어 연장승인', util.pushContents.h_approvePostpone, function(err_push, data){
                        if(err_push){
                            console.log(err_push);
                        }else{
                            console.log(data);
                        }
                    });
                    res.send('success');
                });
                break;
            case 2:         // # 반납
                var query_turnin1 = 'select * from t_hardware_rental where hr_id IN (' + req.body.rentalIdlist + '); select u_id from t_user where u_state=1';
                con.query(query_turnin1, function(err, response){
                    var query_turnin2 = '';
                    for(var i = 0; i < response[0].length; i++){
                        var due_date = new Date(response[0][i].hr_due_date);
                        var t = new Date(today);
                        var diff = (t.getTime() - due_date.getTime()) / (1000 * 60 * 60 * 24);
                        if(diff > 0) {
                            query_turnin2 = 'update t_user set u_bad_duty_point=u_bad_duty_point+' + diff + ' where u_id="' + req.session.passport.user.id + '";';
                            query_turnin2 += 'insert into t_duty_point_history SET date="' + today + '", receive_user="' + response[0][i].hr_user + '", send_user="' + response[1][0].u_id + '", mode=2, point=' + diff + ', reason="하드웨어 반납일 미준수";';

                            util.send(response[0][i].hr_user, '하드웨어 반납일 미준수', util.pushContents.h_turnin, function(err_push, data){
                                if(err_push){
                                    console.log(err_push);
                                }else{
                                    console.log(data);
                                }
                            });
                        }
                        query_turnin2 += 'insert into t_hardware_return set ht_user="' + response[0][i].hr_user + '", ht_hardware_id="' + response[0][i].hr_hardware_id + '", ht_return_date="' + today + '", ht_rental_date="' + response[0][i].hr_rental_date + '";';
                    }
                    query_turnin2 += 'update t_hardware set h_remaining=h_remaining+1 where h_id IN (' + req.body.hardwareIdlist + ');';
                    query_turnin2 += 'delete from t_hardware_waiting where hw_id IN (' + req.body.approveIdlist + ');';
                    query_turnin2 += 'delete from t_hardware_rental where hr_id IN (' + req.body.rentalIdlist + ');';
                    con.query(query_turnin2, function(err2, response2){
                        if(err2){
                            res.send('failed');
                            throw err2
                        }
                        util.sendList(userIdlist, '하드웨어 반납승인', util.pushContents.h_approveTurnin, function(err_push, data){
                            if(err_push){
                                console.log(err_push);
                            }else{
                                console.log(data);
                            }
                        });
                        res.send('success');
                    });
                });
                break;
            default:        // # 새로 신청
        }
    }else{
        var userIdlist = (req.body.userIdlist).split(',');
        var query_improveApply = 'update t_hardware_apply set ha_result=1 where ha_id IN (' + req.body.approveIdlist + ')';
        con.query(query_improveApply, function(err, response){
            if(err){
                res.send('failed');
                throw err
            }
            util.sendList(userIdlist, '하드웨어 구매승인', util.pushContents.h_approveApply, function(err_push, data){
                if(err_push){
                    console.log(err_push);
                }else{
                    console.log(data);
                }
            });
            res.send('success');
        });
    }
    DB_handler.disconnectDB(con);
}

function rejectRequest(req, res){
    var con = DB_handler.connectDB();
    var temp = req.body.userIdlist;
    var userIdlist = temp.split(',');


    if(req.body.type != 3){
        var query = 'update t_hardware_waiting set hw_result=2 where hw_id IN (';
        query += req.body.rejectlist + ')';
        con.query(query, function(err, response){
            if(err){
                res.send('failed');
                throw err;
            }

            var title = '';
            var content = '';

            switch(parseInt(req.body.type)){
                case 0:         // 대여
                    title = '하드웨어 대여 거절';
                    content = util.pushContents.h_rejectBorrow;
                    break;
                case 1:         // 연장
                    title = '하드웨어 연장 거절';
                    content = util.pushContents.h_rejectPostpone;
                    break;
                default :       // 반납
                    title = '하드웨어 반납 거절';
                    content = util.pushContents.h_rejectTurnin;
            }
            util.sendList(userIdlist, title, content, function(err_push, data){
                if(err_push){
                    console.log(err_push);
                }else{
                    console.log(data);
                }
            });
            res.send('success');
        });
    }else{
        var query_rejectApply = 'update t_hardware_apply set ha_result=2 where ha_id IN (' + req.body.rejectlist + ')';
        con.query(query_rejectApply, function(err, response){
            if(err){
                res.send('failed');
                throw err
            }
            util.sendList(userIdlist, '하드웨어 구매거절', util.pushContents.h_rejectApply, function(err_push, data){
                if(err_push){
                    console.log(err_push);
                }else{
                    console.log(data);
                }
            });
            res.send('success');
        });
    }
    DB_handler.disconnectDB(con);
}

function getDate(base, plusDate){
    var tempDate = new Date(base);
    tempDate.setDate(tempDate.getDate() + plusDate);
    var date = tempDate.getFullYear() + '/' + (tempDate.getMonth()+1) + '/' + (tempDate.getDate());
    return date;
}

exports.deleteRequest = deleteRequest;
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
exports.postponeHardware = postponeHardware;
exports.loadLender = loadLender;
exports.turnInHardware = turnInHardware;
exports.loadmyHardware = loadmyHardware;
exports.loadmyRequestedHardware = loadmyRequestedHardware;
exports.borrowHardware = borrowHardware;
exports.loadHardwarelist = loadHardwarelist;