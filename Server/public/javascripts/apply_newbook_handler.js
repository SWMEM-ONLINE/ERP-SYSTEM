/**
 * Created by jung-inchul on 2015. 11. 15..
 */
function loadMyapply(con, userId, res){
    //var query = 'SELECT * FROM bookList WHERE user_id=' + userId;
    var query = 'SELECT * FROM bookList';
    con.query(query, function(err, response){
        res.send(response);
    });
}

/*
 *  If you want to apply new book, use this function with data Object.
 *  Check apply_table and no duplications are there, then insert book's data in database to apply.
 */
function request(con, dataset, res){            // 이 기능 실현 후 1초간 대기시간 두자.
    var query = 'SELECT * FROM bookList WHERE b_isbn=' + dataset.b_isbn;
    con.query(query, function(err, response) {      // Checking duplication
        if (response.length != 0){          // already exist => return -1
            console.log('already exist!');
            res.send('이미 신청목록에 존재하는 책입니다.');
        }else {                             // no duplication => return 1
            query = 'INSERT into bookList SET ?';
            con.query(query, dataset);
            console.log('insert success!');
            res.send('신청 완료되었습니다.');
        }
    });
}

/*
 *  If you want to delete your request, use this function.
 *  factor value is isbn because is book's own characteristic value.
 */
function deleteMyapply(con, dataset, res){
    var query = "DELETE FROM bookList WHERE b_isbn=" + dataset.b_isbn;
    con.query(query, function(err, response){
        if(err)
            throw err;
        console.log('Delete success!');
        res.send('신청 취소되었습니다');
    })
}

exports.loadMyapply = loadMyapply;
exports.deleteMyapply = deleteMyapply;
exports.request = request;