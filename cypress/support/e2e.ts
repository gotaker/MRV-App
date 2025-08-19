// cypress/e2e/smoke.cy.ts
describe('MRV Dashboard', () => {
  it('shows KPIs', () => {
    cy.intercept('GET', '**/kpis', [{ id: 1, name: 'Total Emissions (tCO2e)', value: 123 }]);
    cy.visit('/');
    cy.contains('Total Emissions').should('be.visible');
    cy.contains('123').should('be.visible');
  });
});
