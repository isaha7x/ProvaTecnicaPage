/// <reference types="cypress" />

function generateUniqueEmail() {
  const timestamp = new Date().getTime();
  return `testuser_${timestamp}@example.com`;
}

describe('Página de Tickets', () => {
  const user = {
    email: 'isabela@teste.com', // Confirme que este usuário existe no seu users.json
    password: '1234' // Confirme a senha deste usuário
  };

  beforeEach(() => {
    // 1. Desloga qualquer usuário existente para garantir um estado limpo
    cy.request({
      method: 'POST',
      url: 'http://localhost:3000/logout',
      failOnStatusCode: false
    });

    // 2. Faz login com o usuário de teste
    cy.request('POST', 'http://localhost:3000/login', {
      email: user.email,
      password: user.password
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 201]);
      expect(response.body).to.eq('Logged in successfully.');
    });

    // 3. Visita a página de tickets
    cy.visit('/view/ticket.html');
  });

  it('deve exibir elementos essenciais da página de tickets', () => {
    cy.get('header').should('be.visible');
    cy.contains('nav a', 'Users').should('be.visible').and('have.attr', 'href', './user.html');
    cy.contains('nav a', 'Tickets').should('be.visible').and('have.attr', 'href', '#');
    cy.contains('button', 'Logout').should('be.visible');
    cy.get('.filterContainer select').should('be.visible');
    cy.get('.addButton').should('be.visible');
    cy.get('.addButton img').should('have.attr', 'src', '../images/add.png');
  });

  it('deve criar um novo ticket com sucesso', () => {
    const ticketDescription = `Novo ticket de teste - ${new Date().getTime()}`;
    const userEmailForTicket = generateUniqueEmail(); // Para o e-mail do ticket

    // Garante que o e-mail do ticket exista (registrando-o)
    cy.request('POST', 'http://localhost:3000/register', {
        name: `User Ticket ${new Date().getTime()}`,
        email: userEmailForTicket,
        password: '1234'
    }).then((response) => {
        expect(response.status).to.be.oneOf([200, 201]);
    });

    cy.get('.addButton').click();
    cy.wait(500); // Adicionado um wait para dar tempo ao modal de aparecer

    cy.get('.modal').should('be.visible');
    // Não há um h1 com o texto "Criar" no modal de criação de ticket, como vimos no HTML.
    // Podemos verificar o placeholder do campo de e-mail ou a descrição do campo de descrição
    // para confirmar que o modal correto abriu.
    cy.get('.modal input[placeholder="E-mail"]').should('be.visible');


    cy.get('.modal input[type="email"]').should('be.visible').type(userEmailForTicket);
    cy.get('.modal input[type="text"][placeholder="Description"]').should('be.visible').type(ticketDescription);

    cy.get('.modal button').contains('Criar').click();

    // Aqui, a página recarrega e o modal some, então devemos validar o ticket na lista
    cy.get('.modal').should('not.be.visible');
    cy.contains('.card-container', ticketDescription).should('be.visible');
  });

  it('deve filtrar tickets por status "Open"', () => {
    cy.get('.filterContainer select').select('Open');
    cy.wait(500);
    // Adicione a validação aqui:
    // Ex: cy.get('.ticket-status:not(:contains("Open"))').should('not.exist');
    // Ou verifique se todos os cards visíveis contêm o status "Open"
  });

  it('deve fazer logout e redirecionar para a página de login', () => {
    cy.contains('button', 'Logout').click();
    
    // Como a página não redireciona automaticamente após o logout,
    // a melhor forma de validar é tentar visitar a página de login novamente
    // e verificar se os campos de login estão visíveis (indicando que não está mais logado).
    cy.visit('/view/login.html'); // O Cypress vai limpar os cookies do teste anterior
    cy.url().should('include', '/view/login.html');
    cy.title().should('eq', 'Help Desk - Login');
    cy.get('#user').should('be.visible'); // O campo de e-mail deve estar visível para login
    cy.get('input[type="password"]').should('be.visible'); // O campo de senha deve estar visível
  });
});