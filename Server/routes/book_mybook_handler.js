/**
 * Created by jung-inchul on 2015. 12. 4..
 */

function loadBorrowedBook(con, req, res){
    var id = req.userId;
    var query = 'SELECT * FROM bookList';
    con.query(query, function(err, response){
        res.send(response);
    });
}

function loadReservedBook(con, req, res){
    var id = req.userId;
    var query = 'SELECT * FROM bookList';
    con.query(query, function(err, response){
        res.send(response);
    });
}

function loadAppliedBook(con, req, res){
    var id = req.userId;
    var query = 'SELECT * FROM bookList';
    con.query(query, function(err, response){
        res.send(response);
    });
}

function turnInBook(con, req, res){
    // 도서를 반납시켜주는 쿼리문
    console.log('turnInBook Function!');
}

function postponeBook(con, req, res){
    // duedate를 증가시켜주는 insert문
    console.log('postponeBook Function!');
}

function missingBook(con, req, res){
    // 분실도서로 insert 시켜주는 쿼리
    console.log('missingBook Function!');
}

function cancelAppliedBook(con, req, res){
    // 신청넣어놓은것을 캔슬시켜주는것.
    console.log('cancelAppliedBook Function!');
}

exports.missingBook = missingBook;
exports.postponeBook = postponeBook;
exports.turnInBook = turnInBook;
exports.loadAppliedBook = loadAppliedBook;
exports.loadReservedBook = loadReservedBook;
exports.loadBorrowedBook = loadBorrowedBook;
exports.cancelAppliedBook = cancelAppliedBook;