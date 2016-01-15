/**
 * Created by jung-inchul on 2015. 11. 26..
 */

var fs = require('fs');

/*
    Load new tech or humanities booklist. Send one select query and return data.
    * b_state
     0 : Waiting State
     1 : Someone borrowed
     3 : Missed State

    * b_new
     0 : Already exists
     1 : Newest book

    * b_type
     0 : Tech book
     1 : Humanities book
 */

function loadNewTechbook(con, res){
    var query = 'select * from t_book where b_new=1 and b_type=0 and not (b_state=3)';
    con.query(query, function(err, response){
        res.send(response);
    });
}

function loadNewHumanitiesbook(con, res){
    var query = 'select * from t_book where b_new=1 and b_type=1 and not (b_state=3)';
    con.query(query, function(err, response){
        res.send(response);
    });
}

/*
    Borrow book process.
    * req.session.passport.user.id : user's id
    - select query to t_user : search username using user's id.
    - update query to t_book : change state to 1, due_date, rental_username.
    - insert query to t_book_rental : insert rental data
 */
function borrowBook(con, req, res){
    var today = getDate(new Date(), 0);
    var due_date = getDate(new Date(), 14);

    var query = 'select * from t_book_rental where br_book_id="' + req.body.book_id + '"';
    con.query(query, function(err, response) {
        if (response.length === 0) {
            var query1 = 'select u_name from t_user where u_id="' + req.session.passport.user.id + '"';
            var query3 = 'insert into t_book_rental SET ?';
            var queryData = {
                br_user: req.session.passport.user.id,
                br_book_id: req.body.book_id,
                br_rental_date: today
            };
            con.query(query1, function (err2, response2) {
                var query2 = 'update t_book set b_state=1, b_due_date="' + due_date + '", b_rental_username="' + response2[0].u_name + '" where b_id="' + req.body.book_id + '"';
                con.query(query2);
            });
            con.query(query3, queryData);
            res.send('success');
        } else {
            res.send('failed');
        }
    });
}

/*
    Search Book Process
 */
function searchBook(con, req, res){
    var query = 'select * from t_book where ' + req.body.category + ' like "%' + req.body.searchWords + '%" and not (b_state=3)';
    if(req.body.flag === 'tech')    query += 'and b_type=0';
    else    query += 'and b_type=1';
    con.query(query, function(err, response){
        res.send(response);
    });
}

/*
    Enroll missing booklist.
    - update query to t_book : change status 3
    - insert query to t_book_loss
    - delete query to t_book_rental
    - delete query to t_book_reserve
 */

function missingBook(con, req, res){
    var today = getDate(new Date(), 0);
    var query = 'UPDATE t_book set b_state=3 where b_id="' + req.body.book_id +'";';
    query += 'delete from t_book_rental where br_book_id="' + req.body.book_id + '";';
    query += 'delete from t_book_reserve where bre_book_id="' + req.body.book_id + '";';
    query += 'insert into t_book_loss SET brl_user="' + req.session.passport.user.id + '", brl_book_id="' + req.body.book_id + '", brl_loss_date="' + today + '"';

    con.query(query, function(err, response){
        if(err){
            res.send('failed');
            throw err
        }
        res.send('success');
    });
}

/*
    Reserve book process
    - select query to t_book_rental UNION t_book_reserve : search who already rental or reserve this book
    - insert query to t_book_reserve
    - update query to t_book : increase reserved_cnt
 */

function reserveBook(con, req, res){
    var today = getDate(new Date(), 0);
    var query = 'select * from t_book_rental where br_book_id="' + req.body.book_id + '"';
    var query1 = 'select br_user from t_book_rental where br_user="' + req.session.passport.user.id+'" and br_book_id="' + req.body.book_id + '"UNION select bre_user from t_book_reserve where bre_user="' + req.session.passport.user.id + '" and bre_book_id="' + req.body.book_id + '"';
    var query2 = 'update t_book set b_reserved_cnt=b_reserved_cnt+1 where b_id="' + req.body.book_id + '";';
    query2 += 'insert into t_book_reserve SET bre_user="' + req.session.passport.user.id + '", bre_book_id=' + req.body.book_id + ', bre_myturn=' + (parseInt(req.body.reserve_cnt)+1) + ', bre_reserve_date="' + today + '"';

    con.query(query, function(err, response){
        if(response.length != 0){
            con.query(query1, function(err2, response2){
                if(response2.length != 0){
                    res.send('failed_2');
                }else{
                    con.query(query2, function(err3, response3){
                        if(err3){
                            res.send('failed_3');
                            throw err3
                        }
                        res.send('success');
                    });
                }
            });
        }else{
            res.send('failed_1');
        }
    });
}

function borrowBook_QR(con, req, res){
    var query = 'select * from t_book where b_isbn="' + req.body.isbn + '" and b_state=0';
    console.log(query);
    con.query(query, function(err, response){
        console.log(response);
        if(err){
            res.send('failed');
        }else{
            if(response.length === 0){
                res.send('noOne');
            }else{
                console.log('here');
                var book_id = response[0].b_id;
                var due_date = getDate(new Date(), 14);
                var query1 = 'update t_book set b_state=1, b_due_date="' + due_date + '", b_rental_username="' + req.session.passport.user.name + '" where b_id="' + book_id + '";';
                query1 += 'insert into t_book_rental SET br_user="' + req.session.passport.user.id + '", br_book_id=' + book_id + ', br_rental_date="' + getDate(new Date(), 0) + '"';
                con.query(query1, function(err2, response2){

                    if(err2){
                        res.send('failed');
                    }else{
                        res.send('success');
                    }
                });
            }
        }
    });
}

function loadnowHistory(con, req, res){
    var query = 'select * from t_book_rental a inner join t_book b on a.br_book_id=b.b_id inner join t_user c on a.br_user=c.u_id';
    con.query(query, function(err, response){
        console.log(response);
        if(err){
            res.send('failed');
            throw err
        }
        res.send(response);
    });
}

function loadpastHistory(con, req, res){
    var query = 'select * from t_book a inner join t_book_return b on a.b_id=b.brt_book_id inner join t_user c on b.brt_user=c.u_id';
    con.query(query, function(err, response){
        if(err){
            res.send('failed');
            throw err
        }
        res.send(response);
    });
}

function loadmissingBook(con, req, res){
    var query = 'select * from t_book_loss a inner join t_book b on a.brl_book_id=b.b_id inner join t_user c on a.brl_user=c.u_id';
    con.query(query, function(err, response){
        if(err){
            res.send('failed');
            throw err
        }
        res.send(response);
    });
}

function reenroll(con, req, res){
    var query = 'update t_book set b_state=0 where b_id IN (' + req.body.enrollList + ');';
    query += 'delete from t_book_loss where brl_book_id IN (' + req.body.enrollList + ');';
    con.query(query, function(err, response){
        if(err){
            res.send('failed');
            throw err
        }
        res.send('success');
    });
}

function loadinArrears(con, req, res){
    var query = 'select *,DATEDIFF(CURDATE(), b_due_date) diff from t_user a inner join t_book b on a.u_name=b.b_rental_username where (DATEDIFF(CURDATE(), b_due_date)) > 0';
    con.query(query, function(err, response){
        res.send(response);
    });
}

function loadApplylist(con, req, res){
    var query = 'select * from t_book_apply a inner join t_user b on a.ba_user=b.u_id where ba_type=' + req.body.flag;
    con.query(query, function(err, response){
        res.send(response);
    });
}

function enrollBook(con, req, res){
    var query='select * from t_book_apply where ba_id IN (' + req.body.registerIdlist + ')';
    var query1 = '';
    con.query(query, function(err, response){
        for(var i = 0; i < response.length; i++){
            query1 += 'insert into t_book set b_type=' + response[i].ba_type + ', b_name="' + response[i].ba_name + '", b_isbn="' + response[i].ba_isbn + '", b_author="' + response[i].ba_author + '", b_publisher="' + response[i].ba_publisher + '", b_location="' + req.body.location + '", b_photo_url="' + response[i].ba_photo_url + '", b_price=' + response[i].ba_price + ';';
        }
        query1 += 'delete from t_book_apply where ba_id IN (' + req.body.registerIdlist + ')';
        con.query(query1, function(err2, response2){
            if(err2){
                res.send('failed');
                throw err2
            }
            res.send('success');
        });
    });
}

function buyComplete(con, req, res){
    var query = 'update t_book_apply set ba_state=1 where ba_id IN (' + req.body.buyIdlist + ');';
    query += 'update t_book set b_new=0 where b_new=1 and b_type=' + req.body.type;
    con.query(query, function(err, response){
        if(err){
            res.send('failed');
            throw err
        }
        res.send('success');
    });
}

function loadbooklist(con, req, res){
    var query = 'select * from t_book where b_type=' + req.body.flag;
    con.query(query, function(err, response){
        res.send(response);
    });
}

function resetbookLocation(con, req, res){
    var query = 'update t_book set b_location="' + req.body.location + '" where b_id IN (' + req.body.resetIdlist + ')';
    con.query(query, function(err, response){
        if(err){
            res.send('failed');
            throw err
        }
        res.send('success');
    });
}

function getDate(base, plusDate){
    var tempDate = new Date(base);
    tempDate.setDate(tempDate.getDate() + plusDate);
    var date = tempDate.getFullYear() + '/' + (tempDate.getMonth()+1) + '/' + tempDate.getDate();
    return date;
}


exports.borrowBook_QR = borrowBook_QR;
exports.resetbookLocation = resetbookLocation;
exports.loadbooklist = loadbooklist;
exports.buyComplete = buyComplete;
exports. enrollBook = enrollBook;
exports.loadApplylist = loadApplylist;
exports.loadinArrears = loadinArrears;
exports.reenroll = reenroll;
exports.loadmissingBook = loadmissingBook;
exports.loadpastHistory = loadpastHistory;
exports.loadnowHistory = loadnowHistory;
exports.loadNewTechbook = loadNewTechbook;
exports.loadNewHumanitiesbook = loadNewHumanitiesbook;
exports.borrowBook = borrowBook;
exports.missingBook = missingBook;
exports.reserveBook = reserveBook;
exports.searchBook = searchBook;