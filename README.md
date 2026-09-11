# Suteemon Yodying - Interactive Portfolio

Next.js App Router, React and TypeScript portfolio with Bubble, a fluffy animated kitten that answers resume questions through OpenRouter. Resume PDFs and API keys are excluded from Git.

## Vercel deployment

Connect GitHub repository XXRTH-S/Resume, production branch main, to your existing Vercel project (owner supplied ID: prj_oGiKpGqPrHkZOKHTKNaKpjlKQEdO). The ID alone does not authenticate or link a deployment.

Use framework Next.js, root directory ./, Node.js 22, and the repository build settings in vercel.json. Output is .next, not out. Remove any old static export command or out-directory override in the dashboard. Both the portfolio and POST /api/chat now deploy together; no Docker service or separate backend URL is needed.

In Project Settings > Environment Variables, add these for Production and Preview:

| Name | Value |
| --- | --- |
| OPENROUTER_API_KEY | Your existing OpenRouter key |
| OPENROUTER_MODEL | google/gemma-4-31b-it:free |
| OPENROUTER_FALLBACK_MODEL | openrouter/free |

Keep the key server-only: never use NEXT_PUBLIC_ and never commit .env. Local .env files are not uploaded by Git. Redeploy after changing environment variables. See [Vercel environment variables](https://vercel.com/docs/environment-variables).

The API uses the Node.js runtime with a 60-second function duration and a 45-second upstream timeout. Configuration is loaded at runtime, so building does not require a key. Missing configuration returns a clear error without exposing secrets.

The legacy .openai/hosting.json describes a previous static hosting target and is not used by Vercel. Static-only hosting cannot run this chat API.

## Local development

Requires Node.js 22. Copy .env.example to .env only if .env does not already exist, then enter your key.

~~~sh
npm ci
npm run dev
~~~

Open http://localhost:3000. Local development now includes the same chat API. npm run build creates the production Next.js output. npm run typecheck checks TypeScript.

## Optional Docker deployment

~~~sh
docker compose up --build -d
~~~

Open http://localhost:3000. A single non-root Next.js standalone container serves the portfolio and API. Compose injects the environment variables at runtime. PORT in .env changes the host port. No Docker was run during the Vercel migration.

## Bubble and API behavior

Bubble has idle, blink and two laptop-typing sprite states. It supports reduced motion and an animation pause control. Visitors explicitly start chat before sending data to OpenRouter. Conversation history stays in browser memory; up to four recent message pairs are sent for context. The backend does not log or store conversations. Provider data policies still apply.

Public resume facts and grounding instructions live in server/resume.mjs. The model is instructed to acknowledge missing information and decline unrelated questions. AI answers can still be inaccurate.

Only free model IDs are allowed. Gemma is primary; one free fallback is attempted for provider throttling or HTTP 502/503/504. Account authentication, billing, policy and account-wide quota errors do not trigger fallback. An empty fallback variable disables fallback.

Limits are 5 requests per IP/minute on Vercel, 15 per instance/minute, 40 per instance/UTC day and 3 concurrent requests per instance. Local/Docker traffic shares one client bucket because arbitrary forwarded IP headers are not trusted. Limits are in memory and reset on restart or cold start; multiple Vercel instances do not share counters. They are not a persistent account quota. Each submission may use two provider requests. Broader public traffic needs persistent rate limiting or platform firewall controls.

## Validation

Run mocked API tests without Docker:

~~~sh
node --test scripts/chat-handler.test.mjs scripts/openrouter.test.mjs
~~~

Vercel migration: 11 API tests passed. Local TypeScript checking is blocked by the incomplete Next.js dependency installation. Production build and deployed Vercel behavior must be verified after deployment.

Previous live OpenRouter check: key authentication HTTP 200; Gemma provider throttled with HTTP 429; free fallback HTTP 200 with an answer matching the resume. Repeat a live check with node --env-file=.env scripts/check-openrouter.mjs (up to two provider requests). It reports status and grounding flags without printing the key or answer.

## Edit content

- app/page.tsx: resume, projects and skills
- app/globals.css: layout and themes
- app/ResumeChat.tsx: chat interface and mascot behavior
- app/api/chat/route.ts: Next.js API entry point
- server/chat-handler.mjs: request validation and limits
- server/openrouter.mjs: provider requests and free fallback
- server/resume.mjs: public resume facts

The site includes theme switching, project filters, accessible dialogs, contact links and responsive layout. Project links are not invented; the GitHub link points to the supplied profile. Only the city is displayed, not a private street address.
