package pl.cclite.app

import android.content.Intent
import android.os.Bundle
import androidx.core.splashscreen.SplashScreen.Companion.installSplashScreen
import com.getcapacitor.BridgeActivity

class MainActivity : BridgeActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        installSplashScreen()
        super.onCreate(savedInstanceState)
        
        // Obsługa skrótów przy starcie aplikacji
        handleShortcutIntent(intent)
    }

    override fun onNewIntent(intent: Intent) {
        super.onNewIntent(intent)
        // Obsługa skrótów, gdy aplikacja jest już uruchomiona
        handleShortcutIntent(intent)
    }

    private fun handleShortcutIntent(intent: Intent?) {
        intent?.let {
            val actionType = it.getStringExtra("action_type")
            if (actionType != null) {
                // Przekazanie akcji do części webowej Capacitora
                // Można to zrobić wywołując odpowiedni URL lub używając pluginu
                // W tym przypadku symulujemy otwarcie odpowiedniej ścieżki
                val path = when (actionType) {
                    "LAUNCH_AUDIO_BIBLE" -> "biblia-audio"
                    "PLAY_HALLELUJAH_RADIO" -> "hallelujah-radio"
                    "PLAY_GLOBAL_RADIO" -> "global-radio"
                    "OPEN_BIBLE_READER" -> "czytaj-biblie"
                    else -> null
                }
                
                path?.let { p ->
                    // Capacitor automatycznie wyśle zdarzenie appUrlOpen, 
                    // jeśli ustawimy dane w intencie
                    it.data = android.net.Uri.parse("https://cclite.pl/$p")
                }
            }
        }
    }
}
