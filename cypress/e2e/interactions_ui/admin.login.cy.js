describe('Admin', () => {


    it('Login as admin ', () => {
        cy.visit('http://localhost:5173/login');


        cy.get('input#email', { timeout: 10000 }).type('admin@admin.fr');

        cy.get('input#password', { timeout: 10000 }).type('123456789');

        cy.get('form button', { timeout: 10000 }).click();
    });

/*
       // TODO: FIX BY ADDING JWT TOKEN TO THE LOCALSTORAGE
        it('paginate page 1 to page 2', async () => {
          const response = await cy.request('http://localhost:3000/api/v1/auth/login', {
              email : 'admin@admin.fr',
              password: '123456789'
          })
           const token =   response.body.token
            localStorage.setItem('token', token)
          cy.visit('http://localhost:5173/admin/dashboard');
          cy.get(".join a").eq(1).click()
          cy.get(".join a").eq(1).should('have.class', 'active')
        });

 */
});
