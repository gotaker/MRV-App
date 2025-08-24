/** @type {import('jest').Config} */
module.exports = {
  preset: 'jest-preset-angular',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.cjs', '<rootDir>/src/test-setup.ts'],
   transform: {
    '^.+\\.(ts|mjs|js)$': [
      'ts-jest',
      { tsconfig: 'tsconfig.spec.json', isolatedModules: true }
    ],
  },
  transformIgnorePatterns: ['node_modules/(?!.*\\.m?js$)'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/', '/files/'],
  moduleFileExtensions: ['ts', 'js', 'html'],

// ...existing config
  collectCoverage: true,
  passWithNoTests: true,
  coverageReporters: ['text', 'lcov'],

};
