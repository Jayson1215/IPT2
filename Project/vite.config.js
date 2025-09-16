import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: [
                'resources/sass/app.scss',          // Your main SCSS
                'resources/js/app.js',              // Main JS
                'resources/js/home.js',             // Home React page
                'resources/js/Profile.jsx', // Profile React page (renamed .jsx)
            ],
            refresh: true,
        }),
        react(), // React plugin handles JSX
    ],
});
