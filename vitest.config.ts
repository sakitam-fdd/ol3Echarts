import { defineConfig } from 'vitest/config';

export default defineConfig({
  clearScreen: true,
  test: {
    // environment: 'jsdom',
    testTimeout: 15_000,
    browser: {
      name: 'chromium',
      provider: 'playwright',
      enabled: true,
      headless: true,
      fileParallelism: false,
      screenshotFailures: false,
    },
    restoreMocks: true,
    unstubGlobals: true,
    globals: true,
    snapshotFormat: {
      printBasicPrototype: true,
    },
    setupFiles: ['../../vitest/setupTests.ts'],
    coverage: {
      provider: 'istanbul',
      include: ['**/src/**'],
      exclude: [
        '**/docs/**',
      ],
      // reporter: ['lcov', 'html'],
    },
    poolOptions: {
      threads: {
        minThreads: 0,
        maxThreads: 1,
        useAtomics: !!process.env['CI'],
      },
    },
  },
});
