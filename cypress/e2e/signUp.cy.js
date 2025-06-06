<reference types="cypress" />

function generateUniqueEmail() {
    const timestamp = new Date().getTime();
    return `testuser_${timestamp}@example.com`;
}

describe('Página de Cadastro', () => {
    beforeEach(() => {

        cy.visit('/view/signUp.html');
    });

    it('deve registrar um novo usuário com sucesso', () => {
        const uniqueEmail = generateUniqueEmail();
        const userName = `Test User ${new Date().getTime()}`; // Nome de usuário único
        const password = 'Password123';

        cy.get('input[name="name"]').should('be.visible').type(userName);

        cy.get('input[type="email"]').should('be.visible').type(uniqueEmail);

        cy.get('#password').should('be.visible').type(password);

        cy.contains('button', 'Cadastrar').should('be.visible').click();


        cy.url().should('include', '/view/login.html');
        cy.title().should('eq', 'Help Desk - Login');
    });

});