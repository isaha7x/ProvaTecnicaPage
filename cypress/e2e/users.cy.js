/// <reference types="cypress" />

// Função auxiliar para gerar um email único
function generateUniqueEmail() {
  const timestamp = new Date().getTime();
  return `testuser_${timestamp}@example.com`;
}

describe('Página de Usuários', () => {
  // Credenciais de um usuário de teste válido para login via API
  const user = {
    email: 'isabela@teste.com', // Use um e-mail de um usuário existente no seu users.json
    password: '1234'      // Use a senha correspondente
  };

  beforeEach(() => {
    // Desloga qualquer usuário existente para garantir um estado limpo
    cy.request({
      method: 'POST',
      url: 'http://localhost:3000/logout',
      failOnStatusCode: false
    });

    // Faz login com o usuário de teste
    cy.request('POST', 'http://localhost:3000/login', {
      email: user.email,
      password: user.password
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 201]);
      expect(response.body).to.eq('Logged in successfully.');
    });

    // Visita a página de usuários APÓS o login via API
    cy.visit('/view/user.html');
  });

  // Teste 1: Deve exibir elementos essenciais da página de usuários
  it('deve exibir elementos essenciais da página de usuários', () => {
    cy.get('header').should('be.visible');
    cy.get('#navbar a').contains('Users').should('be.visible').and('have.attr', 'href', '#');
    cy.get('#navbar a').contains('Tickets').should('be.visible').and('have.attr', 'href', './ticket.html');

    // Botão de Logout
    cy.contains('button', 'Logout').should('be.visible');

    // Campo de busca de usuário
    cy.get('.filterContainer input[type="search"]').should('be.visible').and('have.attr', 'placeholder', 'Buscar usuario');

    // Botão de adicionar novo usuário
    cy.get('#addButton').should('be.visible');
    cy.get('#addButton img').should('have.attr', 'src', '../images/add.png');

    // Container dos cards de usuário (pode estar vazio inicialmente)
    cy.get('#user-card-container').should('be.visible');
  });

  // Teste 2: Criar um novo usuário (fluxo positivo)
  it('deve criar um novo usuário com sucesso', () => {
    const userName = `Novo Usuário ${new Date().getTime()}`;
    const userEmail = generateUniqueEmail();

    // 1. Clicar no botão 'Adicionar' para abrir o modal de criação de usuário
    cy.get('#addButton').click();
    cy.wait(500); // Pequeno wait para garantir que o modal apareça

    // 2. Verificar se o modal está visível
    cy.get('#modal').should('be.visible');
    cy.get('#modal .close').should('be.visible'); // Botão de fechar o modal

    // 3. Preencher os campos do formulário no modal
    cy.get('#modal input[name="name"]').should('be.visible').type(userName);
    cy.get('#modal input[name="email"]').should('be.visible').type(userEmail);

    // 4. Clicar no botão 'Criar' dentro do modal
    // Note que o botão tem id="modal-button"
    cy.get('#modal-button').contains('Criar').click();
    cy.wait(500); // Esperar a submissão e atualização da UI

    // 5. Validar o resultado: o modal deve fechar e o novo usuário aparecer na lista
    cy.get('#modal').should('not.be.visible'); // Verifica se o modal fechou

    // Verifica se o usuário recém-criado aparece na lista de cards
    // O usersCard.js provavelmente cria elementos dentro de #user-card-container
    cy.contains('#user-card-container', userName).should('be.visible');
    cy.contains('#user-card-container', userEmail).should('be.visible');
  });

  // Teste 3: Buscar um usuário existente
  it('deve buscar um usuário existente pelo nome', () => {
    // Para testar a busca, precisamos garantir que exista um usuário específico.
    // Vamos criar um usuário de teste via API antes de iniciar a busca.
    const searchUserName = `Usuario Busca ${new Date().getTime()}`;
    const searchUserEmail = generateUniqueEmail();

    cy.request('POST', 'http://localhost:3000/register', {
        name: searchUserName,
        email: searchUserEmail,
        password: 'search_password'
    }).then((response) => {
        expect(response.status).to.be.oneOf([200, 201]);
    });

    // Recarrega a página para que o novo usuário apareça na lista inicial
    cy.visit('/view/user.html');

    // Digita o nome do usuário no campo de busca
    cy.get('.filterContainer input[type="search"]').type(searchUserName);

    // Aguarda um curto período para o filtro ser aplicado (se for assíncrono)
    cy.wait(500);

    // Verifica se o usuário buscado está visível
    cy.contains('#user-card-container', searchUserName).should('be.visible');

    // Verifica se outros usuários (que não correspondem à busca) não estão visíveis
    // Isso é mais complexo e pode exigir uma lógica de iteração sobre os cards.
    // Por enquanto, apenas confirmamos que o buscado aparece.
  });

  // Teste 4: Fazer logout da página de usuários
  it('deve fazer logout e redirecionar para a página de login', () => {
    cy.contains('button', 'Logout').click();

    // Após o clique no logout, o sistema deve redirecionar para a página de login
    cy.url().should('include', '/view/login.html');
    cy.title().should('eq', 'Help Desk - Login');
    // Validar que a página de login está pronta para receber credenciais
    cy.get('#user').should('be.visible');
    cy.get('input[type="password"]').should('be.visible');
  });
});