import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  clearScreen: true,
  test: {
    environment: 'jsdom',
    setupFiles: [fileURLToPath(new URL('./vitest/setupTests.ts', import.meta.url))],
    testTimeout: 15_000,
    restoreMocks: true,
    unstubGlobals: true,
    globals: true,
    fileParallelism: false,
    snapshotFormat: {
      printBasicPrototype: true,
    },
    setupFiles: ['../../vitest/setupTests.ts'],
    coverage: {
      provider: 'istanbul',
      include: ['**/src/**'],
      exclude: ['**/docs/**'],
    },
    maxWorkers: 1,
    minWorkers: 1,
  },
});
