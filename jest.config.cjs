/** @type {import('jest').Config} */
module.exports = {
  preset: 'jest-preset-angular',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  globalSetup: 'jest-preset-angular/global-setup',
  testMatch: ['**/?(*.)+(spec).ts'],
  moduleFileExtensions: ['ts', 'html', 'js'],
};
