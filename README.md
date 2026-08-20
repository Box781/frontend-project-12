### Hexlet tests and linter status:
[![Actions Status](https://github.com/Box781/frontend-project-12/actions/workflows/hexlet-check.yml/badge.svg)](https://github.com/Box781/frontend-project-12/actions)

## Описание

Упрощённый аналог Slack — Hexlet Chat. React-приложение с авторизацией, каналами, сообщениями в реальном времени (WebSocket) и коллектором ошибок.

**Деплой:** https://frontend-project-12-lm0v.onrender.com/

## Локальная установка и запуск

Требования: Node.js, npm, make.

```bash
git clone https://github.com/Box781/frontend-project-12.git
cd frontend-project-12
make install
make build
make start
```

Приложение будет доступно по адресу: http://localhost:5001

### Разработка фронтенда

Для hot reload отдельно запустите Vite:

```bash
cd frontend
npm run dev
```

Фронтенд откроется на http://localhost:5002 (API и WebSocket проксируются на бэкенд на порту 5001 — для этого нужен запущенный `make start` в корне или другой экземпляр chat-server).
