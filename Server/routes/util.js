/**
 * Created by DBK on 2015. 12. 6..
 */

var gcm = require('node-gcm');
var DB_handler = require('./DB_handler');
var con = DB_handler.connectDB();


//var userids = ['1111','2222','3333'];
//
// 배열로 보낼때
// GCM.sendList(id_lists,"title","content", function(err,data){
//        if(err){
//            console.log(err);
//        }else{
//            console.log(data);
//        }
//
//    });
//
// 한명의 아이디를 보낼때
// GCM.send("id","title","content", function(err,data){
//        if(err){
//            console.log(err);
//        }else{
//            console.log(data);
//        }
//    });

/**
 *
 * GCMPUSH하는 함수
 *
 * 하나의 유저만을 보내준다
 *
 * @param id            user id 를 보내준다
 * @param title 타이틀을 넣어준다
 * @param content 내용을 넣어준다
 * @param callback  err, result 를 반환한다
 */
function send(id, title, content , callback){

    var message = new gcm.Message({
        collapseKey: 'swm',
        delayWhileIdle: true,
        timeToLive: 20,
        data: {
            title: title,
            message: content
        }
    });

    var query = "select u_token from t_user " +
        "where u_id = '" + id+"'; " ;

    var tokenLists = [];

    con.query(query, function(err,response){
        if(err){
            console.log(err);
        }
        else{

            if(response.length ==1){
                var data = response[0];
                var token = data.u_token;

                if(token !== null){
                    tokenLists.push(token);
                }

            }

            console.log(response);
            console.log(tokenLists);


            var server_api_key = 'AIzaSyAQnrOAvlFfVZpjug3ndXBHg_HTIcSm_AY';
            var sender = new gcm.Sender(server_api_key);


            // 메세지 객체 , 토큰리스트 , 시도 횟수 , 시도 완료후 콘솔로 찍어줌
            sender.send(message, tokenLists, 5, function (err, result) {
                callback(err, result);
            });


        }
    });
}

/**
 *
 * @param user_ids user id 배열을 넣어준다
 * @param title 타이틀을 넣어준다
 * @param content 내용을 넣어준다
 * @param callback  err, result 를 반환한다
 */
function sendList(user_ids, title, content , callback){

    var message = new gcm.Message({
        collapseKey: 'swm',
        delayWhileIdle: true,
        timeToLive: 20,
        data: {
            title: title,
            message: content
        }
    });

    if(user_ids.length == 0 ){
        callback("User List is empty!","User List is empty!" );
        return;
    }

    var query = "";

    for(var i=0 ; i < user_ids.length;i++){
        var user = user_ids[i];
        query += "select u_token from t_user " +
            "where u_id = '" + user+"'; "
    }

    var tokenLists = [] ;

    con.query(query, function(err,response){
        if(err){
            console.log(err);
        }
        else{

            for( var i = 0 ; i < response.length; i++){
                var data = response[i];
                for (var j = 0 ; j < data.length; j++){
                    var rawData = data[j];

                    var token = rawData.u_token;

                    if(token !== null){
                        tokenLists.push(rawData.u_token);
                    }
                }

            }
            console.log(response);
            console.log(tokenLists);

            var server_api_key = 'AIzaSyAQnrOAvlFfVZpjug3ndXBHg_HTIcSm_AY';
            var sender = new gcm.Sender(server_api_key);

            // 메세지 객체 , 토큰리스트 , 시도 횟수 , 시도 완료후 콘솔로 찍어줌
            sender.send(message, tokenLists, 5, function (err, result) {
                callback(err, result);
            });

        }
    });
}


function ensureAuthenticated(req, res, next) {
    // 로그인이 되어 있으면, 다음 파이프라인으로 진행
    if (req.isAuthenticated()) {
        return next();
    }
    // 로그인이 안되어 있으면, login 페이지로 진행
    res.redirect('/');
};

function getCurDateWithTime(){

    var now = new Date();
    var datetime = now.getFullYear()+'/'+(now.getMonth()+1)+'/'+now.getDate();
    datetime += ' '+now.getHours()+':'+now.getMinutes()+':'+now.getSeconds();

    return datetime;
}

function getCurDate(){

    var now = new Date();
    var datetime = now.getFullYear()+'/'+(now.getMonth()+1)+'/'+now.getDate();

    return datetime;
}

function getYear(date){
    if(10<date.length){
        return date.substring(0,4);
    }
    return 0;
}

function getMonth(date){
    if(10<date.length){
        return date.substring(5,7);;
    }
    return 0;
}

function getDay(date){
    if(10<date.length){
        return date.substring(8,10);
    }
    return 0;
}
function getTime(date){
    if(17<date.length){
        var arr = date.split(' ');
        if(1<arr.length){
            return arr[1];
        }
    }
    return 0;
}

function getUserInfo(req){
    return req.session.passport.user;
}

function getUserId(req){
    return req.session.passport.user.id;
}

function getUserGrade(req){
    return req.session.passport.user.grade;
}

function getUserName(req){
    return req.session.passport.user.name;
}

exports.ensureAuthenticated = ensureAuthenticated;
exports.getCurDateWithTime = getCurDateWithTime;
exports.getCurDate = getCurDate;
exports.getYear = getYear;
exports.getMonth = getMonth;
exports.getDay = getDay;
exports.getTime = getTime;
exports.getUserInfo = getUserInfo;
exports.getUserId = getUserId;
exports.getUserGrade = getUserGrade;
exports.getUserName = getUserName;
exports.send = send;
exports.sendList = sendList;