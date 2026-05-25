package pl.cclite.app

import android.content.Intent
import android.net.Uri
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.BackHandler
import androidx.activity.compose.setContent
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.core.view.WindowCompat

// --- Premium Design Tokens ---
val DeepBlack = Color(0xFF000000)
val PrimaryGold = Color(0xFFD4AF37)
val SecondaryGold = Color(0xFFE5BA73)
val SatinWhite = Color(0xFFF5F5F5)

class UpdateRequiredActivity : ComponentActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        // Zapewnia rysowanie od krawędzi do krawędzi (edge-to-edge)
        WindowCompat.setDecorFitsSystemWindows(window, false)
        
        // Pobierz docelową wersję z Intentu (lub ustaw domyślną)
        val targetVersion = intent.getStringExtra("TARGET_VERSION") ?: "V26.5.17.1"

        setContent {
            MaterialTheme {
                UpdateRequiredScreen(
                    targetVersion = targetVersion,
                    onUpdateClick = { launchPlayStore() }
                )
            }
        }
    }

    // Blokada cofania na poziomie Activity
    override fun onBackPressed() {
        // Puste - brak możliwości wyjścia z tego ekranu
    }

    private fun launchPlayStore() {
        val packageName = packageName
        try {
            // Próba otwarcia natywnej aplikacji Google Play
            val intent = Intent(Intent.ACTION_VIEW, Uri.parse("market://details?id=$packageName"))
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            startActivity(intent)
        } catch (e: android.content.ActivityNotFoundException) {
            // Fallback do przeglądarki, jeśli aplikacja Google Play nie jest zainstalowana
            val intent = Intent(Intent.ACTION_VIEW, Uri.parse("https://play.google.com/store/apps/details?id=$packageName"))
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            startActivity(intent)
        }
    }
}

@Composable
fun UpdateRequiredScreen(targetVersion: String, onUpdateClick: () -> Unit) {
    // Blokada cofania na poziomie Jetpack Compose (BackHandler wyłapuje fizyczny gest/przycisk Wstecz)
    BackHandler(enabled = true) {
        // Nic nie robimy
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(DeepBlack)
            .systemBarsPadding() 
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(horizontal = 32.dp, vertical = 48.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.SpaceBetween
        ) {
            // --- HEADER ---
            Column(
                horizontalAlignment = Alignment.CenterHorizontally,
                modifier = Modifier.padding(top = 32.dp)
            ) {
                Text(
                    text = "Konieczna aktualizacja\ndo nowej wersji aplikacji",
                    color = PrimaryGold,
                    fontSize = 26.sp,
                    fontWeight = FontWeight.Bold,
                    fontFamily = FontFamily.Serif, // Lora equivalent for premium feel
                    textAlign = TextAlign.Center,
                    lineHeight = 32.sp
                )
                Spacer(modifier = Modifier.height(8.dp))
                Text(
                    text = targetVersion,
                    color = PrimaryGold.copy(alpha = 0.9f),
                    fontSize = 24.sp,
                    fontWeight = FontWeight.Bold,
                    fontFamily = FontFamily.SansSerif,
                    textAlign = TextAlign.Center
                )
            }

            // --- CENTRAL LOGO ---
            // Używamy painterResource z odpowiednim identyfikatorem dla złotej ikony CC. 
            // Jeśli nie ma ikony natywnej, możesz załadować obraz ze ścieżki.
            // Placeholder ikony w celach demonstracyjnych.
            val ccLogo = painterResource(id = android.R.drawable.ic_menu_gallery) 
            Box(
                modifier = Modifier
                    .weight(1f)
                    .fillMaxWidth(),
                contentAlignment = Alignment.Center
            ) {
                // To wywołanie Image zakłada posiadanie pliku res/drawable/aktulizuj_logo_cc.png 
                Image(
                    painter = ccLogo,
                    contentDescription = "Christian Culture Global RADIO",
                    contentScale = ContentScale.Fit,
                    modifier = Modifier.size(240.dp)
                )
            }

            // --- SUBTITLE ---
            Column(
                horizontalAlignment = Alignment.CenterHorizontally,
                modifier = Modifier.padding(bottom = 32.dp)
            ) {
                Text(
                    text = "Korzystasz ze starej wersji aplikacji.",
                    color = SatinWhite,
                    fontSize = 16.sp,
                    fontWeight = FontWeight.Normal,
                    fontFamily = FontFamily.SansSerif,
                    textAlign = TextAlign.Center
                )
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    text = "Zaktualizuj ją już teraz i sprawdź, co nowego\nprzygotowaliśmy dla Ciebie!",
                    color = SatinWhite,
                    fontSize = 16.sp,
                    fontWeight = FontWeight.Normal,
                    fontFamily = FontFamily.SansSerif,
                    textAlign = TextAlign.Center,
                    lineHeight = 22.sp
                )
            }

            // --- ACTION BUTTON ---
            Button(
                onClick = onUpdateClick,
                colors = ButtonDefaults.buttonColors(
                    containerColor = SecondaryGold,
                    contentColor = DeepBlack
                ),
                shape = RoundedCornerShape(12.dp),
                modifier = Modifier
                    .fillMaxWidth()
                    .height(56.dp)
            ) {
                Text(
                    text = "AKTUALIZUJ", // Uppercase wymuszone
                    fontWeight = FontWeight.ExtraBold,
                    fontSize = 18.sp,
                    letterSpacing = 1.sp
                )
            }
        }
    }
}
