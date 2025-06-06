const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://127.0.0.1:5500', // Esta é a URL padrão do Live Server para a raiz do seu projeto
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});