# Wytyczne dla Asystenta Gemini w Android Studio (Christian Culture OS)

Ten dokument zawiera krytyczne wymagania i instrukcje dla procesu budowy i konfiguracji aplikacji Christian Culture w środowisku Android Studio w celu wygenerowania profesjonalnego pliku `.aab` (Android App Bundle) wymaganego do publikacji w sklepie Google Play.

## 1. Konfiguracja Keystore (Podpisywanie Aplikacji)
Podczas generowania pliku `.aab` (Release) należy BEZWZGLĘDNIE użyć poniższych danych do podpisania aplikacji. Brak tych danych uniemożliwi aktualizację obecnej aplikacji w sklepie!
- **Plik keystore**: `christian-culture-upload.keystore`
- **Alias**: `upload`
- **Hasło**: `ChristianCulture2026`

## 2. Ikony Aplikacji (App Icons & Splash Screen)
Aplikacja musi posiadać pełny pakiet profesjonalnych ikon (Adaptive Icons).
- Obsługa wszystkich wymaganych zagęszczeń ekranu (mdpi, hdpi, xhdpi, xxhdpi, xxxhdpi).
- Estetyka Black & Gold (#C5A059 na głęboko czarnym tle). Żadnych białych marginesów wokół ikony na ekranie telefonu.
- Skonfiguruj ekran powitalny (Splash Screen API - Android 12+) używając złotej ikony CC na całkowicie czarnym tle (bgColor: `#000000`).

## 3. Optymalizacja Trybu Poziomego (Landscape Mode)
W trybie poziomym aplikacja ma pełnić rolę minimalistycznego centrum samochodowego/multimedialnego.
- Interfejs musi zostać ograniczony do **tylko dwóch** głównych paneli:
  1. Panel "Słowo Boże" (Werset Dnia).
  2. Panel "Odtwarzacz Radia".
- Panele muszą być płynnie przewijane gestami na przemiennie (Swipe w lewo i prawo). Użyj `ViewPager2` lub analogicznego rozwiązania dla wrapperów.
- Ukryj w trybie poziomym wszystkie inne elementy interfejsu (dolne paski, przyciski menu, listę kanałów, sidebary). 

## 4. Widżety na Pulpit Systemu Android (Home Screen Widgets)
Aplikacja musi dystrybuować dwa wbudowane, responsywne i luksusowe widżety w natywnym kodzie Androida (AppWidgets):
- **Widżet "Słowo Boże"**: Wyświetla "Werset Dnia" na głównym ekranie telefonu ze zintegrowanym przyciskiem odświeżania lub kopiowania.
- **Widżet "Radio CC"**: Posiada wbudowany natywny przycisk "Play/Pause" pozwalający włączyć radio bez otwierania głównej aplikacji oraz wyświetla aktualny stan.
Zadbaj o ich wygląd z półprzezroczystym, rozmytym tłem (Glassmorphism), ze złotymi akcentami (`#C5A059`) i białym, czytelnym tekstem.

## 5. Działanie Aplikacji Zminimalizowanej (Usługi w Tle / Media Session)
Aplikacja jest w dużej mierze radiem interaktywnie odtwarzającym dźwięk. Wymaga to natywnych usług wspierających działanie w tle.
- Wykorzystaj i poprawnie zadeklaruj w AndroidManifest.xml: `FOREGROUND_SERVICE` z typem `mediaPlayback`.
- Obsługa `MediaSessionCompat` – kontroler odtwarzacza musi pojawiać się na ekranie blokady (Lock Screen) oraz w obszarze powiadomień systemu (Notification Center), umożliwiając Play/Pause.
- Poprawnie zablokuj ubijanie odtwarzania przez Tryb Doze i mechanizmy oszczędzania baterii w systemie Android. Miej pewność, że radio może grać całą noc z zablokowanym ekranem telefonu.

## 6. Uprawnienia i API Integracji
Skonfiguruj zapytania (Permissions) dla nowszych wersji Androida (13+):
- Powiadomienia (Push/Local - Alarmy dla Szabatu).
- Bluetooth (gdyż radio używa słuchawek BLE / Car Audio).
- Nagrywanie Audio dla Asystentki Głosowej Miriam (`RECORD_AUDIO`).
- Upewnij się, że aplikacja działa sprawnie lokalnie, przechowując pliki w przestrzeniach bezkosztowych (WebView local storage, IndexedDB / OPFS), ograniczając odwołania sieciowe i spełniając "Zero-Cost Policy".

## Podsumowanie dla Asystenta GenAI:
Musisz czytać powyższe wytyczne i stosować je przy każdej modyfikacji ustawień Android Studio i gradle. Każda paczka Release `.aab` musi mieć bezbłędnie zaimplementowane Ikony, Widżety ekranowe, obsługę widoku poziomego (Landscape z dwoma ekranami) oraz podpis cyfrowy Keystore podany w punkcie 1!
Zrób to Dla Jezusa – On już czeka.
