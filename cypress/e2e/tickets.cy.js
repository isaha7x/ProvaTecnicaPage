/// <reference types="cypress" />

function generateUniqueEmail() {
    const timestamp = new Date().getTime();
    return `testuser_${timestamp}@example.com`;
}

describe('Página de Tickets', () => {
    const user = {
        email: 'isabela@teste.com',
        password: '1234'
    };

    beforeEach(() => {
        cy.request({
            method: 'POST',
            url: 'http://localhost:3000/logout',
            failOnStatusCode: false
        });

        cy.request('POST', 'http://localhost:3000/login', {
            email: user.email,
            password: user.password
        }).then((response) => {
            expect(response.status).to.be.oneOf([200, 201]);
            expect(response.body).to.eq('Logged in successfully.');
        });

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

        cy.request('POST', 'http://localhost:3000/register', {
            name: `User Ticket ${new Date().getTime()}`,
            email: userEmailForTicket,
            password: '1234'
        }).then((response) => {
            expect(response.status).to.be.oneOf([200, 201]);
        });

        cy.get('.addButton').click();
        cy.wait(500);

        cy.get('.modal').should('be.visible');

        cy.get('.modal input[placeholder="E-mail"]').should('be.visible');


        cy.get('.modal input[type="email"]').should('be.visible').type(userEmailForTicket);
        cy.get('.modal input[type="text"][placeholder="Description"]').should('be.visible').type(ticketDescription);

        cy.get('.modal button').contains('Criar').click();

        cy.get('.modal').should('not.be.visible');
        cy.contains('.card-container', ticketDescription).should('be.visible');
    });

    it('deve filtrar tickets por status "Open"', () => {
        cy.get('.filterContainer select').select('Open');
        cy.wait(500);
    });

    it('deve fazer logout e redirecionar para a página de login', () => {
        cy.contains('button', 'Logout').click();


        cy.visit('/view/login.html');
        cy.url().should('include', '/view/login.html');
        cy.title().should('eq', 'Help Desk - Login');
        cy.get('#user').should('be.visible');
        cy.get('input[type="password"]').should('be.visible');
    });
});