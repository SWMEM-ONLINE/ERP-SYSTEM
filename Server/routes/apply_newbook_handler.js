/**
 * Created by jung-inchul on 2015. 11. 15..
 */
function loadMyapply(con, req, res){
    var query = 'SELECT * FROM t_book_apply where ba_user="'+ req.session.passport.user.id +'"';
    con.query(query, function(err, response){
        res.send(response);
    });
}

/*
 *  If you want to apply new book, use this function with data Object.
 *  Check apply_table and no duplications are there, then insert book's data in database to apply.
 */
function request(con, req, res){            // 이 기능 실현 후 1초간 대기시간 두자.
    var query = 'INSERT into t_book_apply SET ?';
    var date = new Date();
    var data = {
        ba_user : req.session.passport.user.id,
        ba_name : req.body.title,
        ba_isbn : req.body.isbn,
        ba_author : req.body.author,
        ba_publisher : req.body.publisher,
        ba_date : date.getFullYear()+ '-'+(date.getMonth()+1)+'-'+date.getDate(),
        ba_price : req.body.priceStandard
    };
    con.query(query, data, function(err, response){
       res.send('책이 신청되었습니다');
    });
}

/*
 *  If you want to delete your request, use this function.
 *  factor value is isbn because is book's own characteristic value.
 */
function deleteMyapply(con, req, res){
    var query = 'DELETE FROM t_book_apply WHERE ba_isbn="' + req.body.ba_isbn + '"';
    con.query(query, function(err, response){
        res.send('신청 취소되었습니다');
    })
}

exports.loadMyapply = loadMyapply;
exports.deleteMyapply = deleteMyapply;
exports.request = request;