import { defineConfig } from 'vitest/config';

export default defineConfig({
  clearScreen: true,
  test: {
    environment: 'jsdom',
    globals: true,
    snapshotFormat: {
      printBasicPrototype: true,
    },
    setupFiles: ['./vitest/setupTests.ts'],
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
        useAtomics: !!process.env['CI'],
      },
    },
  },
});
