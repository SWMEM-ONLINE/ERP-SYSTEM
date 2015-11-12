package org.secmem.swm_online.View;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;

import com.google.zxing.client.android.CaptureActivity;

import org.secmem.swm_online.R;

public class QRActivity extends Activity {


    static int REQUEST_RENT = 0;
    Button btn;
    TextView result_text;
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_qr);

        result_text =(TextView)findViewById(R.id.qr_result_text);
        btn = (Button)findViewById(R.id.qr_btn);

        btn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent("com.google.zxing.client.android.SCAN");

                intent.putExtra("SCAN_MODE", "QR_CODE_MODE");

                startActivityForResult(intent, REQUEST_RENT);


            }
        });

    }


    protected void onActivityResult(int requestCode, int resultCode, Intent data) {

        if(requestCode == REQUEST_RENT) {

            if(resultCode == Activity.RESULT_OK)
            {
                String contents = data.getStringExtra("data");
                //위의 contents 값에 scan result가 들어온다.

                Toast.makeText(getApplicationContext(),contents,Toast.LENGTH_SHORT).show();
                result_text.setText(contents);
            }

        }

        super.onActivityResult(requestCode, resultCode, data);
    }
}
