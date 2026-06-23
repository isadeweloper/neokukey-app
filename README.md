# neokukey-app

Full app: **Next.js frontend** at the repo root + **Spring Boot CMS backend** in `backend/`.

## Deploy

### Frontend → Vercel (zero-config)
1. https://vercel.com/new → import **`isadeweloper/neokukey-app`**.
2. The Next.js app is at the repo root — **no Root Directory change needed**.
3. Add env var `BACKEND_URL` = your Render backend URL
   (e.g. `https://neokukey-backend.onrender.com`).
4. Deploy.

### Backend → Render (Blueprint)
1. https://dashboard.render.com → New → Blueprint → connect **`isadeweloper/neokukey-app`**.
2. Render reads `render.yaml` and provisions the Docker service (`backend/`) + PostgreSQL.
3. Apply, wait for build. Health check: `<backend-url>/api/cms/services` → `[]`.

See the backend's env-based config in `backend/src/main/resources/application.yml`
(`DB_*`, `PORT`, `JWT_SECRET`, `APP_UPLOAD_DIR` — with local-dev defaults).

## Local dev
- Frontend: `npm install && npm run dev` (Node 22) — set `BACKEND_URL` in `.env.local`.
- Backend: `cd backend && ./mvnw spring-boot:run` (Java 21 + PostgreSQL on localhost:5432, db `cms`).
