# Content & metrics baseline

Use this checklist before measuring Phase 1 impact.

## Content audit (SQL)

```sql
-- Total phrases
SELECT COUNT(*) AS phrases_total FROM phrases;

-- With audio
SELECT COUNT(*) AS with_audio FROM phrases WHERE "audioUrl" IS NOT NULL AND "audioUrl" <> '';

-- Audio coverage %
SELECT
  ROUND(100.0 * COUNT(*) FILTER (WHERE "audioUrl" IS NOT NULL AND "audioUrl" <> '') / NULLIF(COUNT(*), 0), 1)
    AS audio_coverage_pct
FROM phrases;

-- Empty categories
SELECT c.id, c.name
FROM categories c
LEFT JOIN phrases p ON p."categoryId" = c.id
GROUP BY c.id, c.name
HAVING COUNT(p.id) = 0;

-- Dialogues readiness
SELECT
  (SELECT COUNT(*) FROM dialogues) AS dialogues,
  (SELECT COUNT(*) FROM messages) AS messages;
```

## Product metrics baseline

| Metric | Source | Value / date |
|--------|--------|----------------|
| Registered users | DB `users` | |
| Quiz games total | `gameStats.totalGames` sum | |
| Users with favorites | distinct `favoritePhrases.userId` | |
| Weekly active (site) | Yandex Metrika | |
| D7 retention | Metrika / cohort | |

## After Phase 1

| Metric | Source |
|--------|--------|
| Users with ≥1 review / week | `phraseLearningProgress` / `userActivity` |
| Avg reviews per active day | `userActivity.reviewsCount` |
| Due backlog size | `GET /api/learning/summary` aggregates |
