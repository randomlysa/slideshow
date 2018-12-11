describe('The admin section', function() {
  it('should redirect from /admin to /login when not signed in', function() {
    cy.visit('http://localhost:3000/admin/test');
    cy.location('pathname').should('eq', '/login');
  });

  it('should fail when using incorrect username / password', function() {
    cy.visit('http://localhost:3000/admin/test');
    cy.get('[data-cy=usernameLogin]')
      .type('abc')
      .get('[data-cy=passwordLogin]')
      .type('def')
      .get('[data-cy=loginForm]')
      .submit();
    // seems my login doesn't throw an error so expect the page to still be
    // /login
    cy.location('pathname').should('eq', '/login');
  });

  it('should let me log in', function() {
    cy.visit('http://localhost:3000/login/test')
      .get('[data-cy=usernameLogin]')
      .type('test')
      .get('[data-cy=passwordLogin]')
      .type('test')
      .get('[data-cy=loginForm]')
      .submit();
    cy.location('pathname').should('eq', '/admin');
  });
});
