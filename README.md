# NetWatch — Network Monitoring & Incident Management

Aplicação web de demonstração para acompanhar equipamentos de rede, estações e incidentes técnicos. Construída com JavaScript, Node.js, Express, MySQL, HTML5 e CSS3.

> **Limitação importante:** esta versão utiliza dados de demonstração e simulação de estados. Não consulta routers, switches, antenas ou torres reais. A integração com SNMP/ICMP ou APIs de fabricantes é uma evolução futura.

## Funcionalidades
- Dashboard com total de equipamentos, estado online/offline e disponibilidade calculada.
- CRUD de estações e registo de equipamentos.
- Pesquisa por nome, IP e número de série; filtros por estado.
- Registo e acompanhamento de incidentes com prioridade.
- Simulação de falhas e recuperação para testar o fluxo operacional.
- Autenticação JWT, perfis admin/engineer/viewer e registo de auditoria.
- API REST com consultas SQL parametrizadas.
- Interface responsiva.

## Stack
Frontend: HTML5, CSS3, JavaScript Vanilla. Backend: Node.js, Express.js. Base de dados: MySQL 8+. Segurança: bcryptjs, JWT, Helmet e rate limiting.

## Requisitos
Node.js 20+, MySQL 8+ e npm.

## Instalação
1. Clona o repositório:
   ```bash
   git clone https://github.com/TEU_UTILIZADOR/netwatch.git
   cd netwatch
   ```
2. Instala as dependências:
   ```bash
   npm install
   ```
3. Importa `database/schema.sql` no MySQL:
   ```bash
   mysql -u root -p < database/schema.sql
   ```
4. Copia `.env.example` para `.env` (Windows PowerShell: `Copy-Item .env.example .env`) e configura as credenciais MySQL e um `JWT_SECRET` aleatório com pelo menos 32 caracteres.
5. Insere os dados de demonstração:
   ```bash
   npm run seed
   ```
6. Inicia:
   ```bash
   npm run dev
   ```
7. Abre `http://localhost:3000`.

### Conta local de demonstração
- Email: `admin@netwatch.local`
- Palavra-passe: `NetWatch@2026`

**Não uses estas credenciais em produção.** O seed redefine a palavra-passe de demonstração do administrador sempre que é executado.

## Perfis
- `admin`: acesso geral e execução da simulação.
- `engineer`: gestão de estações/equipamentos e estados.
- `viewer`: consulta.

## Estrutura
```text
netwatch/
├── database/       # schema e dados iniciais
├── docs/           # documentação da arquitectura e API
├── public/         # frontend HTML/CSS/JS
├── src/
│   ├── config/     # ligação MySQL
│   ├── controllers/# lógica HTTP e regras de negócio
│   ├── middleware/ # autenticação, permissões e erros
│   ├── routes/     # endpoints REST
│   ├── services/   # auditoria
│   └── server.js   # configuração Express
├── tests/
├── .env.example
└── package.json
```

## Roadmap
- [ ] Integração SNMP para métricas reais.
- [ ] Verificação ICMP de disponibilidade.
- [ ] Histórico de latência e perda de pacotes.
- [ ] Alertas em tempo real com WebSocket.
- [ ] Gestão de utilizadores na interface.
- [ ] Exportação PDF/CSV e testes de integração.

## Licença
MIT. Ver `LICENSE`.
