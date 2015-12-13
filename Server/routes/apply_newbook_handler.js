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
function request(con, req, res){
    var query1 = 'select * from t_book_apply where ba_isbn="' + req.body.isbn + '"';
    con.query(query1, function(err, response1){
        if(response1.length === 0){
            var query = 'INSERT into t_book_apply SET ?';
            var type;
            if(req.body.categoryId === 122 || req.body.categoryId === 125 || req.body.categoryId === 123)   type = 0;
            else    type = 1;
            var date = new Date();
            var data = {
                ba_user : req.session.passport.user.id,
                ba_type : type,
                ba_name : req.body.title,
                ba_isbn : req.body.isbn,
                ba_author : req.body.author,
                ba_publisher : req.body.publisher,
                ba_photo_url : req.body.coverLargeUrl,
                ba_apply_date : date.getFullYear()+ '-'+(date.getMonth()+1)+'-'+date.getDate(),
                ba_price : req.body.priceStandard
            };
            con.query(query, data, function(err, response){
                res.send('책이 신청되었습니다');
            });
        }else{
            res.send('이미 신청리스트에 존재하는 책입니다');
        }
    });
}

/*
 *  If you want to delete your request, use this function.
 *  factor value is isbn because is book's own characteristic value.
 */
function deleteMyapply(con, req, res){
    var query = 'DELETE FROM t_book_apply WHERE ba_isbn="' + req.body.isbn + '"';
    con.query(query, function(err, response){
        res.send('신청 취소되었습니다');
    })
}

function checkDuplication(con, req, res){
    var query = 'select b_isbn, b_total from t_book where b_state!=3 UNION select ba_id, ba_isbn from t_book_apply';
    con.query(query, function(err, response){
        res.send(response);
    })
}

exports.checkDuplication = checkDuplication;
exports.loadMyapply = loadMyapply;
exports.deleteMyapply = deleteMyapply;
exports.request = request;