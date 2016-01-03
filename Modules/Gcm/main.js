
/*

  node-gcm 패키지가 깔려있어야함
  title , content ,  서버키 , 토큰 순으로 보내주면
  PUSH 메세지 전송

*/

var gcm = require('./../../Server/routes/gcm');
gcm.send("title","content",'AIzaSyAQnrOAvlFfVZpjug3ndXBHg_HTIcSm_AY','eh-qMqapWQY:APA91bGWXSmHuA3RwIC7XPIs2R2MrrvaLX3Er7BGqCSr3sRR_hrlOoIyCJKl1vD1-ZJKUDgvWL82z_OGmH1DlYufh9twsvmYgIS0DJs8pphVruLnURHkQPJ9E5UmFurfr1EaguaFrLAq');
