# sh>ltr

**Share your terminal, instantly.**

[![npm](https://img.shields.io/npm/v/@sheltr_/agent?color=7c6af7&label=npm)](https://www.npmjs.com/package/@sheltr_/agent)
[![npm downloads](https://img.shields.io/npm/dm/@sheltr_/agent?color=3dd68c)](https://www.npmjs.com/package/@sheltr_/agent)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Live:** https://sheltr-app.vercel.app  
**npm:** https://www.npmjs.com/package/@sheltr_/agent  
**GitHub:** https://github.com/Prathamesh0901/sheltr

---

Run one command. Get two links — one to control, one to watch. No SSH, no screen sharing, no installs on the other end.

```bash
SHELTR_API_KEY=your-key npx @sheltr_/agent
```

> Sign up at [sheltr-app.vercel.app](https://sheltr-app.vercel.app) to get your API key.

---

## How it works

Sheltr uses a relay architecture — your shell stays on your machine, the server only passes bytes.

```
Your machine   →  sheltr agent  →  WebSocket (outbound)
                                         ↕
Sheltr server  →  relay  →  session manager  →  recording
                                         ↕
Browser A  (controller)  →  xterm.js  →  full control
Browser B  (viewer)      →  xterm.js  →  read only
```

When you run the agent, it spawns a real shell via node-pty and connects outward to the relay server. The server assigns a session ID and returns two URLs. Anyone who opens those URLs gets a browser terminal — no install required on their end.

---

## Quick start

**1. Sign up at [sheltr-app.vercel.app](https://sheltr-app.vercel.app) and generate an API key from your dashboard**

**2. Run the agent on your machine**
```bash
SHELTR_API_KEY=your-key npx @sheltr_/agent
```

**3. Your browser opens automatically with the controller URL — share the viewer link with anyone**

---

## Features

- **Shareable links** — two URLs per session, controller and viewer. No accounts needed for viewers.
- **Role-based access** — viewers watch but can't type. Enforced server-side, not just client-side.
- **WebSocket auth** — controller connections validated against session tokens server-side.
- **Session replay** — every session recorded automatically. Get a replay link with full playback controls when it ends.
- **Replay controls** — play/pause, 0.5x/1x/2x speed, progress bar.
- **Auto-reconnect** — agent reconnects on network drops with exponential backoff.
- **Real terminal** — full PTY via node-pty. vim, htop, colors, resize — all work correctly.
- **Relay architecture** — your shell never leaves your machine. The server is just a pipe.
- **Session expiry** — idle sessions (no browser connected) expire after 10 minutes automatically.
- **Dashboard** — view all past sessions and replays tied to your account.
- **API key auth** — agent authenticates with a personal API key generated from the dashboard.

---

## Self hosting

### Prerequisites
- Node.js 18+
- PostgreSQL
- Docker (optional, for the database)

### 1. Clone the repo
```bash
git clone https://github.com/Prathamesh0901/sheltr
cd sheltr
pnpm install
```

### 2. Start PostgreSQL
```bash
docker run --name sheltr-postgres \
  -e POSTGRES_USER=sheltr \
  -e POSTGRES_PASSWORD=sheltr \
  -e POSTGRES_DB=sheltr \
  -p 5432:5432 \
  -d postgres
```

### 3. Set up environment variables

`apps/server/.env`
```
PORT=3001
DATABASE_URL="postgresql://sheltr:sheltr@localhost:5432/sheltr"
SHELTR_WEB_URL=http://localhost:3000
```

`apps/web/.env.local`
```
NEXT_PUBLIC_WS_URL=ws://localhost:3001
SERVER_URL=http://localhost:3001
DATABASE_URL="postgresql://sheltr:sheltr@localhost:5432/sheltr"
BETTER_AUTH_SECRET=your-secret-here
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

`apps/agent/.env` (optional)
```
SHELTR_API_KEY=your-api-key
SHELTR_SERVER_URL=ws://localhost:3001
```

### 4. Run database migrations
```bash
cd packages/db
npx prisma migrate dev
npx prisma generate
```

### 5. Start server and web
```bash
cd ../..
pnpm dev
```

### 6. Run the agent
```bash
pnpm agent
```

---

## Project structure

```
sheltr/
├── apps/
│   ├── agent/        → CLI published to npm as @sheltr_/agent
│   ├── server/       → WebSocket relay server + Express HTTP API
│   └── web/          → Next.js frontend (xterm.js, dashboard, landing page)
└── packages/
    ├── shared/       → TypeScript message types shared across all apps
    └── db/           → Prisma client, schema, and Better Auth config
```

---

## Tech stack

| Layer | Technology |
|---|---|
| Agent | Node.js, node-pty, ws, tsup |
| Server | Node.js, ws, Express, Prisma |
| Frontend | Next.js 16, xterm.js, Tailwind CSS v4, Zustand |
| Auth | Better Auth (email + password) |
| Database | PostgreSQL |
| ORM | Prisma 7 |
| Monorepo | Turborepo, pnpm workspaces |
| Language | TypeScript throughout |

---

## Roadmap

- [ ] End-to-end encryption — zero-knowledge relay
- [ ] Folder-level access control — restrict controllers to a specific directory via Docker namespace isolation (`npx @sheltr_/agent --restrict ~/projects/myapp`)
- [ ] Mobile browser support
- [ ] Self-hostable Docker image
- [ ] Windows agent support
- [ ] Replay scrubbing — click anywhere on the progress bar to jump

---

## Acknowledgements

Inspired by [tmate](https://tmate.io) and [Skyping](https://skyping.app). Built to fill the gap: browser-native terminal sharing with roles, replay, auth, and no SSH required.

---

## License

MIT