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
    var query = 'select * from t_book_rental where br_id="' + req.body.id + '"';
    con.query(query, function(err, response){
        if(response.length === 0){
            var query1 = 'UPDATE t_book set b_state=1 where b_id="' + req.body.id + '"';
            con.query(query1);
            var date = new Date();
            var duedate = new Date();
            duedate.setDate(duedate.getDate() + 14);
            var data = {
                br_user : req.session.passport.user.id,
                br_book_id : req.body.id,
                br_book_name : req.body.name,
                br_rental_date : date.getFullYear()+ '-'+(date.getMonth()+1)+'-'+date.getDate(),
                br_due_date : duedate.getFullYear()+ '-'+(duedate.getMonth()+1)+'-'+duedate.getDate(),
                br_extension_cnt : 0
            };
            var query2 = 'insert into t_book_rental SET ?';
            con.query(query2, data);
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
    var query = 'UPDATE t_book set b_state=3 where b_id="' + req.body.id +'"';
    con.query(query);
}

function reserveBook(con, req, res){                    // 도서 예약하기
    var query = 'UPDATE t_book set b_state=2 where b_id="' + req.body.id + '"';
    con.query(query, req);
    var query2 = 'insert into t_book_reserve SET ?';
    var date = new Date();
    var data = {
        bre_user : req.session.passport.user.id,
        bre_book_id : req.body.id,
        bre_book_name : req.body.name,
        bre_reserve_date : date.getFullYear()+ '-'+(date.getMonth()+1)+'-'+date.getDate()
    };
    con.query(query2, data);
}

exports.loadNewTechbook = loadNewTechbook;
exports.loadNewHumanitiesbook = loadNewHumanitiesbook;
exports.borrowBook = borrowBook;
exports.missingBook = missingBook;
exports.reserveBook = reserveBook;
exports.searchBook = searchBook;