# Discovery-Call Qualification — Implementation Brief

## Problem
People book discovery calls with Rania and don't show up. Goal: reduce
unqualified bookings AND reduce no-shows among those who do book.

## Key principle
Answers must GATE THE CALENDAR. Only qualified answers see a booking link.
Everyone else gets a nurture path (resource + email), not a call slot.
Questions alone, with the booking link always visible, add friction without filtering.

---

## Q1 — Budget (anchor + self-select band)

**Prompt:**
> Working with Rania typically ranges from **AED 5,000** for a focused engagement
> to **AED 30,000+** for a full programme. Where does that land for you?

**Options → routing:**
| # | Option | Route |
|---|---|---|
| A | That's in range — I'm ready to invest in the right fit. | ✅ Book call |
| B | In range, at the lower end — I'd start focused and scale up. | ✅ Book call |
| C | Not yet — I'm planning budget for a later quarter. | ⏳ Nurture |
| D | That's outside what I can invest right now. | ❌ Resource only |

Why: removes the free "I need more information" escape hatch. Option B keeps
budget-aware buyers in the funnel (they're good leads, not bad ones) instead of
forcing a false yes/no against a 6x-wide range. C reframes "no" as "not yet",
which is honest and keeps goodwill.

---

## Q2 — Timing (forcing function, not wishes)

**Prompt:**
> If it's the right fit, when would you want to start?

**Options → routing:**
| # | Option | Route |
|---|---|---|
| A | I have a specific deadline or event driving this. | ✅ Book call (best lead) |
| B | Within the next 30 days. | ✅ Book call |
| C | In 2–3 months — planning ahead. | ⏳ Nurture |
| D | No timeline yet — I'm researching options. | ❌ Resource only |

If A selected → reveal a short free-text: **"What's the date / what's driving it?"**

Why: "ASAP" is what everyone types and predicts nothing. A *deadline or event* is
a forcing function and is far more predictive of showing up and buying.

---

## Q3 — RECOMMENDED ADDITION (best no-show predictor)

**Prompt (required, free text, min ~15 chars):**
> What would make this call a win for you?

People who write a considered answer show up. People who type "info" don't.
It also costs 20 seconds of investment, which raises commitment, and it gives
Rania a genuine prep note so the call opens strong.

---

## No-show fixes that matter MORE than the questions
1. Gate the calendar on Q1/Q2 answers (above).
2. Collect a phone number; send **WhatsApp** reminders at 24h and 1h (UAE-critical).
3. Real calendar invite (.ics) so it lands in their calendar, not just an email.
4. One-click reschedule link — people ghost when they can't gracefully move.
5. Echo their Q3 answer back in the confirmation ("Rania will cover: <answer>").
6. Scarcity, if true: "Rania holds a limited number of these calls each week."
7. Nuclear option for high-value calls: refundable deposit / card hold.

---

## Implementation notes (this codebase)
- Canonical files live in `public/`. If touching `btl`/`no2ta`, edit BOTH the flat
  file and the `public/btl/` + `public/no2ta/` mirrors (build copies mirrors over).
- Site is **bilingual EN/AR**: every new string needs a `data-i18n` key plus an
  Arabic translation in the `translations` object in `public/app.js`. RTL must work.
- **Do not break** existing hooks: `data-i18n` / `data-i18n-placeholder` attributes,
  form input `name=` attributes (they map to Supabase `rania_submissions` columns),
  audio-player IDs, theme toggles, drawer/nav IDs.
- Supabase table `rania_submissions` — new answers need either new columns or to be
  appended into an existing text field. Decide before building.
- **Meta Pixel is live** (`public/pixel.js`). Fire `Lead` only on QUALIFIED
  submissions so ad optimisation learns from good leads, not all leads.
  Consider a separate `Schedule` event when a call is actually booked.
- No build step, no framework — vanilla JS + CSS.

## Open question to resolve first
Where does this flow live? The existing `public/apply.html` is the **podcast
guest/sponsor** funnel. A paid-services discovery call is a **different funnel**
(media training / public speaking / production). Decide: new page (e.g.
`public/book.html`) vs. a third mode on `apply.html` vs. an external booking tool
(Calendly/TidyCal) with these as required screening questions.
