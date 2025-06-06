/// <reference types="cypress" />

describe('Página de Login', () => {
    beforeEach(() => {

        cy.visit('/view/login.html');
    });

    it('deve exibir o título correto da página de login', () => {
        cy.title().should('eq', 'Help Desk - Login');
    });

    it('deve exibir os campos de e-mail e senha', () => {
        cy.get('#user').should('be.visible'); // Corrigido para ID "user"
        cy.get('input[type="password"]').should('be.visible'); // Seletor por tipo
    });

    it('deve exibir o botão de login', () => {
        cy.contains('button', 'Logar').should('be.visible');
    });

    it('deve exibir o link para cadastro', () => {
        cy.contains('a', 'Registrar-se').should('be.visible');
    });
});