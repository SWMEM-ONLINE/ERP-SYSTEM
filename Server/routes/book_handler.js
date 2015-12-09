/**
 * Created by jung-inchul on 2015. 11. 26..
 */

function loadNewTechbook(con, res){
    var query = 'SELECT * FROM t_book where b_newest=1 and b_type=0';
    con.query(query, function(err, response){
        res.send(response);
    });
}

function loadNewHumanitiesbook(con, res){
    var query = 'SELECT * FROM t_book where b_newest=1 and b_type=1';
    con.query(query, function(err, response){
        res.send(response);
    });
}

function borrowBook(con, dataset, res){                       // 도서 대여 등록하기
    var query1 = 'UPDATE t_book set b_state=1 where b_id="' + dataset.body.b_id + '"';
    con.query(query1, function(err, response) {
    });
    // 이부분을 클라쪽으로 넘길까 고민중 관건은 id 를 서버, 클라 어디서 받을 수 있는건지!
    var date = new Date();
    console.log(date);
    var duedate = new Date();
    duedate.setDate(duedate.getDate() + 14);
    var data = {
        br_user : 'tempid',
        br_book_id : dataset.body.b_id,
        br_rental_date : date.getFullYear()+ '-'+(date.getMonth()+1)+'-'+date.getDate(),
        br_due_date : duedate.getFullYear()+ '-'+(duedate.getMonth()+1)+'-'+duedate.getDate(),
        br_extension_cnt : 0
    };
    var query2 = 'insert into t_book_rental SET ?'
    con.query(query2, data, function(err, response){
    });
    // 여기까지
}

function searchBook(con, dataset, res){
    var query = 'SELECT * FROM t_book WHERE ' + dataset.body.category + ' like "%' + dataset.body.searchword + '%"';
    if(dataset.body.flag === 'tech'){
        query += 'and b_type=0';
    }else{
        query += 'and b_type=1';
    }
    con.query(query, function(err, response){
        console.log(response);
        res.send(response);
    });
}

function missingBook(con, dataset, res){                       // 읽어버린 도서 등록
    var query = 'UPDATE t_book set b_state=3 where b_id="' + dataset.body.b_id +'"';
    con.query(query);
    console.log('Register this book to missing booklist!');
}

function reserveBook(con, dataset, res){                    // 도서 예약하기
    var query = 'UPDATE t_book set b_state=2 where b_id="' + dataset.body.b_id + '"';
    con.query(query, dataset);
    console.log('Reservation Success!');
}

exports.loadNewTechbook = loadNewTechbook;
exports.loadNewHumanitiesbook = loadNewHumanitiesbook;
exports.borrowBook = borrowBook;
exports.missingBook = missingBook;
exports.reserveBook = reserveBook;
exports.searchBook = searchBook;