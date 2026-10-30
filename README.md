# CivicBridge

**Public Grievance AI Assistant · HACK-P438**

A citizen-facing public-service assistant with a searchable directory, visible sources, guided grievances, private request history, tracking codes, attachments, and a protected staff queue.

## Run locally

Requires Node.js 22+ and a PostgreSQL database. The deployment uses Node.js 24, Next.js 16, React 19, and Neon PostgreSQL.

```sh
npm ci
cp .env.example .env.local
# Fill the environment variables in .env.local.
# Apply database/001_initial.sql to an empty database using a direct connection.
npm run dev
```

`DATABASE_URL` is a **pooled** Neon connection string for application traffic. Run migrations with a direct connection. `SESSION_SECRET` must be a long random value. `STAFF_PASSWORD` is the shared **demo-only** staff password supplied separately with the handoff. Never commit these values.

For a new deployment, create a Vercel project, connect this repository, and set the four variables below. The provisioned Neon project is `civicbridge-hack-p438` in Singapore; the database is `civicbridge`. Schema changes are kept in `database/`.

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | Server-only PostgreSQL connection |
| `SESSION_SECRET` | Tracking-code hashes, staff cookie signatures, rate-limit identity hashes |
| `STAFF_PASSWORD` | Demo staff sign-in |
| `AI_GATEWAY_MODEL` | An exact model ID from the Vercel AI Gateway catalog |

For deployed AI calls, Vercel injects `VERCEL_OIDC_TOKEN`; no provider key is needed in browser code. To enable AI locally, optionally set `AI_GATEWAY_API_KEY`. If inference is unavailable, the assistant returns a **labelled source-lookup fallback**. An unsupported question returns no citations and no fabricated answer.

## Use the demo

1. Open the app. A random HttpOnly browser session gets three **labelled synthetic** starter cases.
2. Browse the 15 sample service guides; filter by category or search in English, Telugu, or Hindi.
3. Ask Civic AI a supported service question and open its source card. Ask an unsupported question to see the fallback.
4. Raise a request. "Use sample details" fills synthetic text; a valid image/PDF under 512 KB is optional.
5. Save the reference and six-digit tracking code from the confirmation screen. Open My requests to see the history in the same browser, or Track a request from another browser.
6. Open Staff workspace and sign in with the separately supplied demo password. Open the request, acknowledge it, move it into progress, and resolve it with a note. Refresh the citizen view to see the saved timeline.

The three starter sample cases use tracking code `000438`. New requests get random codes shown only at submission. The API never returns tracking-code hashes, session IDs, or database credentials.

## Submission materials

- `public/presentation.html`: seven-slide presentation. Open `/presentation.html`, use arrow keys, or print to PDF.
- `docs/demo-script.md`: a timed four-minute demo, including supported and unsupported questions.
- `docs/architecture.md`: components, data model, authentication, and status flow.
- `docs/evaluation.md`: expected retrieval results and evaluation limits.
- `database/001_initial.sql`: versioned initial schema.

## Checks

```sh
npm test
npm run typecheck
npm run build
# With a running app and .env.local configured:
npm run test:e2e
# Test an existing deployment:
BASE_URL=https://your-deployment.vercel.app npm run test:e2e
```

The unit checks cover directory completeness, English/Telugu/Hindi retrieval, unsupported questions, context-sensitive follow-ups, invalid state transitions, and text validation. Integration checks exercise real storage, cross-session ownership, tracking, attachment protection, staff sign-in, status history, stale-write rejection, and logout. They leave clearly identified synthetic test cases in the database.

## Scope and limitations

- **No government integration.** Complaints are stored in this prototype only. No official fees, eligibility, service deadlines, or decisions are claimed.
- All 15 guides are **clearly identified sample content**, last reviewed for this prototype on 30 October 2026. They are not copies of official municipal policy. Citations link to the exact sample guide used.
- Citizen identity is browser-scoped, not a verified public identity. Clearing cookies loses dashboard access; saved reference/code pairs still allow tracking. Staff uses one shared demo password, not a production identity provider.
- Language selection translates the main navigation, form labels, guide titles/summaries, and source-lookup answers. Full guide procedures, status labels, and some helper copy remain English. AI responses use the selected language when available.
- Retrieval uses a small, transparent keyword/synonym index with a follow-up context. It is not a trained embedding system or a validated legal/administrative advisor. A retrieved source supports the service topic; a model can still make mistakes in wording.
- Inference is limited to 12 chat requests per IP per 10 minutes and 100 model attempts globally per day. Gateway availability/credits determine whether the answer is generated or uses the labelled deterministic fallback.
- Attachments are validated by size, MIME type, and file signature, stored in PostgreSQL, and downloaded as attachments only by the owner or staff. They are not malware-scanned. Use synthetic files only. Larger production uploads should use object storage and scanning.
- Staff queue shows the latest 150 records. There is no email/SMS delivery, verified department routing, SLA promise, emergency dispatch, map integration, or real payment flow.
- Rate limits, origin checks, HttpOnly cookies, ownership checks, parameterised SQL, transaction-backed updates, and a status audit trail provide basic prototype protections. This is not a production government service.
