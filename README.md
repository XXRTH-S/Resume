# Suteemon Yodying — Interactive Portfolio

Portfolio built with Next.js App Router, React, TypeScript, and Lucide icons. Content is based on the supplied resume, without invented project links or achievements.

## Resume update

Content updated from the latest supplied resume on 2026-09-11: current Full-Stack Developer role at Bangkok Expressway and Metro Public Company Limited, Bangkok location, and English proficiency listed as Good. Existing education, skills, KCE experience, and project details are retained. No PDF is included.

## Validation status

The 2026-09-11 content update was reviewed as a source diff only; no app, build, tests, or containers were run, as requested.

Previous validation: Docker Compose configuration validation passed. Production build and container runtime testing are not yet completed: dependency downloads were interrupted due to slow network access. The initial TypeScript check reported missing Next.js package/type declarations while installation was incomplete. This source is committed for handoff at the owner's request; successful production operation has not yet been verified.

## Run with Docker

Install Docker Desktop and make sure the Linux engine is running (not paused).

```sh
docker compose up --build -d
```

Open http://localhost:3000. The build compiles Next.js to a static export; the production container serves it using unprivileged Nginx. React interactions work in the browser. No database, API keys, or Node server are required at runtime.

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
