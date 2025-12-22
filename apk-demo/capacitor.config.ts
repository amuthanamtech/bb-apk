import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.apkdemo.app',
  appName: 'Best Bazaar',
  webDir: 'out',
  server: {
    url: 'https://bestbazaar.in',
    cleartext: true,
    androidScheme: 'https'
  }
};

export default config;