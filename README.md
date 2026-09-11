# Suteemon Yodying — Interactive Portfolio

Portfolio built with Next.js App Router, React, TypeScript, and Lucide icons. Content is based on the supplied resume, without invented project links or achievements.

## Resume update

Content updated from the latest supplied resume on 2026-09-11: current Full-Stack Developer role at Bangkok Expressway and Metro Public Company Limited, Bangkok location, and English proficiency listed as Good. Existing education, skills, KCE experience, and project details are retained. No PDF is included.

## Validation status

The 2026-09-11 content update was reviewed as a source diff only; no app, build, tests, or containers were run, as requested.

Previous validation: Docker Compose configuration validation passed. Production build and container runtime testing are not yet completed: dependency downloads were interrupted due to slow network access. The initial TypeScript check reported missing Next.js package/type declarations while installation was incomplete. This source is committed for handoff at the owner's request; successful production operation has not yet been verified.

## Bubble chatbot

Latest check (2026-09-11): two direct requests to `google/gemma-4-31b-it:free` returned HTTP 429 with no answer. The second attempt was made after a pause. A successful completion is not yet verified; no paid or alternate model was selected. Backend JavaScript syntax checks passed. No Docker or frontend build was run for this update.

Bubble is a newly designed fluffy charcoal-gray kitten with four sprite states: idle, blink, and two alternating laptop-typing poses. Typing plays while waiting for a response and briefly as an answer arrives. Click it to open the bilingual resume assistant. Pause animation or use your operating system reduced-motion setting. This is a 2D sprite mascot, not a rigged 3D model.

Before starting Docker, create a local `.env` from `.env.example` if you do not already have one. Set `OPENROUTER_API_KEY` and keep `OPENROUTER_MODEL=google/gemma-4-31b-it:free`. Do not overwrite an existing key. The key is injected only into the backend at runtime, excluded from Git and Docker build contexts, and never sent to the browser. Never prefix it with NEXT_PUBLIC_.

The Docker Compose deployment exposes only the web service. Nginx forwards chat requests to the internal Node.js service. Local `npm run dev` or a static-only host shows the widget but does not provide the chat backend; use Docker Compose for the complete experience. The existing Sites static configuration does not deploy this backend.

Users explicitly start chat before any message is sent to OpenRouter and its selected model provider. Conversations stay in browser memory and disappear on refresh. Up to four recent message pairs are forwarded for context. The service does not log messages or store conversations; OpenRouter/provider data policies still apply. AI answers may be inaccurate and should be checked against the resume.

Public resume facts are maintained in `server/resume.mjs`. The assistant is instructed to answer only from these facts, decline unrelated questions, and acknowledge missing information. No PDF, private street address, or API key is included in the prompt. Keep this file in sync with future resume updates.

The service allows only `openrouter/free` or model IDs ending in `:free`, with no paid fallback. Limits are 5 requests per IP/minute, 15 requests overall/minute, 40 per UTC day, and 3 concurrent requests. Limits are in-memory per backend process and reset on restart; they are not an account-wide or persistent quota guarantee. Provider limits may be lower or shared with other applications. The API returns an error instead of inventing a reply when the provider is unavailable. For broader public traffic, add persistent abuse controls. Keep the backend port private and have any additional trusted reverse proxy pass the real client IP safely.

The owner authorized a direct live OpenRouter smoke check for the Gemma model without Docker. Run `node --env-file=.env scripts/check-openrouter.mjs` to repeat the one-request check; it uses the same payload builder as the backend and reports only status/model/grounding flags, never the key or response body. Docker and browser rendering have not been tested for this redesign.

## Run with Docker

Install Docker Desktop and make sure the Linux engine is running (not paused).

```sh
docker compose up --build -d
```

Open http://localhost:3000. The build compiles Next.js to a static export; the production container serves it using unprivileged Nginx. React interactions work in the browser. The portfolio is served by Nginx. A separate private Node.js service handles `/api/chat` and calls OpenRouter; the API key is required only for chat.

```sh
docker compose ps
docker compose logs -f portfolio
docker compose down
```

To change the host port, set `PORT` before starting Compose, or add `PORT=8080` to a local `.env` file.

## Local development

Requires Node.js 22 and npm.

```sh
npm ci
npm run dev
```

Open http://localhost:3000. `npm run build` creates the production export in `out/`; `npm run typecheck` checks TypeScript.

## Features

- Animated resume cat with Thai/English AI chat through OpenRouter
- Responsive navigation and layout
- Project category filters and accessible project-detail dialogs
- Dark/light theme with a saved browser preference
- Email copy, email/phone links, and GitHub profile link
- Keyboard focus states, skip link, native dialog focus handling, and reduced-motion support

## Edit content

- `app/page.tsx`: resume content, projects, skills, and interactions
- `app/globals.css`: theme and responsive styles
- `app/layout.tsx`: page metadata

Only the city/province is displayed on the page. The original resume PDF is excluded from this repository and the website. Project buttons describe resume projects; the GitHub action links to the profile because individual project repository URLs were not provided.

The Docker image uses a multi-stage build, a non-root runtime, read-only filesystem, temporary `/tmp`, and a health check. Framework static export is configured in `next.config.ts`; server-side features would require a different deployment setup.
