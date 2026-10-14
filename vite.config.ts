import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// GitHub Pages serves project sites below /<repository-name>/. Set VITE_BASE_PATH
// to that path in repository variables, or use '/' for a user/org site.
export default defineConfig({ plugins: [react()], base: process.env.VITE_BASE_PATH || '/regression-explorer/' });
