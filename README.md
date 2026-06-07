# sh>ltr

**Share your terminal, instantly.**

Run one command. Get two links — one to control, one to watch. No SSH, no screen sharing, no installs on the other end.

```bash
npx @sheltr_/agent
```

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

**1. Start the agent on your machine**
```bash
npx @sheltr_/agent
```

**2. Share the URLs printed in your terminal**
```
Controller → https://sheltr.dev/s/abc123?role=controller
Viewer     → https://sheltr.dev/s/abc123?role=viewer
```

**3. They open the link in any browser — done**

---

## Features

- **Shareable links** — two URLs per session, controller and viewer. No accounts needed.
- **Role-based access** — viewers watch but can't type. Enforced server-side, not just client-side.
- **Session replay** — every session recorded automatically. Get a shareable replay link when it ends.
- **Auto-reconnect** — agent reconnects on network drops with exponential backoff.
- **Real terminal** — full PTY via node-pty. vim, htop, colors, resize — all work correctly.
- **Relay architecture** — your shell never leaves your machine. The server is just a pipe.
- **Session expiry** — idle sessions (no browser connected) expire after 10 minutes automatically.

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
```

`apps/agent/.env` (optional)
```
SHELTR_SERVER_URL=ws://localhost:3001
```

### 4. Run database migrations
```bash
cd packages/db
npx prisma migrate dev
```

### 5. Start everything
```bash
cd ../..
pnpm dev
```

This starts the server on `3001` and the web app on `3000` via Turborepo.

### 6. Run the agent
```bash
cd apps/agent
pnpm dev
```

---

## Project structure

```
sheltr/
├── apps/
│   ├── agent/        → CLI published to npm as @sheltr_/agent
│   ├── server/       → WebSocket relay server + HTTP replay API
│   └── web/          → Next.js frontend (xterm.js, landing page)
└── packages/
    ├── shared/       → TypeScript message types shared across all apps
    └── db/           → Prisma client and schema
```

---

## Tech stack

| Layer | Technology |
|---|---|
| Agent | Node.js, node-pty, ws |
| Server | Node.js, ws, Express, Prisma |
| Frontend | Next.js, xterm.js, Tailwind CSS |
| Database | PostgreSQL |
| Monorepo | Turborepo, pnpm workspaces |
| Language | TypeScript throughout |

---

## Roadmap

- [ ] Auth — dashboard with session history tied to your account
- [ ] End-to-end encryption — zero-knowledge relay
- [ ] Folder-level access control — restrict controllers to a specific directory via Docker namespace isolation (`npx @sheltr_/agent --restrict ~/projects/myapp`)
- [ ] Mobile browser support
- [ ] Replay playback controls — pause, seek, speed
- [ ] Self-hostable Docker image
- [ ] Windows agent support

---

## Acknowledgements

Inspired by [tmate](https://tmate.io) and [Skyping](https://skyping.app). Built to fill the gap: browser-native terminal sharing with roles, replay, and no SSH required.

---

## License

MIT
