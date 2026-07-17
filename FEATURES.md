# FEATURES — Roadmap

Product goal and metrics: see [PRODUCT.md](./PRODUCT.md).

Last updated: 2026-07

---

## Now (committed — this quarter)

### Learning loop
- Flashcards (Ingush ↔ Russian flip, know / don’t know)
- Simplified SM-2 spaced repetition (`phraseLearningProgress`)
- Due-card CTA on home; study from favorites; quiz mistakes → SRS queue
- Study tab in bottom navigation

### Habit
- Daily activity log (`userActivity`)
- Real streak based on activity
- Daily goal: 10 reviews
- Soft browser notifications (opt-in in Settings)
- Hard phrases list (due + failCount > 0)

### Depth
- Dialogues UI (existing API/schema)
- Thin learning stats (due, mastered, streak, reviews/7d)
- Dictation v1 for phrases with audio → feeds SRS

---

## Next (after Now ships and is measured)

- In-app or linked user survey (job-to-be-done)
- Must-know starter track (curated 30–50 phrases)
- Phrase share (image/link)
- Audio coverage push (content ops)
- PWA / offline only if metrics show demand
- Export favorites CSV/PDF

---

## Later

- Dictation difficulty levels / hints
- Context notes (examples, cultural notes) — content-heavy
- Teacher lite: weekly plan, badges
- Richer statistics (heat map) if thin stats prove useful
- Pronunciation practice with visual waveform (no AI scoring yet)

---

## Won’t (this quarter)

- Social: comments, ratings, shared collections, forum
- Multiplayer / live challenges
- ML personalized recommendations
- Grammar CMS + interactive grammar drills
- AI pronunciation accuracy scoring
- Server push via Service Worker scheduler
- Full theme marketplace / heavy UI customization program
- A11y / perf as standalone epics (do basics on new screens)

---

## Content audit checklist

Run against production DB (or admin queries):

| Check | How |
|-------|-----|
| Total phrases | `COUNT(*)` on `phrases` |
| Phrases with audio | `COUNT(*) WHERE audioUrl IS NOT NULL` |
| Empty categories | categories with 0 phrases |
| Dialogues ready | `dialogues` + `messages` counts |

Baseline metrics (Metrika + product):

- Registrations
- Quiz finish rate
- Favorites usage
- Return visits / D7
- After Phase 1: weekly reviewers %
