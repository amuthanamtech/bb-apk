# APK Demo Project

This is a demo Next.js project configured with Capacitor to build Android APKs. It wraps your web app in a native Android application using a WebView.

## How It Works

The APK loads your hosted Next.js website in an embedded WebView, providing a native app experience without converting to React Native. Users can interact with your site as if it's a mobile app.

## Prerequisites

- Node.js and npm
- Java 21 (for Android build)
- Android SDK (command-line tools installed)
- Git

## Setup

1. **Clone or copy the project**:
   ```
   cd apk-demo
   npm install
   ```

2. **Configure Capacitor**:
   - Edit `capacitor.config.ts` to set your hosted app URL:
     ```typescript
     server: {
       url: 'https://your-hosted-app.com' // Replace with your URL
     }
     ```

3. **Host Your App** (if not static):
   - Deploy the Next.js app to Vercel, Netlify, etc.
   - Update the URL in step 2.

## Building the APK

1. **Sync Capacitor**:
   ```
   npx cap sync android
   ```

2. **Build APK**:
   ```
   cd android
   ./gradlew assembleDebug
   ```

3. **Find the APK**:
   - `android/app/build/outputs/apk/debug/app-debug.apk`

## What You Can Do in This Project

- **Customize the Web App**: Edit files in `src/` to change UI, add features, etc.
- **Add Native Features**: Use Capacitor plugins (e.g., camera, geolocation).
- **Static Export**: For offline APKs, add `output: 'export'` to `next.config.js`, set `webDir: 'out'`, build with `npm run build`, then sync.
- **Icons and Splash**: Add icons in `resources/`, update `capacitor.config.ts`.
- **Plugins**: Install plugins like `@capacitor/camera` for native access.

## Testing

- Install the APK on an Android device.
- Ensure the hosted site is accessible and mobile-responsive.

## Production

For release APKs:
- Generate a keystore.
- Use `./gradlew assembleRelease` and sign the APK.

## Notes

- Requires internet for server mode.
- For full native apps, consider React Native instead.

## Firebase Cloud Messaging (Push Notifications)

This project includes full Firebase Cloud Messaging (FCM) integration for Android push notifications.

### Features

- ✅ Automatic FCM token registration on app start
- ✅ Token storage in MSSQL database
- ✅ Foreground/background notification handling
- ✅ Permission management
- ✅ Backend API for token management
- ✅ Push testing script

### Setup

1. **Firebase Configuration**:
   - Firebase config is in `app/firebase.ts`
   - Service account key: `app/best-bazaar-92dd6-7d5e83eb8fe5.json`

2. **Database Setup**:
   - MSSQL table `fcm_tokens` with columns:
     - `user_id` (nullable)
     - `device_id` (UUID)
     - `fcm_token` (string)
     - `platform` ('android')
     - `is_active` (1/0)
     - `created_at` (datetime)

3. **Environment Variables** (for backend):
   ```env
   DB_SERVER=localhost
   DB_NAME=bestbazaar
   DB_USER=sa
   DB_PASSWORD=your_password
   ```

### How It Works

1. **Token Registration**:
   - App requests push permissions on first launch
   - Registers with FCM and gets device token
   - Sends token to `/api/save-fcm-token` API
   - Stores in MSSQL database

2. **Notification Handling**:
   - Foreground notifications show as alerts
   - Background notifications use system tray
   - Logs all events to console and Logcat

3. **Testing Push Notifications**:
   ```bash
   # Send to all active Android tokens
   node scripts/push-test.js "Hello!" "This is a test notification"

   # Send to specific token
   node scripts/push-test.js "Hi User!" "Personal message" "your-fcm-token-here"
   ```

### Retrieving Tokens

```sql
-- Get all active Android tokens
SELECT fcm_token FROM fcm_tokens WHERE platform='android' AND is_active=1;

-- Get tokens for specific user (when user_id is set)
SELECT fcm_token FROM fcm_tokens WHERE user_id=123 AND platform='android' AND is_active=1;
```

### Security Notes

- ⚠️ **Firebase admin operations are server-side only**
- ⚠️ **Never expose service account keys in mobile code**
- ⚠️ **Push sending should only be done from secure backend**
- ✅ Client-side only handles token registration and receiving

### Logs to Check

- Browser console: `📱 Mobile FCM Token:`
- Android Logcat: Search for `📱 Mobile FCM Token`
- Backend logs: Token save confirmations

### Building & Testing

```bash
npm run build
npx cap sync
npx cap open android
# In Android Studio: Run > Run App
# Check Logcat for FCM token logs
```


