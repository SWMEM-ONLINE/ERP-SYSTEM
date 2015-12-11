/**
 * Created by DBK on 2015. 12. 6..
 */


function ensureAuthenticated(req, res, next) {
    // 로그인이 되어 있으면, 다음 파이프라인으로 진행
    if (req.isAuthenticated()) {
        return next();
    }
    // 로그인이 안되어 있으면, login 페이지로 진행
    res.redirect('/');
};

function getDate(){

    var now = new Date();
    var datetime = now.getFullYear()+'/'+(now.getMonth()+1)+'/'+now.getDate();
    datetime += ' '+now.getHours()+':'+now.getMinutes()+':'+now.getSeconds();

    return datetime;
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
exports.getDate = getDate;
exports.getUserInfo = getUserInfo;
exports.getUserId = getUserId;
exports.getUserGrade = getUserGrade;
exports.getUserName = getUserName;


