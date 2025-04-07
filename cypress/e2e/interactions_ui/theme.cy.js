
/// <reference types="cypress" />


describe('Theme ', () => {
    beforeEach(() => {
        cy.visit('http://localhost:5173/register');
    });

    it('changer de theme', () => {
        // Vérifier que le select est visible
        cy.get('.navbar select', { timeout: 10000 }).should('be.visible');
        // Sélectionner un thème spécifique (exemple : 'cyberpunk')
        cy.get('.navbar select').select('cyberpunk');
        // Vérifier que l'attribut data-theme de <html> a changé
        cy.get('html').should('have.attr', 'data-theme', 'cyberpunk');
    });



});


