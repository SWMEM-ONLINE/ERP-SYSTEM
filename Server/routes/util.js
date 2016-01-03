/**
 * Created by DBK on 2015. 12. 6..
 */


function ensureAuthenticated(req, res, next) {
    /*
    console.log("baseUrl:");
    console.log(req.baseUrl);
    console.log("originalUrl:");
    console.log(req.originalUrl);
    console.log("url:");
    console.log(req.url);
    */
    res.locals.session = req.session;

    // 로그인이 되어 있으면, 다음 파이프라인으로 진행
    if (req.isAuthenticated()) {
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
        res.header('Expires', '-1');
        res.header('Pragma', 'no-cache');
        return next();
    }
    // 로그인이 안되어 있으면, login 페이지로 진행
    res.redirect('/');
};

function getCurDateWithTime(){

    var now = new Date();
    var datetime = now.getFullYear()+'/'+(now.getMonth()+1)+'/'+now.getDate();
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


