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

Enjoy building your APK!
