/**
 * Created by jung-inchul on 2015. 11. 26..
 */

function loadNewTechbook(con, res){
    var query = 'SELECT * FROM t_book where b_new=1 and b_type=0 and not (b_state=3)';
    con.query(query, function(err, response){
        res.send(response);
    });
}

function loadNewHumanitiesbook(con, res){
    var query = 'SELECT * FROM t_book where b_new=1 and b_type=1 and not (b_state=3)';
    con.query(query, function(err, response){
        res.send(response);
    });
}

function borrowBook(con, req, res){                       // 도서 대여 등록하기
    var query = 'select * from t_book_rental where br_book_id="' + req.body.book_id + '"';
    con.query(query, function(err, response){
        if(response.length === 0){
            var query1 = 'SELECT u_name from t_user where u_id="' + req.session.passport.user.id + '"';
            con.query(query1, function(err, rows, fields){
                var query2 = 'UPDATE t_book set b_state=1, b_due_date="' + req.body.due_date + '", b_rental_username="' + rows[0].u_name + '" where b_id="' + req.body.book_id + '"';
                con.query(query2);
            });
            var query3 = 'insert into t_book_rental SET ?';
            var queryData = {
                br_user: req.session.passport.user.id,
                br_book_id: req.body.book_id,
                br_rental_date: req.body.rental_date
            };
            con.query(query3, queryData);
        }else{
            res.send('이미 대여중인 책입니다!');
        }
    });
}

function searchBook(con, req, res){
    var query = 'SELECT * FROM t_book WHERE ' + req.body.category + ' like "%' + req.body.searchword + '%" and not (b_state=3)';
    if(req.body.flag === 'tech'){
        query += 'and b_type=0';
    }else{
        query += 'and b_type=1';
    }
    con.query(query, function(err, response){
        res.send(response);
    });
}

function missingBook(con, req, res){                       // 읽어버린 도서 등록
    var query = 'UPDATE t_book set b_state=3 where b_id="' + req.body.book_id +'"';
    con.query(query);
    var query2 = 'insert into t_book_loss SET ?';
    var data = {
        brl_user : req.session.passport.user.id,
        brl_book_id : req.body.book_id,
        brl_loss_date : req.body.loss_date
    };
    con.query(query2, data);
    var query3 = 'delete from t_book_rental where br_id="' + req.body.rental_id + '"';
    con.query(query3);
    var query4 = 'delete from t_book_reserve where bre_book_id="' + req.body.book_id + '"';
    con.query(query4);
}

function reserveBook(con, req, res){                    // 도서 예약하기
    var query = 'select br_user from t_book_rental where br_user="'+req.session.passport.user.id+'" UNION select bre_user from t_book_reserve where bre_user="' + req.session.passport.user.id + '"';
    con.query(query, function(err, rows, fields){
        if(rows.length != 0){
            res.send('failed');
        }else{
            var query1 = 'insert into t_book_reserve SET ?';
            var data = {
                bre_user : req.session.passport.user.id,
                bre_book_id : req.body.book_id,
                bre_myturn : parseInt(req.body.reserve_cnt) + 1,
                bre_reserve_date : req.body.reserve_date
            };
            con.query(query1, data);
            var query2 = 'UPDATE t_book set b_reserved_cnt=b_reserved_cnt+1 where b_id="' + req.body.book_id + '"';
            con.query(query2);
        }
    });
}

exports.loadNewTechbook = loadNewTechbook;
exports.loadNewHumanitiesbook = loadNewHumanitiesbook;
exports.borrowBook = borrowBook;
exports.missingBook = missingBook;
exports.reserveBook = reserveBook;
exports.searchBook = searchBook;