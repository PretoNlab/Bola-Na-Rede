import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.bolanarede.manager',
  appName: 'Bolanarede Manager',
  webDir: '.', // Alterado para ponto para ler da raiz se você não usar uma pasta dist
  server: {
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#0f172a",
      showSpinner: false,
      androidScaleType: "CENTER_CROP",
    }
  }
};

export default config;