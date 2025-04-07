describe('Perform register action Page', () => {


    it('Register a new user', () => {
        cy.visit('http://localhost:5173/register');

        cy.get('input#username', { timeout: 10000 }).type('Cypress User');

        cy.get('input#email', { timeout: 10000 }).type('cypress@user.com');

        cy.get('input#password', { timeout: 10000 }).type('123456789');

        cy.get('form button', { timeout: 10000 }).click();

        cy.get(".alert").should('be.visible').contains("Inscription Ok")
    });
});
