# Verification record

Date: 30 October 2026. Target: `https://civicbridge-hack-p438.vercel.app`.

## Passed

- Production build and TypeScript checks.
- Focused automated tests for source retrieval, directory completeness, unsupported questions, follow-ups, workflow transitions, and input validation.
- Live health endpoint and browser-scoped sample sessions backed by Neon.
- Supported assistant answer with the expected source and unsupported question without citations.
- Grievance submission, unique reference, and a six-digit tracking code.
- Cross-session ownership checks and owner-only attachment downloads.
- Tracking from a separate session using the reference and correct code.
- Unauthenticated staff queue and update rejection.
- Staff login, Submitted → Acknowledged → In progress → Resolved, and four stored history events.
- Rejection of an invalid status jump and a stale edit (HTTP 409).
- Citizen readback of the saved staff resolution and staff logout.
- Browser checks of service navigation, directory search, Telugu labels and summaries, source details, and a real form-to-database submission with a confirmation screen.

The first integration run used the labelled extractive/source-lookup path. AI runtime authentication is checked separately after the request-scoped OIDC integration. Do not interpret the first run as proof of model inference.

The local preview environment could render the interface but could not complete database connections; persistence checks above ran against the Vercel deployment and Neon instead. Test cases contain synthetic data and remain labelled in the demo workspace.

## AI provider check

The deployed request-scoped OIDC path reached AI Gateway. The provider returned HTTP 403 and stated that a valid credit card must be added to the Vercel account to unlock free AI credits. No card or plan change was made. The live app therefore continues to use the labelled, cited source-lookup fallback. Model-generated responses remain unverified until that account prerequisite is completed.
