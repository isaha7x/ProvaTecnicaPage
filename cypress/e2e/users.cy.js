<reference types="cypress" />

function generateUniqueEmail() {
    const timestamp = new Date().getTime();
    return `testuser_${timestamp}@example.com`;
}

describe('Página de Usuários', () => {
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

        cy.visit('/view/user.html');
    });

    it('deve exibir elementos essenciais da página de usuários', () => {
        cy.get('header').should('be.visible');
        cy.get('#navbar a').contains('Users').should('be.visible').and('have.attr', 'href', '#');
        cy.get('#navbar a').contains('Tickets').should('be.visible').and('have.attr', 'href', './ticket.html');

        cy.contains('button', 'Logout').should('be.visible');

        cy.get('.filterContainer input[type="search"]').should('be.visible').and('have.attr', 'placeholder', 'Buscar usuario');

        cy.get('#addButton').should('be.visible');
        cy.get('#addButton img').should('have.attr', 'src', '../images/add.png');

        cy.get('#user-card-container').should('be.visible');
    });

    it('deve criar um novo usuário com sucesso', () => {
        const userName = `Novo Usuário ${new Date().getTime()}`;
        const userEmail = generateUniqueEmail();

        cy.get('#addButton').click();
        cy.wait(500); /

        cy.get('#modal').should('be.visible');
        cy.get('#modal .close').should('be.visible');

        cy.get('#modal input[name="name"]').should('be.visible').type(userName);
        cy.get('#modal input[name="email"]').should('be.visible').type(userEmail);

        cy.get('#modal-button').contains('Criar').click();
        cy.wait(500);
        cy.get('#modal').should('not.be.visible'); // Verifica se o modal fechou

        cy.contains('#user-card-container', userName).should('be.visible');
        cy.contains('#user-card-container', userEmail).should('be.visible');
    });

    it('deve buscar um usuário existente pelo nome', () => {
        const searchUserName = `Usuario Busca ${new Date().getTime()}`;
        const searchUserEmail = generateUniqueEmail();

        cy.request('POST', 'http://localhost:3000/register', {
            name: searchUserName,
            email: searchUserEmail,
            password: 'search_password'
        }).then((response) => {
            expect(response.status).to.be.oneOf([200, 201]);
        });

        cy.visit('/view/user.html');

        cy.get('.filterContainer input[type="search"]').type(searchUserName);

        cy.wait(500);

        cy.contains('#user-card-container', searchUserName).should('be.visible');

    });

    it('deve fazer logout e redirecionar para a página de login', () => {
        cy.contains('button', 'Logout').click();

        cy.url().should('include', '/view/login.html');
        cy.title().should('eq', 'Help Desk - Login');
        cy.get('#user').should('be.visible');
        cy.get('input[type="password"]').should('be.visible');
    });
});