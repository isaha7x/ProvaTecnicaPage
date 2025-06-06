/// <reference types="cypress" />

describe('Página de Login', () => {
  beforeEach(() => {
    // Visita a página de login antes de cada teste neste bloco
    // A baseUrl já está configurada em cypress.config.js, então cy.visit('/view/login.html') é o correto
    cy.visit('/view/login.html');
  });

  it('deve exibir o título correto da página de login', () => {
    // CORREÇÃO: Ajuste para o título EXATO encontrado no HTML
    cy.title().should('eq', 'Help Desk - Login');
  });

  it('deve exibir os campos de e-mail e senha', () => {
    // CORREÇÃO: Usando o ID correto para o e-mail e o type para a senha (já que não tem ID)
    cy.get('#user').should('be.visible'); // Corrigido para ID "user"
    cy.get('input[type="password"]').should('be.visible'); // Seletor por tipo
  });

  it('deve exibir o botão de login', () => {
    // CORREÇÃO: Usando cy.contains para encontrar o botão pelo texto visível
    cy.contains('button', 'Logar').should('be.visible');
  });

  it('deve exibir o link para cadastro', () => {
    // CORREÇÃO: Usando cy.contains para encontrar o link pelo texto visível
    cy.contains('a', 'Registrar-se').should('be.visible');
  });
});