# Found Fluency

**Speak up. Get heard.** Live-Training + KI-Sprachcoach.

Company website and a working platform prototype, based on the original concept deck (Entwurf v10). Static HTML, CSS and JavaScript with no build step. German with an English toggle (DE/EN, top right).

One company, three offers: **Found Fluency** (language coaching), **Found Fluency AI** (AI practice platform) and **Found Fluency Executive** (premium coaching for leaders).

**Live:** https://www.foundfluency.com/

## Website

| Page | Content |
|---|---|
| `index.html` | Hook, problem, personas, AI coach in 4 steps, engagement model (training → adoption → pilot & rollout → ongoing care), pilot targets, privacy, Roadmap, FAQ |
| `solution.html` | Live training, AI coach, trainer cockpit, use cases UC1–UC3, data flow, technology |
| `process.html` | 6 steps from Language Roadmap to ongoing care, learner timeline, "one month to the big day", timeline chart, KPI pyramid |
| `trust.html` | GDPR, EU AI Act, copyright, works council, who sees what, risk register |
| `roadmap.html` | Free **Sprach-Roadmap** (like GPC's AI Roadmap): AI strategy type, recommended pilot, 30/60/90-day plan |
| `executive.html` | **Found Fluency Executive**: premium 1:1 coaching for leaders (executive coaching, presentation & pitch, interview & career), €65 per 45 min |
| `executive-check.html` | Personal Executive Check (Test 1): estimated level, programme recommendation, 30/60/90-day plan; answers go to Gmail |
| `book.html` | Booking & payment: Calendly calendar (embedded once `LINKS.discovery` is set), card/Apple Pay/Google Pay/SEPA via Stripe, PayPal, bank transfer on invoice |
| `about.html` | About Found Fluency and the founder |
| `impressum.html` | Legal notice (§ 5 DDG), German binding with English translation |
| `datenschutz.html` | Privacy policy (GDPR): hosting, email, forms, Calendly (click-to-load), Zoom, PayPal, demo storage, browser speech recognition |
| `courses.html` | Language school: online, in-person and hybrid formats; group, 1:1 and company courses; languages and CEFR levels |
| `pricing.html` | Plan calculator: one-time start-up costs (user training + platform set-up) plus running costs by plan. Rates are set in `js/config.js` (`PRICING`) |
| `contact.html` | Contact form (opens a pre-filled email) |

## Platform prototype (`app/`)

| View | What it does |
|---|---|
| `app/index.html` | Role picker: learner, trainer, L&D |
| `app/learner.html` | Goal with countdown to the Big Day, practice minutes, live/AI mix, weekly plan, history with release status. Switch between the personas Markus, Sabine, Leila and Klaus. |
| `app/exercise.html` | The 4 steps: goal → voice role-play (browser speech recognition and speech output, typing as a fallback) → rule-based feedback → the learner chooses what the trainer sees |
| `app/trainer.html` | Trainer cockpit: only released data, AI topic recommendations for the group, 1:1 requests |
| `app/insights.html` | Anonymous L&D KPI cockpit: speaking practice, active users, CEFR levels, satisfaction, Big Day |

All demo data lives in the browser's `localStorage`; nothing is sent anywhere. "Reset demo" restores the starting data. Speech recognition works best in Chrome or Edge.

**What a production version would need:** a real AI speech provider (EU hosting, a data processing agreement, no training on customer data), user accounts with single sign-on, a database, and a works agreement. See `trust.html`.

## Configuration

`js/config.js`: contact email, the discovery-call booking link (`LINKS.discovery`), `formEndpoint` (Roadmap answers go to Gmail via FormSubmit; the first submission triggers a one-time activation email), and the `PRICING` rates for the calculator.
