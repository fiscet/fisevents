module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  // Exclude Playwright E2E tests — they must be run via `npx playwright test`
  testPathIgnorePatterns: ['/node_modules/', '/e2e/'],
  coverageProvider: 'v8',
  collectCoverageFrom: [
    'lib/**/*.ts',
    '!lib/tests/**',
    '!lib/**/*.d.ts',
  ],
};