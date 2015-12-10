/**
 * Created by KIMDONGWON on 2015-11-27.
 */
var express = require('express');

var router = express.Router();
var gcm = require('./../libs/gcm');
/* GET users listing. */
router.get('/', function(req, res, next) {
    res.render('apply_room', { title: 'room' });
});

router.post('/complete', function(req, res, next) {
    var title ='SWSSM NOTICE';
    var content = '프로젝트실 신청 알림';
    gcm.send(title,content,'AIzaSyAQnrOAvlFfVZpjug3ndXBHg_HTIcSm_AY','eh-qMqapWQY:APA91bGWXSmHuA3RwIC7XPIs2R2MrrvaLX3Er7BGqCSr3sRR_hrlOoIyCJKl1vD1-ZJKUDgvWL82z_OGmH1DlYufh9twsvmYgIS0DJs8pphVruLnURHkQPJ9E5UmFurfr1EaguaFrLAq');
});

module.exports = router;
