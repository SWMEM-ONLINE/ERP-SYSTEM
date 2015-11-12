package org.secmem.swm_online.View;

import android.app.Activity;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.Bundle;
import android.support.v4.content.LocalBroadcastManager;
import android.util.Log;
import android.view.View;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Button;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

import com.google.android.gms.common.ConnectionResult;
import com.google.android.gms.common.GooglePlayServicesUtil;

import org.secmem.swm_online.GCM.QuickstartPreferences;
import org.secmem.swm_online.GCM.RegistrationIntentService;
import org.secmem.swm_online.R;

public class MainActivity extends Activity {


    private static final int PLAY_SERVICES_RESOLUTION_REQUEST = 9000;
    private static final String TAG = "MainActivity";
    private static final String URL = "http://www.swmem.org";
    private static int REQUEST_RENT = 0;

    private Button qrButton;
    private Button mRegistrationButton;
    private ProgressBar mRegistrationProgressBar;
    private BroadcastReceiver mRegistrationBroadcastReceiver;
    private TextView mInformationTextView;
    private WebView myWebView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        registBroadcastReceiver();
        mInformationTextView = (TextView) findViewById(R.id.informationTextView);
        mInformationTextView.setVisibility(View.GONE);

        mRegistrationProgressBar = (ProgressBar) findViewById(R.id.registrationProgressBar);
        mRegistrationProgressBar.setVisibility(ProgressBar.GONE);
        qrButton =  (Button) findViewById(R.id.qr_btn);
        mRegistrationButton = (Button) findViewById(R.id.registrationButton);

        mRegistrationButton.setOnClickListener(new View.OnClickListener() {
            /**
             * @param view
             */
            @Override
            public void onClick(View view) {
                getInstanceIdToken();
            }
        });

        qrButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent("com.google.zxing.client.android.SCAN");

                intent.putExtra("SCAN_MODE", "QR_CODE_MODE");

                startActivityForResult(intent, REQUEST_RENT);


            }
        });


        //걍 실행되자마자 토큰 갖어오게 해둠
       // getInstanceIdToken();

        // 웹뷰 설정
        myWebView = (WebView) findViewById(R.id.webview);
        myWebView.setWebViewClient(new WebViewClient());
        WebSettings webSettings = myWebView.getSettings();
        webSettings.setJavaScriptEnabled(true);
        myWebView.loadUrl(URL);


       // myWebView.addJavascriptInterface(new WebAppInterface(this), "Android");


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
                    mRegistrationProgressBar.setVisibility(ProgressBar.GONE);
                    mInformationTextView.setVisibility(View.GONE);
                } else if(action.equals(QuickstartPreferences.REGISTRATION_GENERATING)){
                    mRegistrationProgressBar.setVisibility(ProgressBar.VISIBLE);
                    mInformationTextView.setVisibility(View.VISIBLE);
                    mInformationTextView.setText(getString(R.string.registering_message_generating));
                } else if(action.equals(QuickstartPreferences.REGISTRATION_COMPLETE)){
                    mRegistrationProgressBar.setVisibility(ProgressBar.GONE);
                    mRegistrationButton.setText(getString(R.string.registering_message_complete));
                    mRegistrationButton.setEnabled(false);
                    String token = intent.getStringExtra("token");
                    mInformationTextView.setText(token);
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
    /**
     */

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

//    @Override
//    public boolean onKeyUp(int keyCode, KeyEvent event) {
//        // TODO Auto-generated method stub
//        if(keyCode == KeyEvent.KEYCODE_MENU){
//            if(isMenuOpen){
//                translateOutAnim.start();
//                isMenuOpen = false;
//            }
//            else{
//                translateInAnim.start();
//                isMenuOpen = true;
//            }
//
//            return true;
//        }
//        return super.onKeyUp(keyCode, event);
//    }



    /*
        QRcode 핸들러 정의

     */


    protected void onActivityResult(int requestCode, int resultCode, Intent data) {

        if(requestCode == REQUEST_RENT) {

            if(resultCode == Activity.RESULT_OK)
            {
                String contents = data.getStringExtra("data");
                //위의 contents 값에 scan result가 들어온다.

                Toast.makeText(getApplicationContext(), contents, Toast.LENGTH_SHORT).show();
                mInformationTextView.setText(contents);
            }

        }

        super.onActivityResult(requestCode, resultCode, data);
    }




    public class MyWebViewClient extends WebViewClient {

        @Override
        public boolean shouldOverrideUrlLoading(WebView view, String url) {
            // TODO Auto-generated method stub
            myWebView.loadUrl(url);
            return true;
        }
    }


}
