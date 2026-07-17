# Changelog

All notable changes to IngPhrase are documented here and on `/changelog` in the app.

Source of truth for the in-app page: `src/shared/config/changelog.ts`.

## [0.2.1] — 2026-07-17

### Changed

- Bottom tab «Ещё» → «Профиль»
- Phrase search moved to `/search`; floating search button on home
- Pronunciation guide grouped into accordions (vowels, consonants, noun classes)
- User activity stats moved into learning statistics

### Added

- Motion polish on phrase and category cards; floating search FAB animation

### Fixed

- Search API N+1 `favoritePhrases` queries that failed under Neon load

## [0.2.0] — 2026-07-17

### Added

- Study hub with spaced-repetition flashcards (SRS)
- Daily goal (10 reviews), streak, learning statistics
- Quiz mistakes enqueue into the review queue
- Dialogues UI, dictation (phrases with audio), soft browser reminders
- Study tab in bottom navigation (Russian labels)
- Pronunciation guide linked from Study; dialogues teaser on home when content exists

## [0.1.0] — 2025

### Added

- Phrasebook: categories, search, audio
- Favorites and quiz game with leaderboard
- Pronunciation guide, light/dark theme
- Auth and moderator roles for content
