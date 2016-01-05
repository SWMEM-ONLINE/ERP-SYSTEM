/**
 * Created by KIMDONGWON on 2016-01-05.
 */
$('#loginButton').submit(function(){
    var broswerInfo = navigator.userAgent;
    if(broswerInfo.indexOf("APP_SWMEM_ANDROID")>-1){
        alert($('#login_id').val());
        window.SWMEM_ANDROID.sendDeviceAndToken($('#login_id').val());
    }
});