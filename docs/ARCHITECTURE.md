# Arquitectura e explicação dos módulos

## Frontend (`public/`)
- `index.html`: páginas, navegação, formulários e componentes.
- `css/styles.css`: identidade visual, componentes e layout responsivo.
- `js/app.js`: sessão, chamadas Fetch API, renderização e eventos.

O frontend nunca acede directamente à base de dados: comunica com a API REST.

## Backend (`src/`)
- `server.js`: configura Express, Helmet, CORS, JSON, logs, rate limit e ficheiros estáticos.
- `config/database.js`: pool de ligações MySQL.
- `routes/index.js`: associa endpoints aos controllers e aplica autenticação/permissões.
- `middleware/auth.js`: valida JWT e perfis de acesso.
- `middleware/errors.js`: tratamento centralizado de erros e rotas inexistentes.
- `controllers/`: autenticação, dashboard, estações, equipamentos, incidentes e simulação.
- `services/audit.js`: regista acções importantes para rastreabilidade.

## Base de dados (`database/`)
- `schema.sql`: tabelas, chaves estrangeiras, enums e índices.
- `seed.js`: administrador local e dados fictícios para testes.

## Fluxo: registar equipamento
1. O utilizador preenche o formulário.
2. O browser envia `POST /api/devices` com JSON e token JWT.
3. O middleware valida a sessão e o perfil.
4. O controller valida os campos.
5. O MySQL recebe uma query parametrizada.
6. A acção é registada no audit log.
7. A API devolve JSON e o frontend actualiza a lista.

## Simulação
`POST /api/simulation/run` altera aleatoriamente estados de equipamentos e cria eventos/incidentes fictícios. Não efectua ping, SNMP, nem qualquer comunicação com hardware.
