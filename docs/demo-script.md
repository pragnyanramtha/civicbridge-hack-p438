# Four-minute demonstration

Use synthetic text only. Keep the staff demo password ready separately. Open the citizen app and the staff workspace in two tabs of the same browser to make the shared session easy to demonstrate.

| Time | Action | What to say |
|---|---|---|
| 0:00–0:25 | Show the overview | “People often know the problem but not the right service. CivicBridge brings guidance, reporting, and progress into one place.” |
| 0:25–0:55 | Open the directory and search `waste` | “There are 15 curated sample guides. Each has a clear sample label and a review date.” |
| 0:55–1:30 | Ask `How do I report missed waste collection?` | “The assistant retrieves the relevant guide. These source cards show what the answer is based on. The label tells us whether the answer used a model or the deterministic fallback.” |
| 1:30–1:50 | Ask `Can you approve my passport?` | “There is no supporting guide for that. The assistant says so and does not invent an approval or cite an unrelated source.” |
| 1:50–2:35 | Open Raise a request, click Use sample details, confirm demo checkbox, submit | “The form validates the fields, saves to Neon, and gives a unique reference and private tracking code. No real department is notified.” |
| 2:35–3:15 | Staff tab: sign in, find reference, acknowledge, then move to In progress with notes | “Staff categorise requests and record each update. The workflow prevents skipping from Submitted straight to Resolved.” |
| 3:15–3:40 | Citizen tab: My requests → Refresh → open request | “The same saved updates appear on the citizen’s timeline. A reference plus code also works in another browser.” |
| 3:40–4:00 | Show presentation architecture / limitations | “Next.js runs the UI and API on Vercel, Neon stores the case history, and AI answers are grounded in the sample guides. Real department integrations and verified identities are future work.” |

If model inference is unavailable, explicitly show the `Source lookup · no generative AI` label. Do not claim the live model path was demonstrated. If the network fails, do not describe unsaved data as persisted.
