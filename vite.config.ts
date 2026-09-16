import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  appType: 'mpa',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        checkout: path.resolve(__dirname, 'checkout/index.html'),
        success: path.resolve(__dirname, 'success/index.html'),
        thankyou: path.resolve(__dirname, 'thank-you/index.html'),
        pagesThankYou: path.resolve(__dirname, 'pages/thank-you.html'),
        contact: path.resolve(__dirname, 'contact/index.html'),
        pagesContact: path.resolve(__dirname, 'pages/contact.html'),
        pagesContactUs: path.resolve(__dirname, 'pages/contact-us.html'),
      },
    },
  },
  server: {
    // Explicitly configure proxy to forward API requests to backend
    proxy: {
      '/create-payment-intent': {
        target: 'http://localhost:4242',
        changeOrigin: true,
        secure: false,
      },
      '/health': {
        target: 'http://localhost:4242',
        changeOrigin: true,
        secure: false,
      }
    }
  }
});