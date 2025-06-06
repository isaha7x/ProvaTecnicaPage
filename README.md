# Como Rodar o Projeto (Aplicação e Testes)

Siga os passos abaixo para configurar e executar a aplicação e os testes na sua máquina.

---

## Pré-requisitos

- Ter o **Node.js** e o **npm** instalados.

---

## 1. Clonar o Repositório

Clone o repositório e navegue até a pasta do projeto:

```bash
git clone https://github.com/SeuUsuario/helpdeskcypresstest.git
cd helpdeskcypresstest

## 2. Instale as dependências necessárias:
npm install


## 3. Iniciar o Servidor Backend (JSON Server)
Este comando iniciará o JSON Server, que simula o backend da aplicação usando os arquivos .json da pasta data/.
npm run server
O servidor estará disponível em:
http://localhost:3000


## 4. Iniciar o Servidor Frontend (Live Server)
Utilize a extensão Live Server no VS Code (ou qualquer outro servidor HTTP simples).

Abra a pasta view/ com o Live Server e acesse os seguintes caminhos no navegador:

🔐 Login: http://127.0.0.1:5500/view/login.html

👤 Usuários: http://127.0.0.1:5500/view/user.html (após login)

🎫 Tickets: http://127.0.0.1:5500/view/ticket.html (após login)

## 5.  Rodar os Testes com Cypress
Com o backend rodando (npm run server) e o frontend aberto (via Live Server), abra um novo terminal na raiz do projeto e execute:

bash
Copiar
Editar
npm run test
Esse comando abrirá o Cypress Test Runner, onde será possível selecionar e rodar os testes desejados, como:

users.cy.js

tickets.cy.js

