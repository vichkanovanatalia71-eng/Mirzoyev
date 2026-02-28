import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: '.',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        services: resolve(__dirname, 'services.html'),
        serviceImplantology: resolve(__dirname, 'service-implantology.html'),
        serviceWhitening: resolve(__dirname, 'service-whitening.html'),
        serviceVeneers: resolve(__dirname, 'service-veneers.html'),
        servicePediatric: resolve(__dirname, 'service-pediatric.html'),
        serviceEmergency: resolve(__dirname, 'service-emergency.html'),
        gallery: resolve(__dirname, 'gallery.html'),
        testimonials: resolve(__dirname, 'testimonials.html'),
        team: resolve(__dirname, 'team.html'),
        blog: resolve(__dirname, 'blog.html'),
        blogPost: resolve(__dirname, 'blog-post.html'),
        contacts: resolve(__dirname, 'contacts.html'),
        booking: resolve(__dirname, 'booking.html'),
        thankyou: resolve(__dirname, 'thankyou.html'),
      },
    },
  },
  server: {
    port: 3000,
    open: true,
  },
});
