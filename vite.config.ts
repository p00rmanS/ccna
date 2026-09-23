import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

declare const process: { env: Record<string, string | undefined> };

export default defineConfig({
  plugins: [react()],
  server: { port: Number(process.env.PORT) || 5173, strictPort: true },
  test: { environment: 'node', include: ['src/**/*.test.ts'] },
});
