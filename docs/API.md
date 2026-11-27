# NetWatch REST API

Base URL: `http://localhost:3000/api`. Todas as rotas, excepto login e health, exigem `Authorization: Bearer <token>`.

## Público
- `GET /health` — estado da API.
- `POST /auth/login` — autenticação; corpo `{ "email": "...", "password": "..." }`.

## Dashboard
- `GET /dashboard` — indicadores, equipamentos e incidentes recentes.

## Estações
- `GET /sites`
- `POST /sites` (admin/engineer): `{ "name":"Estação Benfica", "code":"BEN-005", "city":"Belas", "address":"Benfica, Luanda" }`
- `PUT /sites/:id` (admin/engineer)
- `DELETE /sites/:id` (admin)

## Equipamentos
- `GET /devices?status=offline&type=router&search=core`
- `POST /devices` (admin/engineer): `site_id`, `name`, `type`, `manufacturer`, `model`, `ip_address`, `serial_number`, `status`.
- `PUT /devices/:id` (admin/engineer)
- `PATCH /devices/:id/status` (admin/engineer): `{ "status":"offline" }`

Tipos: `router`, `switch`, `antenna`, `server`, `firewall`, `other`. Estados: `online`, `offline`, `maintenance`.

## Incidentes
- `GET /incidents`
- `POST /incidents`: `title`, `description`, `priority`, `site_id`, `device_id`.
- `PATCH /incidents/:id/status`: `{ "status":"in_progress" }`

Prioridades: `low`, `medium`, `high`, `critical`. Estados: `open`, `in_progress`, `resolved`.

## Simulação
- `POST /simulation/run` (admin) — simula falhas e recuperações; os dados não são recolhidos de equipamentos reais.
