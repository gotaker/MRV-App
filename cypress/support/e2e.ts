// Runs before each test file
// Keep console noise down from 3rd-party libs
Cypress.on('uncaught:exception', (_err) => {
  // returning false here prevents Cypress from
  // failing the test on uncaught exceptions from the app under test
  return false;
});
