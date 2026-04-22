module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  coverageProvider: 'v8',
  collectCoverageFrom: [
    'lib/**/*.ts',
    '!lib/tests/**',
    '!lib/**/*.d.ts',
  ],
};