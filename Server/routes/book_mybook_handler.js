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
    /*
        만약 예약자가 있다면, 그 예약자에게 책이 반납되었다는 push 알림을 보내준다.
        if(req.body.reserved_cnt > 0)   pushSubscriber(con, req.session.passport.user.id, req.body.book_id);
     */
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
    var query3 = 'delete from t_book_rental where br_id="' + req.body.rental_id + '"';
    con.query(query3);
    var query4 = 'delete from t_book_reserve where bre_book_id="' + req.body.book_id + '"';
    con.query(query4);
}

function cancelReservation(con, req, res){
    var query1 = 'update t_book set b_reserved_cnt=b_reserved_cnt-1 where b_id="' + req.body.book_id + '"';
    con.query(query1);
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
    var query = 'SELECT * FROM t_user a INNER JOIN t_book_reserve b ON a.u_id=b.bre_user where b.bre_book_id="' + book_id + '" and b.bre_myturn=1';
    con.query(query, function(err, rows, fields){
       // rows[0].u_token    이것이 예약 1순위자의 토큰. 이것을 이용해 푸시알림을 보내면되겠징???
    });
}

exports.missingBook = missingBook;
exports.cancelReservation = cancelReservation;
exports.postponeBook = postponeBook;
exports.turninBook = turninBook;
exports.loadAppliedBook = loadAppliedBook;
exports.loadReservedBook = loadReservedBook;
exports.loadBorrowedBook = loadBorrowedBook;
exports.cancelAppliedbook = cancelAppliedbook;