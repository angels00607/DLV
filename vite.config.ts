import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // A dedicated test hostname serves the app at its root, never under the live Pages origin.
  base: process.env.VITE_DLV_TEST_MODE === 'true' ? '/' : '/DLV/',
  build: {
    target: 'es2022',
    sourcemap: true,
    outDir: process.env.VITE_DLV_TEST_MODE === 'true' ? 'dist-test' : 'docs',
  },
});
