package com.breviarium.app;

import android.os.Bundle;
import androidx.activity.EdgeToEdge;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        // Must run before super.onCreate() (which calls setContentView) so the window is laid out
        // edge-to-edge on Android versions where that isn't already enforced by the OS (< API 35).
        // Without it, the status/navigation bars render as opaque bars instead of the app's theme
        // showing through, and Capacitor's SystemBars inset values stay 0 on those versions.
        // EdgeToEdge.enable() creates the window's views, so the post-launch theme must already be set:
        // otherwise they inherit the launch theme's splash android:background and show it as a strip.
        setTheme(R.style.AppTheme_NoActionBar);
        EdgeToEdge.enable(this);
        super.onCreate(savedInstanceState);
    }
}
