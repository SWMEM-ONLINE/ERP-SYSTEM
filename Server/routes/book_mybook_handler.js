/**
 * Created by jung-inchul on 2015. 12. 4..
 */

function loadBorrowedBook(con, req, res){
    var query = 'SELECT * FROM t_book_rental where br_user="' + req.session.passport.user.id + '"';
    con.query(query, function(err, response){
        res.send(response);
    });
}

function loadReservedBook(con, req, res){
    var query = 'SELECT * FROM t_book_reserve where bre_user="' + req.session.passport.user.id + '"';
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
///////////////////////// 완료 /////////////////

function turninBook(con, req, res){
    // t_book_rental에서 반납된 도서의 것을 삭제하고
    // t_book_return에 반납일이랑 그런것을 기록해야한다.
    // t_book 에서의 state도 0으로 변경해야한다.
    // 만약 예약자가 있다면, 그 예약자에게 책이 반납되었다는 push 알림을 보내준다.
    console.log('turnInBook Function!');
}

function postponeBook(con, req, res){
    // t_book_rental 에서 extension_cnt 를 증가시킨다.
    // t_book_rental 에서 due_date 를 14일 늘려준다.
    console.log('postponeBook Function!');
}

function cancelAppliedBook(con, req, res){
    // t_book_apply 에서 제거해주면 된다.
    console.log('cancelAppliedBook Function!');
}

exports.postponeBook = postponeBook;
exports.turninBook = turninBook;
exports.loadAppliedBook = loadAppliedBook;
exports.loadReservedBook = loadReservedBook;
exports.loadBorrowedBook = loadBorrowedBook;
exports.cancelAppliedBook = cancelAppliedBook;