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
            if(req.body.categoryId === '122' || req.body.categoryId === '125' || req.body.categoryId === '123'){
                type = 0;
            }else{
                type = 1;
            }
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
                ba_price : req.body.priceStandard,
                ba_saleStatus : req.body.saleStatus
            };
            con.query(query, data, function(err, response){
                res.send('success');
            });
        }else{
            res.send('failed');
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
        if(err){
            res.send('failed');
            throw err;
        }
        res.send('success');
    });
}

function checkDuplication(con, req, res){
    var query = 'select b_isbn, count(b_isbn) cnt from t_book where b_state != 3 group by b_isbn UNION select count(ba_isbn), ba_isbn from t_book_apply group by ba_isbn';
    con.query(query, function(err, response){
        res.send(response);
    })
}

exports.checkDuplication = checkDuplication;
exports.loadMyapply = loadMyapply;
exports.deleteMyapply = deleteMyapply;
exports.request = request;