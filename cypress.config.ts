import { defineConfig } from 'cypress';

export default defineConfig({
  video: false,
  retries: 1,
  e2e: {
    baseUrl: process.env.CYPRESS_baseUrl || 'http://localhost:4200',
    specPattern: 'cypress/e2e/**/*.cy.{ts,tsx,js,jsx}',
    supportFile: 'cypress/support/e2e.ts',
  },
});
