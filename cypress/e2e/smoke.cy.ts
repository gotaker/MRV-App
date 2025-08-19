describe('MRV Dashboard (smoke)', () => {
  it('loads the app shell and shows KPIs grid', () => {
    cy.visit('/');
    cy.contains(/Emissions|KPI|Dashboard/i, { matchCase: false }).should('be.visible');
  });
});
