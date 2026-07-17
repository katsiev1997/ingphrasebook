import type { LearningLevel } from '@/db/schema';

export interface SrsState {
	level: LearningLevel;
	easeFactor: number;
	intervalDays: number;
	repetitions: number;
	successCount: number;
	failCount: number;
}

export interface SrsResult extends SrsState {
	nextReviewAt: Date;
	lastReviewedAt: Date;
}

const MIN_EASE = 130; // 1.3 × 100
const DEFAULT_EASE = 250; // 2.5 × 100

function resolveLevel(intervalDays: number, repetitions: number): LearningLevel {
	if (intervalDays >= 60 && repetitions >= 5) {
		return 'mastered';
	}
	if (intervalDays >= 7) {
		return 'review';
	}
	if (repetitions > 0) {
		return 'learning';
	}
	return 'new';
}

/** Simplified SM-2: known increases interval; unknown resets to 1 day. */
export function applyReview(state: SrsState, known: boolean, now = new Date()): SrsResult {
	let { easeFactor, intervalDays, repetitions, successCount, failCount } = state;

	if (known) {
		successCount += 1;
		if (repetitions === 0) {
			intervalDays = 1;
		} else if (repetitions === 1) {
			intervalDays = 3;
		} else {
			intervalDays = Math.max(1, Math.round((intervalDays * easeFactor) / 100));
		}
		repetitions += 1;
		easeFactor = Math.max(MIN_EASE, easeFactor + 10);
	} else {
		failCount += 1;
		repetitions = 0;
		intervalDays = 1;
		easeFactor = Math.max(MIN_EASE, easeFactor - 20);
	}

	const nextReviewAt = new Date(now);
	nextReviewAt.setDate(nextReviewAt.getDate() + intervalDays);

	return {
		level: resolveLevel(intervalDays, repetitions),
		easeFactor,
		intervalDays,
		repetitions,
		successCount,
		failCount,
		nextReviewAt,
		lastReviewedAt: now,
	};
}

export function createInitialProgress(now = new Date()): SrsResult {
	return {
		level: 'new',
		easeFactor: DEFAULT_EASE,
		intervalDays: 0,
		repetitions: 0,
		successCount: 0,
		failCount: 0,
		nextReviewAt: now,
		lastReviewedAt: now,
	};
}

/** Enqueue a failed quiz phrase as due ASAP with a fail bump. */
export function createFailEnqueueProgress(now = new Date()): SrsResult {
	const base = createInitialProgress(now);
	return {
		...base,
		level: 'learning',
		intervalDays: 0,
		failCount: 1,
		nextReviewAt: now,
		lastReviewedAt: now,
	};
}
