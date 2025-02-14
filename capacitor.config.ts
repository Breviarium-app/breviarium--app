import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.breviarium.app',
  appName: 'Breviarium',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
