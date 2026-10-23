import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.breviarium.app',
  appName: 'Breviarium',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    LocalNotifications: {
      // Monochrome logo in res/drawable-*dpi/ic_stat_breviarium.png, tinted with the app's primary color
      smallIcon: 'ic_stat_breviarium',
      iconColor: '#be4747'
    }
  }
};

export default config;
