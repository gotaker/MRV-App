module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(ts|mjs|js|html)$': [
      'ts-jest',
      { tsconfig: '<rootDir>/tsconfig.spec.json', useESM: true }
    ]
  },
  moduleFileExtensions: ['ts', 'html', 'js', 'json', 'mjs'],
  testMatch: ['**/*.spec.ts']
};
