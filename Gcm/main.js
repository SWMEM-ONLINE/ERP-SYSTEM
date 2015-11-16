
/*

  node-gcm 패키지가 깔려있어야함
  title , content ,  서버키 , 토큰 순으로 보내주면
  PUSH 메세지 전송

*/

var gcm = require('./gcm');
gcm.send("title","content",'AIzaSyAQnrOAvlFfVZpjug3ndXBHg_HTIcSm_AY','cM9ztr85soo:APA91bFETUuQPolKdEw7n8WaX9_lfe8wCsQCmqmINbyD3echfeTReflQsfGohhkC1oVtofjNcWE4kcllFjPCwK9qQJZi8H663T026wSmc0Fbfg8sj6kRZajBljCuljomu6EhAmZUjuXK');
