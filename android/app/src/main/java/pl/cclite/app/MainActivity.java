package pl.cclite.app;

import android.os.Bundle;
import android.webkit.WebView;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onPause() {
        super.onPause();
        // Prevent WebView from freezing JavaScript execution and buffering streams when minimized or screen is locked.
        try {
            if (this.bridge != null) {
                WebView webView = this.bridge.getWebView();
                if (webView != null) {
                    webView.onResume();
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
