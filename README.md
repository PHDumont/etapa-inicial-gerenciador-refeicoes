# Meal Tracker

Gerenciador de refeições: cadastro de alimentos, diário por data, resumo calórico e API REST com MongoDB.

## Descrição do Problema

Muitas pessoas não conseguem manter um controle consistente da alimentação diária. Isso dificulta a compreensão do consumo calórico e prejudica objetivos como emagrecimento, ganho de massa ou simplesmente hábitos mais saudáveis.

## Proposta da Solução

A aplicação permite registrar refeições com base em alimentos previamente cadastrados, calcular automaticamente as calorias consumidas e consultar o total por data.

## Público-alvo

- Pessoas iniciando controle alimentar
- Usuários que desejam simplicidade no registro de refeições

## Funcionalidades

- Cadastro, edição e exclusão de alimentos (catálogo)
- Registro de refeições com múltiplos alimentos e quantidades em gramas
- Diário por data com expansão de refeições e edição de itens
- Remoção de itens de refeição e exclusão de refeições
- Painel de resumo do dia (calorias por refeição)
- API com compressão HTTP e consultas otimizadas (`.lean()`, índice em `date`)

## Tecnologias Utilizadas

- **Backend:** Node.js, Express, Mongoose, MongoDB
- **Frontend:** TypeScript, React, Vite, React Router, Axios, Day.js
- **Ferramentas:** Yarn, Docker Compose, ESLint (frontend)

## Pré-requisitos

- [Node.js](https://nodejs.org/) (versão LTS recomendada)
- [Yarn](https://yarnpkg.com/)
- [Docker](https://www.docker.com/) e Docker Compose (para subir o MongoDB localmente)

O backend espera MongoDB em `localhost:27017`, com usuário e senha `admin` / `admin`, alinhados ao `docker-compose.yml` do repositório.

## Instalação

Use **Yarn** em backend e frontend (o repositório versiona `yarn.lock`; não use `npm install` para evitar `package-lock.json` conflitante).

1. Clone o repositório:

   ```bash
   git clone <URL_DO_REPOSITORIO>
   cd etapa-inicial-gerenciador-refeicoes
   ```

2. Backend — dependências:

   ```bash
   cd backend
   yarn install
   ```

3. Frontend — dependências:

   ```bash
   cd ../frontend
   yarn install
   ```

## Banco de dados (Docker)

Na raiz do projeto:

```bash
docker compose up -d
```

Isso sobe o **MongoDB** na porta `27017` e o **mongo-express** em [http://localhost:8080](http://localhost:8080) (usuário/senha do painel: `admin` / `admin`, conforme variáveis no compose).

### Dados iniciais (opcional)

Com o MongoDB no ar e na pasta `backend`:

```bash
yarn seed
```

## Execução

Abra dois terminais.

**Terminal 1 — API (porta 3000):**

```bash
cd backend
yarn dev
```

**Terminal 2 — interface (Vite, porta 5173 por padrão):**

```bash
cd frontend
yarn dev
```

No navegador:

- Diário: [http://localhost:5173/diary](http://localhost:5173/diary)
- Catálogo de alimentos: [http://localhost:5173/food-catalogy](http://localhost:5173/food-catalogy)

O frontend está configurado para chamar a API em `http://localhost:3000` (`axios.defaults.baseURL` em `frontend/src/App.tsx`).

**Produção (build estático do frontend):**

```bash
cd frontend
yarn build
yarn preview   # opcional: servir a pasta dist
```

## Como Usar

1. Cadastre alimentos (nome, calorias por grama e categoria).
2. No diário, escolha a data, crie refeições e adicione alimentos com quantidade em gramas.
3. Use o painel lateral para ver o resumo calórico do dia atual.
4. Edite quantidades ou remova itens/refeições conforme necessário.

## Lint

Apenas o frontend possui script de lint:

```bash
cd frontend
yarn lint
```

## Estrutura do Projeto

```
etapa-inicial-gerenciador-refeicoes/
├── backend/          # API Express + Mongoose
├── frontend/         # React + Vite + TypeScript
├── docker-compose.yml
└── data-container/   # volumes Docker (gitignored em parte; ver .gitignore)
```

![Etapa Inicial](https://github.com/user-attachments/assets/535e2905-64a0-4e5e-b7ae-a6b0ff2d4ec6)

## Versão

1.0.0

## Autor

Pedro Dumont
