/** @type {import('jest').Config} */
module.exports = {
  preset: 'jest-preset-angular',
  testEnvironment: 'jsdom',
  // modern setup: we call setupZoneTestEnv ourselves
  setupFilesAfterEnv: ['<rootDir>/setup-jest.cjs', '<rootDir>/src/test-setup.ts'],
  transform: {
    '^.+\\.(ts|mjs|js|html)$': 'jest-preset-angular',
  },
  transformIgnorePatterns: ['node_modules/(?!.*\\.m?js$)'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/', '/files/'],
  moduleFileExtensions: ['ts', 'js', 'html'],
};
