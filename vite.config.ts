import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Custom plugin to rewrite clean URLs to corresponding HTML files in dev server
function cleanUrlsPlugin() {
  return {
    name: 'clean-urls-middleware',
    configureServer(server: any) {
      server.middlewares.use((req: any, _res: any, next: any) => {
        if (!req.url) return next();
        const [urlPath, query] = req.url.split('?');
        const qs = query ? `?${query}` : '';

        if (urlPath === '/checkout' || urlPath === '/checkout/') {
          req.url = '/checkout/index.html' + qs;
        } else if (urlPath === '/success' || urlPath === '/success/') {
          req.url = '/success/index.html' + qs;
        } else if (urlPath === '/thank-you' || urlPath === '/thank-you/') {
          req.url = '/thank-you/index.html' + qs;
        } else if (urlPath === '/contact' || urlPath === '/contact/') {
          req.url = '/contact/index.html' + qs;
        } else if (urlPath.startsWith('/pages/') && !urlPath.endsWith('.html')) {
          req.url = urlPath + '.html' + qs;
        } else if (urlPath.startsWith('/products/') && !urlPath.endsWith('.html')) {
          req.url = urlPath + '.html' + qs;
        }
        next();
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), cleanUrlsPlugin()],
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