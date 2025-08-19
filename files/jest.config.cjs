/** @type {import('jest').Config} */
module.exports = {
  preset: 'jest-preset-angular',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  testMatch: ['**/?(*.)+(spec).ts'],
  moduleFileExtensions: ['ts', 'html', 'js'],
  transform: {
    '^.+\\.(ts|html)$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json', stringifyContentPathRegex: '\\.html$' }],
    '^.+\\.(mjs|js)$': 'babel-jest'
  },
  transformIgnorePatterns: [
    'node_modules/(?!.*\\.m?js$)',
  ],
};
