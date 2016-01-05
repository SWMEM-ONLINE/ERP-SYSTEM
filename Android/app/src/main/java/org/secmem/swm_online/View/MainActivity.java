package org.secmem.swm_online.View;

import android.app.Activity;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.Bundle;
import android.os.Handler;
import android.support.v4.content.LocalBroadcastManager;
import android.util.Log;
import android.webkit.JavascriptInterface;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;

import com.google.android.gms.common.ConnectionResult;
import com.google.android.gms.common.GooglePlayServicesUtil;

import org.secmem.swm_online.GCM.QuickstartPreferences;
import org.secmem.swm_online.GCM.RegistrationIntentService;
import org.secmem.swm_online.R;

public class MainActivity extends Activity {


    private static final int PLAY_SERVICES_RESOLUTION_REQUEST = 9000;
    private static final String TAG = "MainActivity";
    //private static final String URL = "http:211.189.127.124:3000";
    private static final String URL = "http:52.69.176.156:3000";

    private static int REQUEST_RENT = 0;

    // Javascript 함수처리를 위한 핸들러
    private final Handler handler = new Handler();

    // 토큰을 받은것에 대한 리시버를 등록한다
    private BroadcastReceiver mRegistrationBroadcastReceiver;

    // 보여주기 위한 웹뷰
   private WebView myWebView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        registBroadcastReceiver();



        //getInstanceIdToken();


        myWebView = (WebView) findViewById(R.id.webview);
        myWebView.setWebViewClient(new WebViewClient());
        WebSettings webSettings = myWebView.getSettings();
        webSettings.setJavaScriptEnabled(true);
        myWebView.loadUrl(URL);
        myWebView.addJavascriptInterface(new JavaScriptInterface(), "Android");

    }

    public void getInstanceIdToken() {
        if (checkPlayServices()) {
            // Start IntentService to register this application with GCM.
            Intent intent = new Intent(this, RegistrationIntentService.class);
            startService(intent);
        }
    }

    public void registBroadcastReceiver(){
        mRegistrationBroadcastReceiver = new BroadcastReceiver() {
            @Override
            public void onReceive(Context context, Intent intent) {
                String action = intent.getAction();

                if(action.equals(QuickstartPreferences.REGISTRATION_READY)){
                    //asdf/

                } else if(action.equals(QuickstartPreferences.REGISTRATION_GENERATING)){
                    Toast.makeText(getApplicationContext(), "현재 푸쉬서버 등록중입니다 ", Toast.LENGTH_SHORT).show();


                } else if(action.equals(QuickstartPreferences.REGISTRATION_COMPLETE)){
                    String token = intent.getStringExtra("token");
                    //Toast.makeText(getApplicationContext(), "등록이 완료되었습니다", Toast.LENGTH_SHORT).show();
                    myWebView.loadUrl("javascript:" +
                            "getToken("+token+");" +
                            "");
                    // myWebView.loadUrl("/duty/inquiry");
                }

            }
        };
    }

    protected void onResume() {
        super.onResume();
        LocalBroadcastManager.getInstance(this).registerReceiver(mRegistrationBroadcastReceiver,
                new IntentFilter(QuickstartPreferences.REGISTRATION_READY));
        LocalBroadcastManager.getInstance(this).registerReceiver(mRegistrationBroadcastReceiver,
                new IntentFilter(QuickstartPreferences.REGISTRATION_GENERATING));
        LocalBroadcastManager.getInstance(this).registerReceiver(mRegistrationBroadcastReceiver,
                new IntentFilter(QuickstartPreferences.REGISTRATION_COMPLETE));

    }


    @Override
    protected void onPause() {
        LocalBroadcastManager.getInstance(this).unregisterReceiver(mRegistrationBroadcastReceiver);
        super.onPause();
    }

    /**
     */
    private boolean checkPlayServices() {
        int resultCode = GooglePlayServicesUtil.isGooglePlayServicesAvailable(this);
        if (resultCode != ConnectionResult.SUCCESS) {
            if (GooglePlayServicesUtil.isUserRecoverableError(resultCode)) {
                GooglePlayServicesUtil.getErrorDialog(resultCode, this,
                        PLAY_SERVICES_RESOLUTION_REQUEST).show();
            } else {
                Log.i(TAG, "This device is not supported.");
                finish();
            }
            return false;
        }
        return true;
    }

    @Override
    public void onBackPressed() {
        // TODO Auto-generated method stub
        if (myWebView.canGoBack()) {
            myWebView.goBack();
        } else {
            super.onBackPressed();
        }
    }

    /*
        QRcode 핸들러 정의

     */
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {

        if(requestCode == REQUEST_RENT) {

            if(resultCode == Activity.RESULT_OK)
            {

                String contents = data.getStringExtra("data");
                //위의 contents 값에 scan result가 들어온다.

                //myWebView.loadUrl("javascript:<함수명>('<arg>')");
                myWebView.loadUrl("javascript:" +
                        "toastr['info']('" + contents+"');" +
                        "");
            }
        }
        super.onActivityResult(requestCode, resultCode, data);
    }


    private class JavaScriptInterface
    {
        @JavascriptInterface
        public void callQRActivity(){

            handler.post(new Runnable() {
                public void run() {
                    Toast.makeText(MainActivity.this, "QR Activity called by javascript", Toast.LENGTH_SHORT).show();
                    Intent intent = new Intent("com.google.zxing.client.android.SCAN");

                    intent.putExtra("SCAN_MODE", "QR_CODE_MODE");

                    startActivityForResult(intent, REQUEST_RENT);

                }
            });

        }

        public void getToken(){
            handler.post(new Runnable() {
                public void run() {
                    getInstanceIdToken();
                }
            });

        }

        public void sendToken(){
            handler.post(new Runnable() {
                public void run() {

                }
            });

        }

        public void getDeviceInformation(){
            handler.post(new Runnable() {
                public void run() {

                }
            });

        }



    }
}
