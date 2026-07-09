import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import {
  configDefaults,
  coverageConfigDefaults,
  defineConfig,
} from 'vitest/config';

export default defineConfig(({}) => ({
  plugins: [react(), tsconfigPaths()],
  test: {
    globals: true,
    environment: 'jsdom',
    exclude: [...configDefaults.exclude, 'vitest.global-setup.ts'],
    globalSetup: ['./vitest.global-setup.ts'],
    setupFiles: ['./vitest.setup.ts'],
    coverage: {
      enabled: false, // Will be enabled using CLI args
      provider: 'istanbul',
      include: ['**/*.ts', '**/*.tsx'],
      exclude: ['**/*.stories.tsx', ...coverageConfigDefaults.exclude],
      reporter: ['text-summary', 'lcov', 'cobertura'],
      thresholds: {
        statements: Number(
          process.env.COMPONENT_UI_STATEMENTS_TEST_COVERAGE ?? 0
        ),
        branches: Number(process.env.COMPONENT_UI_BRANCHES_TEST_COVERAGE ?? 0),
        functions: Number(
          process.env.COMPONENT_UI_FUNCTIONS_TEST_COVERAGE ?? 0
        ),
        lines: Number(process.env.COMPONENT_UI_LINES_TEST_COVERAGE ?? 0),
      },
    },
  },
}));
