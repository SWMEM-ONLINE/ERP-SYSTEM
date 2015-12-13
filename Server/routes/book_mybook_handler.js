/**
 * Created by jung-inchul on 2015. 12. 4..
 */

function loadBorrowedBook(con, req, res){
    var query = 'SELECT * FROM t_book a INNER JOIN t_book_rental b ON a.b_id=b.br_book_id where b.br_user="' + req.session.passport.user.id + '"';
    con.query(query, function(err, response){
        res.send(response);
    });
}

function loadReservedBook(con, req, res){
    var query = 'SELECT * FROM t_book a INNER JOIN t_book_reserve b ON a.b_id=b.bre_book_id where b.bre_user="' + req.session.passport.user.id + '"';
    con.query(query, function(err, response){
        res.send(response);
    });
}

function loadAppliedBook(con, req, res){
    var query = 'SELECT * FROM t_book_apply where ba_user="' + req.session.passport.user.id + '"';
    con.query(query, function(err, response){
        res.send(response);
    });
}

function turninBook(con, req, res){
    var query1 = 'insert into t_book_return SET ? ';
    var data = {
        brt_user : req.session.passport.user.id,
        brt_book_id : req.body.book_id,
        brt_return_date : req.body.return_date,
        brt_rental_date : req.body.rental_date
    };
    con.query(query1, data);
    var query2 = 'update t_book set b_state=0, b_due_date=null, b_rental_username=null where b_id="' + req.body.book_id + '"';
    con.query(query2);
    var query3 = 'delete from t_book_rental where br_id="' + req.body.rental_id + '"';
    con.query(query3);

    /*
        반납일을 넘겼을 경우 자동 벌당직 부여하는곳.
        if(req.body.over > 0)   imposeBadduty(con, req.session.passport.user.id, req.body.over);
     */
    if(req.body.reserved_cnt > 0)   push2Subscriber(con, req.session.passport.user.id, req.body.book_id);

}

function postponeBook(con, req, res){
    var query1 = 'update t_book_rental set br_extension_cnt=br_extension_cnt+1 where br_id=' + req.body.rental_id;
    var query2 = 'update t_book set b_due_date="' + req.body.changed_due_date + '" where b_id="' + req.body.book_id + '"';
    con.query(query1);
    con.query(query2);
}

function missingBook(con, req, res){
    var query1 = 'insert into t_book_loss SET ?';
    var data = {
        brl_user : req.session.passport.user.id,
        brl_book_id : req.body.book_id,
        brl_loss_date : req.body.loss_date
    };
    con.query(query1, data);
    var query2 = 'update t_book set b_state=3 where b_id="' + req.body.book_id +'"';
    con.query(query2);
    var query5 = 'update t_book set b_total=b_total-1 where b_isbn="' + req.body.isbn + '"';
    con.query(query5);
    var query3 = 'delete from t_book_rental where br_id="' + req.body.rental_id + '"';
    con.query(query3);
    var query4 = 'delete from t_book_reserve where bre_book_id="' + req.body.book_id + '"';
    con.query(query4);
}

function cancelReservation(con, req, res){
    if(req.body.reserved_cnt > 1){
        var query = 'select bre_myturn from t_book_reserve where bre_id="' + req.body.reserve_id + '"';
        con.query(query, function(err, response){
            var query1 = 'update t_book_reserve set bre_myturn=bre_myturn-1 where bre_myturn>'+ response[0].bre_myturn;
            con.query(query1);
        });
    }
    var query2 = 'update t_book set b_reserved_cnt=b_reserved_cnt-1 where b_id="' + req.body.book_id + '"';
    con.query(query2);
    var query3 = 'delete from t_book_reserve where bre_id="' + req.body.reserve_id + '"';
    con.query(query3);
}

function cancelAppliedbook(con, req, res){
    var query = 'delete from t_book_apply where ba_id="' + req.body.apply_id + '"';
    con.query(query);
}

function imposeBadduty(con, userId, overtime){
    var query = 'update t_user set u_bad_duty_point=u_bad_duty_point+' + overtime + 'where u_id="' + userId + '"';
    con.query(query);
}

function push2Subscriber(con, userId, book_id){
    var today = getDate(0);
    var due_date = getDate(14);
    var query1 = 'SELECT * FROM t_user a INNER JOIN t_book_reserve b ON a.u_id=b.bre_user where b.bre_book_id="' + book_id + '" and b.bre_myturn=1';
    con.query(query1, function(err, response){
        // response[0].u_token 여기로 푸쉬알림을 보낸다.
        var query2 = 'UPDATE t_book set b_state=1, b_due_date="' + due_date + '", b_rental_username="' + response[0].u_name + '", b_reserved_cnt=b_reserved_cnt-1 where b_id="' + book_id + '"';
        con.query(query2);
        var query4 = 'insert into t_book_rental SET ?';
        var queryData = {
            br_user: response[0].u_id,
            br_book_id: book_id,
            br_rental_date: today
        };
        con.query(query4, queryData);
    });
    var query3 = 'update t_book_reserve set bre_myturn=bre_myturn-1 where bre_book_id="' + book_id + '"';
    con.query(query3);
    // 여기까지가 예약자에 대한 처리 아래부터 예약자를 대여자로 바꾸는 처리.
    //var query4 = 'SELECT u_name from t_user where u_id="' + userId + '"';
    //con.query(query4, function(err, rows, fields){
    //    var query5 = 'UPDATE t_book set b_state=1, b_due_date="' + due_date + '", b_rental_username="' + rows[0].u_name + '", b_reserved_cnt=b_reserved_cnt-1 where b_id="' + book_id + '"';
    //    con.query(query5);
    //});
    var query5 = 'delete from t_book_reserve where bre_myturn=0 and bre_book_id="' + book_id + '"';
    con.query(query5);
}

function getDate(plus){
    var date = new Date();
    date.setHours(9);
    var result = date.getFullYear()+ '-'+(date.getMonth()+1)+'-'+(date.getDate()+plus);
    return result;
}

exports.missingBook = missingBook;
exports.cancelReservation = cancelReservation;
exports.postponeBook = postponeBook;
exports.turninBook = turninBook;
exports.loadAppliedBook = loadAppliedBook;
exports.loadReservedBook = loadReservedBook;
exports.loadBorrowedBook = loadBorrowedBook;
exports.cancelAppliedbook = cancelAppliedbook;