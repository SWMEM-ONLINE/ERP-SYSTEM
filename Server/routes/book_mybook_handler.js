/**
 * Created by jung-inchul on 2015. 12. 4..
 */

var util = require('./util');
var DB_handler = require('./DB_handler');

function loadBorrowedBook(req, res){
    var con = DB_handler.connectDB();
    var query = 'SELECT *, DATEDIFF(CURDATE(), a.b_due_date) diff FROM t_book a INNER JOIN t_book_rental b ON a.b_id=b.br_book_id where b.br_user="' + req.session.passport.user.id + '"';
    con.query(query, function(err, response){
        if(err){
            console.log('DB select ERROR "book_mybook_handler.js -> loadBorrowedBook');
            DB_handler.disconnectDB(con);
            res.send('failed');
        }else{
            res.send(response);
            DB_handler.disconnectDB(con);
        }
    });
}

function loadReservedBook(req, res){
    var con = DB_handler.connectDB();
    var query = 'SELECT * FROM t_book a INNER JOIN t_book_reserve b ON a.b_id=b.bre_book_id where b.bre_user="' + req.session.passport.user.id + '"';
    con.query(query, function(err, response){
        if(err){
            console.log('DB select ERROR "book_mybook_handler.js -> loadReservedBook');
            DB_handler.disconnectDB(con);
            res.send('failed');
        }else{
            res.send(response);
            DB_handler.disconnectDB(con);
        }
    });
}

function loadAppliedBook(req, res){
    var con = DB_handler.connectDB();
    var query = 'SELECT * FROM t_book_apply where ba_user="' + req.session.passport.user.id + '"';
    con.query(query, function(err, response){
        if(err){
            console.log('DB select ERROR "book_mybook_handler.js -> loadAppliedBook');
            DB_handler.disconnectDB(con);
            res.send('failed');
        }else{
            res.send(response);
            DB_handler.disconnectDB(con);
        }
    });
}

function turninBook(req, res){
    var con = DB_handler.connectDB();
    var today = getDate(new Date(), 0);
    var query = 'insert into t_book_return SET brt_user="' + req.session.passport.user.id + '", brt_book_id=' + req.body.book_id + ', brt_rental_date="' + req.body.rental_date + '", brt_return_date="' + today + '";';
    query += 'update t_book set b_state=0, b_due_date=null, b_rental_username=null where b_id="' + req.body.book_id + '";';
    query += 'delete from t_book_rental where br_id="' + req.body.rental_id + '";';
    query += 'select u_id from t_user where u_state=4';
    con.query(query, function(err, response){
        if(err){
            res.send('failed');
            console.log('DB query ERROR "book_mybook_handler.js -> turninBook');
            DB_handler.disconnectDB(con);
        }else{
            var due_date = new Date(req.body.due_date);
            var t = new Date(today);
            var diff = (t.getTime() - due_date.getTime()) / (1000 * 60 * 60 * 24);

            if(diff > 0){
                util.send(req.session.passport.user.id, '책 반납일 미준수', util.pushContents.b_turnin, function(err2, data){
                    if(err2){
                        console.log(err2);
                    }else{
                        console.log(data);
                    }
                });
                var query_imposeDuty = 'update t_user set u_bad_duty_point=u_bad_duty_point+' + diff + ' where u_id="' + req.session.passport.user.id + '";';
                query_imposeDuty += 'insert into t_duty_point_history SET date="' + today + '", receive_user="' + req.session.passport.user.id + '", send_user="' + response[3][0].u_id + '", mode=1, point=' + diff + ', reason="책 반납일 미준수"';
                con.query(query_imposeDuty, function(err3, response3){
                    if(err3){
                        res.send('failed');
                        console.log('DB query2 ERROR "book_mybook_handler.js -> turninBook');
                        DB_handler.disconnectDB(con);
                    }else{
                        res.send(diff);
                        DB_handler.disconnectDB(con);
                    }
                })
            }else{
                res.send('success');
                DB_handler.disconnectDB(con);
            }
        }
    });
    if(req.body.reserved_cnt > 0)   push2Subscriber(req.session.passport.user.id, req.body.book_id);
}

function postponeBook(req, res){
    var con = DB_handler.connectDB();
    var query = 'select * from t_book a inner join t_book_rental b on a.b_id=b.br_book_id where b.br_id="' + req.body.rental_id + '"';
    var query2 = 'update t_book_rental set br_extension_cnt=br_extension_cnt+1 where br_id=' + req.body.rental_id + ';';
    query2 += 'update t_book set b_due_date=ADDDATE(b_due_date, 14) where b_id="' + req.body.book_id + '"';
    con.query(query, function(err, response){
        if(err){
            console.log('DB select ERROR "book_mybook_handler.js -> postponeBook');
            DB_handler.disconnectDB(con);
            res.send('failed');
        }else{
            if(response[0].br_extenstion_cnt === 1 || response[0].b_reserved_cnt != 0){
                res.send('연장할 수 없습니다');
                DB_handler.disconnectDB(con);
            }else{
                con.query(query2, function(err2, response2){
                    if(err2){
                        res.send('failed');
                        console.log('DB update ERROR "book_mybook_handler.js -> postponeBook');
                        DB_handler.disconnectDB(con);
                    }else{
                        res.send('success');
                        DB_handler.disconnectDB(con);
                    }
                });
            }
        }
    });
}

function missingBook(req, res){
    var con = DB_handler.connectDB();
    var today = getDate(new Date(), 0);
    var query = 'insert into t_book_loss SET brl_user="' + req.session.passport.user.id + '", brl_book_id="' + req.body.book_id + '", brl_loss_date="' + today + '";';
    query += ' update t_book set b_state=3 where b_id="' + req.body.book_id +'";';
    query += ' delete from t_book_rental where br_book_id="' + req.body.book_id + '";';
    query += ' delete from t_book_reserve where bre_book_id="' + req.body.book_id + '";';
    con.query(query, function(err, response){
        if(err){
            res.send('failed');
            console.log('DB query ERROR "book_mybook_handler.js -> missingBook');
            DB_handler.disconnectDB(con);
        }else{
            res.send('success');
            DB_handler.disconnectDB(con);
        }
    });
}

function cancelReservation(req, res){
    var con = DB_handler.connectDB();
    if(req.body.reserved_cnt >= 1){
        var query = 'select bre_myturn from t_book_reserve where bre_id="' + req.body.reserve_id + '"';
        con.query(query, function(err, response){
            if(err){
                res.send('failed');
                console.log('DB select ERROR "book_mybook_handler.js -> cancelReservation');
                DB_handler.disconnectDB(con);
            }else{
                var query1 = 'update t_book_reserve set bre_myturn=bre_myturn-1 where bre_myturn>'+ response[0].bre_myturn + ';';
                query1 += 'update t_book set b_reserved_cnt=b_reserved_cnt-1 where b_id="' + req.body.book_id + '";';
                query1 += 'delete from t_book_reserve where bre_id="' + req.body.reserve_id + '"';
                con.query(query1, function(err2, response2){
                    if(err2){
                        res.send('failed');
                        console.log('DB query ERROR "book_mybook_handler.js -> cancelReservation');
                        DB_handler.disconnectDB(con);
                    }else{
                        res.send('success');
                        DB_handler.disconnectDB(con);
                    }
                });
            }
        });
    }
}

function cancelAppliedbook(req, res){
    var con = DB_handler.connectDB();
    var query = 'delete from t_book_apply where ba_id="' + req.body.apply_id + '"';
    con.query(query, function(err, response){
        if(err) {
            res.send('failed');
            console.log('DB query ERROR "book_mybook_handler.js -> cancelAppliedbook');
            DB_handler.disconnectDB(con);
        }else{
            res.send('success');
            DB_handler.disconnectDB(con);
        }
    });
}

function push2Subscriber(userId, book_id){
    var con = DB_handler.connectDB();
    var due_date = getDate(new Date(), 14);
    var query1 = 'select * FROM t_user a INNER JOIN t_book_reserve b ON a.u_id=b.bre_user where b.bre_book_id="' + book_id + '" and b.bre_myturn=1';
    con.query(query1, function(err, response){
        if(err){
            console.log('DB select ERROR "book_mybook_handler.js -> push2Subscriber');
            DB_handler.disconnectDB(con);
        }else{
            util.send(response[0].u_id, '대여 알림', util.pushContents.b_borrow, function(err_push, data){
                if(err_push){
                    console.log(err_push);
                }else{
                    console.log(data);
                }
            });
            var query2 = 'update t_book set b_state=1, b_due_date="' + due_date + '", b_rental_username="' + response[0].u_name + '", b_reserved_cnt=b_reserved_cnt-1 where b_id="' + book_id + '"';
            con.query(query2, function(err2, response2){
                if(err2){
                    console.log('DB update ERROR "book_mybook_handler.js -> push2Subscriber');
                    DB_handler.disconnectDB(con);
                }else{
                    var query3 = 'insert into t_book_rental SET ?';
                    var queryData = {
                        br_user: response[0].u_id,
                        br_book_id: book_id,
                        br_rental_date: getDate(new Date(), 0)
                    };
                    con.query(query3, queryData, function(err3, response3){
                        if(err3){
                            console.log('DB insert ERROR "book_mybook_handler.js -> push2Subscriber');
                            DB_handler.disconnectDB(con);
                        }
                    });
                }
            });
        }
    });
    var query4 = 'update t_book_reserve set bre_myturn=bre_myturn-1 where bre_book_id="' + book_id + '"';
    con.query(query4, function(err4, response4){
        if(err4){
            console.log('DB update ERROR "book_mybook_handler.js -> push2Subscriber');
            DB_handler.disconnectDB(con);
        }else{
            var query5 = 'delete from t_book_reserve where bre_myturn=0 and bre_book_id="' + book_id + '"';
            con.query(query5, function(err5, response5){
                if(err5){
                    console.log('DB delete ERROR "book_mybook_handler.js -> push2Subscriber');
                    DB_handler.disconnectDB(con);
                }else{
                    DB_handler.disconnectDB(con);
                }
            });
        }
    });
}

function getDate(base, plusDate){
    var tempDate = new Date(base);
    tempDate.setDate(tempDate.getDate() + plusDate);
    var date = tempDate.getFullYear() + '/' + (tempDate.getMonth()+1) + '/' + tempDate.getDate();
    return date;
}

exports.missingBook = missingBook;
exports.cancelReservation = cancelReservation;
exports.postponeBook = postponeBook;
exports.turninBook = turninBook;
exports.loadAppliedBook = loadAppliedBook;
exports.loadReservedBook = loadReservedBook;
exports.loadBorrowedBook = loadBorrowedBook;
exports.cancelAppliedbook = cancelAppliedbook;