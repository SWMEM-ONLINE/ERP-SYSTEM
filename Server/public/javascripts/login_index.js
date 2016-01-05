/**
 * Created by KIMDONGWON on 2016-01-05.
 */
$('#loginButton').submit(function(){
    var broswerInfo = navigator.userAgent;
    var userid = document.getElementById('login_id');
    if(broswerInfo.indexOf("APP_SWMEM_ANDROID")>-1){
        alert(userid);
        window.SWMEM_ANDROID.sendDeviceAndToken(userid);
    }
});