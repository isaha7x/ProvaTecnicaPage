/// <reference types="cypress" />

// Função auxiliar para gerar um email único
function generateUniqueEmail() {
  const timestamp = new Date().getTime();
  return `testuser_${timestamp}@example.com`;
}

describe('Página de Cadastro', () => {
  beforeEach(() => {
    // Visita a página de cadastro diretamente
    // Alternativamente, você poderia ir para login.html e clicar em "Registrar-se"
    cy.visit('/view/signUp.html');
  });

  it('deve registrar um novo usuário com sucesso', () => {
    const uniqueEmail = generateUniqueEmail();
    const userName = `Test User ${new Date().getTime()}`; // Nome de usuário único
    const password = 'Password123';

    // Preenche o campo Nome Completo
    cy.get('input[name="name"]').should('be.visible').type(userName);

    // Preenche o campo Email
    cy.get('input[type="email"]').should('be.visible').type(uniqueEmail);

    // Preenche o campo Senha (usando o ID fornecido no HTML)
    cy.get('#password').should('be.visible').type(password);

    // Clica no botão "Cadastrar"
    cy.contains('button', 'Cadastrar').should('be.visible').click();

    // VALIDAÇÃO PÓS-CADASTRO
    // Aqui, precisamos validar o que acontece após o cadastro bem-sucedido.
    // O README.md não especifica, mas é comum:
    // 1. Ser redirecionado para a página de login.
    // 2. Exibir uma mensagem de sucesso na própria página.

    // Tentativa 1: Verificar se foi redirecionado para a página de login.html
    // cy.url().should('include', '/view/login.html');
    // Se for redirecionado, o título da página de login também pode ser verificado.
    // cy.title().should('eq', 'Help Desk - Login');

    // Tentativa 2: Se não houver redirecionamento imediato e uma mensagem de sucesso aparecer,
    // você precisaria de um seletor para essa mensagem. Ex:
    // cy.get('.success-message').should('contain', 'Usuário registrado com sucesso');

    // Pelo seu HTML, o comportamento padrão ao clicar em "Cadastrar" (sem um action no form)
    // pode ser apenas chamar a função signUp(event) do JS.
    // Vamos presumir o redirecionamento para login.html, que é o mais comum para esta estrutura.
    cy.url().should('include', '/view/login.html'); // Verifica se a URL agora contém login.html
    cy.title().should('eq', 'Help Desk - Login'); // E se o título é da página de login
  });

  // Você pode adicionar mais testes aqui para cenários negativos, por exemplo:
  // it('não deve registrar usuário com e-mail já existente', () => { ... });
  // it('não deve registrar usuário com campos vazios', () => { ... });
});