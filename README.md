# EcoJourney - Backend

API REST desenvolvida para o aplicativo EcoJourney, uma solução que ajuda usuários a monitorar e reduzir sua pegada de carbono por meio do registro de hábitos e metas sustentáveis.

---

## Objetivo

Criar uma plataforma simples, segura e eficiente para:

- Registrar hábitos como consumo de carne, combustível e energia.
- Acompanhar metas diárias sustentáveis.
- Calcular a pegada de carbono estimada.
- Gerar sugestões de ações sustentáveis usando IA (Google Gemini).
- Fornecer autenticação segura via JWT.

---

## Tecnologias Utilizadas

- **Node.js** (ambiente de execução)
- **Express.js** (framework para API REST)
- **Knex.js** (query builder para SQL)
- **MySQL** (banco de dados relacional)
- **JWT** (autenticação baseada em token)
- **Dotenv** (variáveis de ambiente)
- **Helmet + CORS** (segurança)
- **Axios** (requisições HTTP para IA)

---

## Como Instalar e Executar:

- 1. Clone o repositório:

git clone https://github.com/giovanamuniz/ecojourney-backend.git
cd ecojourney-backend

- 2. Instale as dependências: 

npm install 

- 3. Configure o ambiente:

Crie um arquivo .env com as seguintes variáveis:

PORT=4040
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=eco_journey
JWT_SECRET=sua_chave_secreta
GEMINI_API_KEY=sua_chave_api_google


- 4. Execute as migrations do banco:

npx knex migrate:latest

- 5. Inicie o servidor:

npm start

---

## Contribuição: 

Sinta-se à vontade para enviar pull requests, abrir issues ou sugerir melhorias.
Este projeto é acadêmico, mas com potencial de impacto real na educação ambiental.

## Licença: 

Projeto de código aberto para fins educacionais.
