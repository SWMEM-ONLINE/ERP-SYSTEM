/**
 * Created by jung-inchul on 2015. 11. 26..
 */

/*
    Load new tech or humanities booklist. Send one select query and return data.
    * b_state
     0 : Waiting State
     1 : Someone borrowed
     3 : Missed State

    * b_new
     0 : Already exists
     1 : Newest book

    * b_type
     0 : Tech book
     1 : Humanities book
 */

function loadNewTechbook(con, res){
    var query = 'select * from t_book where b_new=1 and b_type=0 and not (b_state=3)';
    con.query(query, function(err, response){
        res.send(response);
    });
}

function loadNewHumanitiesbook(con, res){
    var query = 'select * from t_book where b_new=1 and b_type=1 and not (b_state=3)';
    con.query(query, function(err, response){
        res.send(response);
    });
}

/*
    Borrow book process.
    * req.session.passport.user.id : user's id
    - select query to t_user : search username using user's id.
    - update query to t_book : change state to 1, due_date, rental_username.
    - insert query to t_book_rental : insert rental data
 */
function borrowBook(con, req, res){
    var today = getDate(new Date(), 0);
    var due_date = getDate(new Date(), 14);

    var query = 'select * from t_book_rental where br_book_id="' + req.body.book_id + '"';
    con.query(query, function(err, response1) {
        if (response1.length === 0) {
            var query1 = 'select u_name from t_user where u_id="' + req.session.passport.user.id + '"';
            var query3 = 'insert into t_book_rental SET ?';
            var queryData = {
                br_user: req.session.passport.user.id,
                br_book_id: req.body.book_id,
                br_rental_date: today
            };
            con.query(query1, function (err, response2) {
                var query2 = 'update t_book set b_state=1, b_due_date="' + due_date + '", b_rental_username="' + response2[0].u_name + '" where b_id="' + req.body.book_id + '"';
                con.query(query2);
            });
            con.query(query3, queryData);
            res.send('success');
        } else {
            res.send('failed');
        }
    });
}

/*
    Search Book Process
 */
function searchBook(con, req, res){
    var query = 'select * from t_book where ' + req.body.category + ' like "%' + req.body.searchWords + '%" and not (b_state=3)';
    if(req.body.flag === 'tech')    query += 'and b_type=0';
    else    query += 'and b_type=1';
    con.query(query, function(err, response){
        res.send(response);
    });
}

/*
    Enroll missing booklist.
    - update query to t_book : change status 3
    - update query to t_book : change b_total
    - insert query to t_book_loss
    - delete query to t_book_rental
    - delete query to t_book_reserve
 */

function missingBook(con, req, res){
    var today = getDate(new Date(), 0);
    var query = 'UPDATE t_book set b_state=3 where b_id="' + req.body.book_id +'"';
    var query1 = 'update t_book set b_total=b_total-1 where b_isbn="' + req.body.isbn + '"';
    var query2 = 'insert into t_book_loss SET ?';
    var query3 = 'delete from t_book_rental where br_book_id="' + req.body.book_id + '"';
    var query4 = 'delete from t_book_reserve where bre_book_id="' + req.body.book_id + '"';
    var queryData = {
        brl_user : req.session.passport.user.id,
        brl_book_id : req.body.book_id,
        brl_loss_date : today
    };
    con.query(query);
    con.query(query1);
    con.query(query2, queryData);
    con.query(query3);
    con.query(query4);
}

/*
    Reserve book process
    - select query to t_book_rental UNION t_book_reserve : search who already rental or reserve this book
    - insert query to t_book_reserve
    - update query to t_book : increase reserved_cnt
 */

function reserveBook(con, req, res){
    var today = getDate(new Date(), 0);
    var query = 'select br_user from t_book_rental where br_user="' + req.session.passport.user.id+'" and br_book_id="' + req.body.book_id + '"UNION select bre_user from t_book_reserve where bre_user="' + req.session.passport.user.id + '" and bre_book_id="' + req.body.book_id + '"';
    var query1 = 'insert into t_book_reserve SET ?';
    var query2 = 'update t_book set b_reserved_cnt=b_reserved_cnt+1 where b_id="' + req.body.book_id + '"';
    var queryData = {
        bre_user : req.session.passport.user.id,
        bre_book_id : req.body.book_id,
        bre_myturn : parseInt(req.body.reserve_cnt) + 1,
        bre_reserve_date : today
    };

    con.query(query, function(err, rows, fields){
        if(rows.length != 0){
            res.send('failed');
        }else{
            con.query(query1, queryData);
            con.query(query2);
        }
    });
}

function loadnowHistory(con, req, res){
    var query = 'select * from t_book_rental a inner join t_book b on a.br_book_id=b.b_id inner join t_user c on a.br_user=c.u_id';
    con.query(query, function(err, response){
        if(err)
            res.send('failed');
        res.send(response);
    });
}

function loadpastHistory(con, req, res){
    var query = 'select * from t_book a inner join t_book_return b on a.b_id=b.brt_book_id inner join t_user c on b.brt_user=c.u_id';
    con.query(query, function(err, response){
        if(err){
            res.send('failed');
            throw err
        }
        res.send(response);
    });
}

function loadmissingBook(con, req, res){
    var query = 'select * from t_book_loss a inner join t_book b on a.brl_book_id=b.b_id inner join t_user c on a.brl_user=c.u_id';
    con.query(query, function(err, response){
        if(err){
            res.send('failed');
            throw err
        }
        res.send(response);
    });
}

function getDate(base, plusDate){
    var tempDate = new Date(base);
    tempDate.setDate(tempDate.getDate() + plusDate);
    var date = tempDate.getFullYear() + '/' + (tempDate.getMonth()+1) + '/' + tempDate.getDate();
    return date;
}

exports.loadmissingBook = loadmissingBook;
exports.loadpastHistory = loadpastHistory;
exports.loadnowHistory = loadnowHistory;
exports.loadNewTechbook = loadNewTechbook;
exports.loadNewHumanitiesbook = loadNewHumanitiesbook;
exports.borrowBook = borrowBook;
exports.missingBook = missingBook;
exports.reserveBook = reserveBook;
exports.searchBook = searchBook;