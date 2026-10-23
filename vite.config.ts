import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

declare const process: { env: Record<string, string | undefined> };

export default defineConfig({
  // GitHub Pages serves the app from a sub-path; the deploy workflow sets VITE_BASE=/ccna/.
  base: process.env.VITE_BASE ?? '/',
  plugins: [react()],
  server: { port: Number(process.env.PORT) || 5173, strictPort: true },
  test: { environment: 'node', include: ['src/**/*.test.ts'] },
});
