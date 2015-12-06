/**
 * Created by jung-inchul on 2015. 11. 26..
 */

function loadNewest(con, res){
    var query = 'SELECT * FROM bookList';
    con.query(query, function(err, response){
        res.send(response);
    });
}

function borrowBook(con, dataset, res){                       // 도서 대여 등록하기
    var query = 'SELECT * FROM bookList WHERE b_isbn=' + dataset.b_isbn;
    con.query(query, function(err, response) {

    });
}

function searchBook(con, dataset, res){
    var searchWords = dataset.searchWords;
    var query = 'SELECT * FROM bookList WHERE b_name=' + searchWords;
    con.query(query, function(err, response){
        res.send(response);
    });
}

function missingBook(con, dataset, res){                       // 읽어버린 도서 등록
    var query = 'INSERT into bookList SET ?';
    con.query(query, dataset);
}

function reserveBook(con, dataset, res){                    // 도서 예약하기
    var query = 'INSERT into bookList SET ?';
    con.query(query, dataset);
}

exports.loadNewest = loadNewest;
exports.borrowBook = borrowBook;
exports.missingBook = missingBook;
exports.reserveBook = reserveBook;
exports.searchBook = searchBook;