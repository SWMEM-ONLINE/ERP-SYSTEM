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

exports.ensureAuthenticated = ensureAuthenticated;


