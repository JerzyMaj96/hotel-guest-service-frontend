# Hotel Guest Service System — Frontend

React + TypeScript frontend for the Spring Boot backend.

## Run
```bash
npm install
cp .env.example .env
npm run dev
```

Backend API defaults to `http://localhost:8080`. Change `VITE_API_URL` if needed.

## Implemented screens
- login/register,
- guest dashboard with empty/history states,
- issue creation with multipart `issue` + optional `photo`,
- issue details,
- technical/reception panel,
- status updates,
- local `Notification` object and notification center.
