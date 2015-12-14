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
    var today = getDate(new Date(), 0);
    var query1 = 'insert into t_book_return SET ? ';
    var query2 = 'update t_book set b_state=0, b_due_date=null, b_rental_username=null where b_id="' + req.body.book_id + '"';
    var query3 = 'delete from t_book_rental where br_id="' + req.body.rental_id + '"';
    var data = {
        brt_user : req.session.passport.user.id,
        brt_book_id : req.body.book_id,
        brt_return_date : today,
        brt_rental_date : req.body.rental_date
    };

    con.query(query1, data);
    con.query(query2);
    con.query(query3);

    /*
        반납일을 넘겼을 경우 자동 벌당직 부여하는곳.
        if(req.body.due_date < today)   imposeBadduty(con, req.session.passport.user.id, req.body.over);
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
    var queryData = {
        brl_user : req.session.passport.user.id,
        brl_book_id : req.body.book_id,
        brl_loss_date : req.body.loss_date
    };
    var query2 = 'update t_book set b_state=3 where b_id="' + req.body.book_id +'"';
    var query5 = 'update t_book set b_total=b_total-1 where b_isbn="' + req.body.isbn + '"';
    var query3 = 'delete from t_book_rental where br_id="' + req.body.rental_id + '"';
    var query4 = 'delete from t_book_reserve where bre_book_id="' + req.body.book_id + '"';

    con.query(query1, queryData);
    con.query(query2);
    con.query(query5);
    con.query(query3);
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
    var query3 = 'delete from t_book_reserve where bre_id="' + req.body.reserve_id + '"';

    con.query(query2);
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
    var due_date = getDate(new Date(), 14);
    var query1 = 'select * FROM t_user a INNER JOIN t_book_reserve b ON a.u_id=b.bre_user where b.bre_book_id="' + book_id + '" and b.bre_myturn=1';
    con.query(query1, function(err, response){
        // response[0].u_token 여기로 푸쉬알림을 보낸다.
        var query2 = 'update t_book set b_state=1, b_due_date="' + due_date + '", b_rental_username="' + response[0].u_name + '", b_reserved_cnt=b_reserved_cnt-1 where b_id="' + book_id + '"';
        con.query(query2);
        var query3 = 'insert into t_book_rental SET ?';
        var queryData = {
            br_user: response[0].u_id,
            br_book_id: book_id,
            br_rental_date: getDate(new Date(), 0)
        };
        con.query(query3, queryData);
    });
    var query4 = 'update t_book_reserve set bre_myturn=bre_myturn-1 where bre_book_id="' + book_id + '"';
    con.query(query4);
    var query5 = 'delete from t_book_reserve where bre_myturn=0 and bre_book_id="' + book_id + '"';
    con.query(query5);
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