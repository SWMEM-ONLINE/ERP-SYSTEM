/**
 * Created by DBK on 2015. 12. 6..
 */

var gcm = require('node-gcm');
var DB_handler = require('./DB_handler');
var nodemailer = require('nodemailer');

var server_api_key = 'AIzaSyAQnrOAvlFfVZpjug3ndXBHg_HTIcSm_AY';

// 여러명의 리스트로 보낼때
// var id_lists = ["id1","id2"];
// util.sendList(id_lists,"title","content", function(err,data){
//        if(err){
//            console.log(err);
//        }else{
//            console.log(data);
//        }
//
//    });
//
// 한명의 아이디를 보낼때
// util.send("id","title","content", function(err,data){
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
    sendMail(id, title, content);
    var message = new gcm.Message({
        collapseKey: 'swm',
        delayWhileIdle: true,
        timeToLive: 20,
        data: {
            title: title,
            message: content
        }
    });

    var query = "select * from t_user " +
        "where u_id = '" + id+"'; " ;

    var tokenLists = [];
    var con = DB_handler.connectDB();
    con.query(query, function(err,response){
        if(err){
            console.log(err);
            DB_handler.disconnectDB(con);
        }
        else{
            if(response.length ==1){
                var data = response[0];
                var token = data.u_token;
                var flag = data.u_push_flag;
                if(token !== null && flag == 1){
                    tokenLists.push(token);
                }

            }
            var sender = new gcm.Sender(server_api_key);

            // 메세지 객체 , 토큰리스트 , 시도 횟수 , 시도 완료후 콘솔로 찍어줌
            sender.send(message, tokenLists, 5, function (err, result) {
                callback(err, result);
            });
            DB_handler.disconnectDB(con);
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
    sendMail(user_ids, title, content);
    var message = new gcm.Message({
        collapseKey: 'swm',
        delayWhileIdle: true,
        timeToLive: 20,
        data: {
            title: title,
            message: content
        }
    });

    if(user_ids.length === 0 ){
        callback("User List is empty!","User List is empty!" );
        return;
    }

    var query = "";

    for(var i=0 ; i < user_ids.length;i++){
        var user = user_ids[i];
        query += "select * from t_user " +
            "where u_id = '" + user+"'; ";
    }

    var tokenLists = [] ;
    var con = DB_handler.connectDB();
    con.query(query, function(err,response){
        if(err){
            console.log(err);
            DB_handler.disconnectDB(con);
        }
        else{
            for( var i = 0 ; i < response.length; i++){
                var data = response[i];
                for (var j = 0 ; j < data.length; j++){
                    var rawData = data[j];
                    var token = rawData.u_token;
                    var flag = rawData.u_push_flag;
                    if(token !== null && flag == 1){
                        tokenLists.push(token);
                    }
                }

            }

            var sender = new gcm.Sender(server_api_key);

            // 메세지 객체 , 토큰리스트 , 시도 횟수 , 시도 완료후 콘솔로 찍어줌
            sender.send(message, tokenLists, 5, function (err, result) {
                callback(err, result);
            });
            DB_handler.disconnectDB(con);
        }
    });
}

/**
 *
 * 메일 보내는 함수
 *
 * ids에 사용자의 id들을 넣어주면 된다.
 *
 * @param con
 * @param ids
 * @param subject
 * @param content
 */
function sendMail(ids, subject, content){

    console.log("sendMail function");

    var transporter = nodemailer.createTransport('smtps://swmem1516%40gmail.com:tndnjsthapa456@smtp.gmail.com');
    var query = "";
    var i;
    var receivers = [];
    var con = DB_handler.connectDB();
    if( typeof ids == 'string'){
        query = " SELECT * FROM swmem.t_user WHERE (u_id = '" + ids +"');";

        con.query(query,function(err,response){

            if(err)
            {
                console.log(err);
                DB_handler.disconnectDB(con);
            }
            else
            {
                var data;
                for(i=0;i<response.length;i++){
                    data = response[i];
                    if(data.u_mail_flag == 1){
                        receivers.push(data.u_email);

                    }
                }
                // setup e-mail data with unicode symbols
                var mailOptions = {
                    from: '수원멤버십 <swmem1516@gmail.com>', // sender address
                    to: receivers, // list of receivers
                    text: content, // plaintext body
                    subject: subject, // Subject line
                    html: content // html body
                };

                // send mail with defined transport object
                transporter.sendMail(mailOptions, function(error, info){
                    if(error){
                        return console.log(error);
                    }
                    console.log('Message sent: ' + info.response);
                    console.log(info);
                });
                DB_handler.disconnectDB(con);
            }
        });

    }
    else{

        query = "";
        for(i=0 ; i < ids.length;i++){
            var user = ids[i];
            query += "select * from t_user " +
                "where u_id = '" + user+ "'; ";
        }


        con.query(query,function(err,response){
            if(err){
                console.log(err);
                DB_handler.disconnectDB(con);
            }else{
                for( var i = 0 ; i < response.length; i++){
                    var data = response[i];
                    for (var j = 0 ; j < data.length; j++){
                        var rawData = data[j];

                        var email = rawData.u_email;
                        var flag  = rawData.u_mail_flag;
                        if(flag == 1){
                            receivers.push(rawData.u_email);
                        }
                    }
                }

                var mailOptions = {
                    from: '수원멤버십 <swmem1516@gmail.com>', // sender address
                    to: receivers, // list of receivers
                    text: content, // plaintext body
                    subject: subject, // Subject line
                    html: content // html body
                };

                transporter.sendMail(mailOptions, function(error, info){
                    if(error){
                        return console.log(error);
                    }
                    console.log('Message sent: ' + info.response);
                    console.log(info);
                });
                DB_handler.disconnectDB(con);
            }
        });
    }
}


var pushContents = {
    b_borrow : '예약하신 책이 반납되어 자동으로 대여처리 되었습니다. 자세한 사항은 확인하세요',
    b_turnin : '책 반납일을 미준수하여 벌당직이 부여됩니다',


    h_requestBorrow : '하드웨어 대여 신청이 들어왔습니다',
    h_requestPostpone : '하드웨어 연장 신청이 들어왔습니다',
    h_requestTurnin : '하드웨어 반납 신청이 들어왔습니다',


    h_approveBorrow : '하드웨어 대여신청이 승인되었습니다',
    h_approvePostpone : '하드웨어 연장신청이 승인되었습니다',
    h_approveTurnin : '하드웨어 반납신청이 승인되었습니다',
    h_approveApply : '하드웨어 구매신청이 승인되었습니다',


    h_rejectBorrow : '하드웨어 대여신청이 거절되었습니다',
    h_rejectPostpone : '하드웨어 연장신청이 거절되었습니다',
    h_rejectTurnin : '하드웨어 반납신청이 거절되었습니다',
    h_rejectApply : '하드웨어 구매신청이 거절되었습니다',

    h_turnin : '하드웨어 반납일을 미준수하여 벌당직이 부여됩니다'
};


function ensureAuthenticated(req, res, next) {

    res.locals.session = req.session;

    // 로그인이 되어 있으면, 다음 파이프라인으로 진행
    if (req.isAuthenticated() && checkAuth(req)) {
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
        res.header('Expires', '-1');
        res.header('Pragma', 'no-cache');

        return next();
    }
    return res.redirect('/');
}

function checkAuth(req) {

    var url = req.url;
    var grade = parseInt(getUserGrade(req));
    console.log('url');
    console.log(url);
    var result = false;

    switch(url) {
        case '/manage/loadbooklist':
        case '/manage/loadapplylist':
        case '/manage/loadnowHistory':
        case '/manage/loadinArrears':
        case '/manage/loadmissingBook':                                  //도서 관리
        case '/manage/item':
        case '/manage/loadapplylist':
        case '/manage/loadnowHistory':                                   //하드웨어 관리
            if(grade <= 2 || grade == 4) //운영자, 회장, 자재부장
                result = true;
            break;
        case '/register':
        case '/charge':
        case '/manage':                                             //회비 관리
            if(grade <= 3) //운영자, 회장, 총무
                result = true;
            break
        case '/server/manage':                                     //서버신청 관리
        case '/getApplyList/2':                                     //서버신청 관리
            if(grade <= 2 || grade == 8) //운영자, 회장, 네트워크장
                result = true;
            break;
        case '/room/manage':                                     //프로젝트실신청 관리
        case '/getApplyList/1':                                     //프로젝트실신청 관리
            if(grade <= 2 || grade == 6) //운영자, 회장, 세미나장
                result = true;
            break;
        case '/equipment/manage':                                     //비품신청 관리
        case '/getApplyList/3':                                     //비품신청 관리
        case '/setting':                                             //당직 관리
        case '/changeSetting':
        case '/checkListSetting':
        case '/deleteCheckList':
        case '/modifyCheckList':
        case '/insertCheckList':
        case '/deleteBadCheckList':
        case '/modifyBadCheckList':
        case '/insertBadCheckList':
        case '/inquireALLBadCheckList':
        case '/updateMemberPoint':
        case '/autoMakeDuty':
        case '/showChangeDutyHistroryAll':
            if(grade <= 2 || grade == 5) //운영자, 회장, 생활장
                result = true;
            break;
        case '/mileage':                                            //마일리지 관리
            if(grade <= 2) //운영자, 회장
                result = true;
            break;
        case '/sManage':                                            //스케줄 관리
        case '/finished':                                           //수료회원 목록
        case '/add':                                                //상벌당직 추가
        case '/modify':                                             //상벌당직 수정
        case '/getMemberList':
        case '/addPoint':
        case '/getAddPoint':
        case '/modifyPointHistoty':
        case '/removePointHistory':
        case '/qnaManage':                                          //문의 관리
        case '/vManage':                                            //설문 관리
        case '/createNewVote':                                      //설문 추가
        case '/deleteVote':                                         //설문 삭제
        case '/push':                                               //push 전송
            if(grade < 10) //운영자, 자치회
                result = true;
            break;
        case '/adminCalendar':                                     //Smart TV
            if(grade == 1)
                result = true;
            break;
        default:
            if(grade < 104)
                result = true;
            break;
    }
    return result;
}

function getCurDateWithTime(){

    var now = new Date();
    var datetime = now.getFullYear();
    var month = (now.getMonth()+1);
    var date = now.getDate();

    if(month < 10)
        datetime += '/0'+month;
    else
        datetime += '/'+month;

    if(date < 10)
        datetime += '/0'+date;
    else
        datetime += '/'+date;

    var hour = now.getHours();
    var minute = now.getMinutes();
    var second = now.getSeconds();

    if(hour < 10)
        datetime += ' 0'+hour;
    else
        datetime += ' '+hour;

    if(minute < 10)
        datetime += ':0'+minute;
    else
        datetime += ':'+minute;

    if(second < 10)
        datetime += ':0'+second;
    else
        datetime += ':'+second;

    return datetime;
}

function getCurDate(){

    var now = new Date();
    var datetime = now.getFullYear();
    var month = (now.getMonth()+1);
    var date = now.getDate();

    if(month < 10)
        datetime += '/0'+month;
    else
        datetime += '/'+month;

    if(date < 10)
        datetime += '/0'+date;
    else
        datetime += '/'+date;
    
    return datetime;
}

function getLastMonth(){

    var now = new Date();
    now.setMonth(now.getMonth()-1);
    var datetime = now.getFullYear();
    var month = (now.getMonth()+1);

    if(month < 10)
        datetime += '/0'+month;
    else
        datetime += '/'+month;
    return datetime;
}

function convertDate(inputDate){

    var now = new Date(inputDate);
    var datetime = now.getFullYear();
    var month = (now.getMonth()+1);
    var date = now.getDate();

    if(month < 10)
        datetime += '/0'+month;
    else
        datetime += '/'+month;

    if(date < 10)
        datetime += '/0'+date;
    else
        datetime += '/'+date;

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
        return date.substring(5,7);
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


function getTotalDeposit(arr){
    var price = 0;
    var length = arr.length;
    for(var i=0; i<length; i++){
        var obj = arr[i];
        if(obj.fm_money_type == 0){
            price += obj.fm_price;
        }
    }
    return price;
}

function getTotalWithdraw(arr){
    var price = 0;
    var length = arr.length;
    for(var i=0; i<length; i++){
        var obj = arr[i];
        if(obj.fm_money_type == 1){
            price += obj.fm_price;
        }
    }
    return price;
}

exports.pushContents = pushContents;
exports.ensureAuthenticated = ensureAuthenticated;
exports.getCurDateWithTime = getCurDateWithTime;
exports.convertDate = convertDate;
exports.getCurDate = getCurDate;
exports.getLastMonth = getLastMonth;
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
exports.sendMail = sendMail;
exports.getTotalDeposit = getTotalDeposit;
exports.getTotalWithdraw = getTotalWithdraw;
exports.checkAuth = checkAuth;
