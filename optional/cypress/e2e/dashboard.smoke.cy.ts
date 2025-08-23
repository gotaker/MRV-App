describe('Dashboard smoke', () => {
  it('loads home page', () => {
    cy.visit('/');
    cy.get('body').should('be.visible');
    // Swap with your actual selector/text once UI is loaded:
    // cy.contains('Dashboard');
  });
});
