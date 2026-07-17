import {
	applyReview,
	createFailEnqueueProgress,
	createInitialProgress,
} from './srs';

function assert(condition: boolean, message: string) {
	if (!condition) {
		throw new Error(message);
	}
}

function daysBetween(a: Date, b: Date) {
	const ms = b.getTime() - a.getTime();
	return Math.round(ms / (1000 * 60 * 60 * 24));
}

function run() {
	const now = new Date('2026-07-17T12:00:00.000Z');

	// First "know" on a new card → due in 1 day, learning
	{
		const base = createInitialProgress(now);
		const next = applyReview(base, true, now);
		assert(next.intervalDays === 1, 'first know interval should be 1');
		assert(next.repetitions === 1, 'first know repetitions should be 1');
		assert(next.level === 'learning', 'first know level should be learning');
		assert(daysBetween(now, next.nextReviewAt) === 1, 'nextReviewAt +1 day');
		assert(next.successCount === 1, 'successCount increments');
	}

	// Second "know" → 3 days
	{
		const afterFirst = applyReview(createInitialProgress(now), true, now);
		const afterSecond = applyReview(afterFirst, true, now);
		assert(afterSecond.intervalDays === 3, 'second know interval should be 3');
		assert(afterSecond.repetitions === 2, 'second know repetitions should be 2');
		assert(daysBetween(now, afterSecond.nextReviewAt) === 3, 'nextReviewAt +3 days');
	}

	// Third "know" → interval * ease / 100 (3 * 270 / 100 ≈ 8)
	{
		let state = createInitialProgress(now);
		state = applyReview(state, true, now); // ease 260, interval 1
		state = applyReview(state, true, now); // ease 270, interval 3
		state = applyReview(state, true, now);
		assert(state.intervalDays === 8, `third know interval expected 8, got ${state.intervalDays}`);
		assert(state.level === 'review', 'interval >= 7 should be review');
	}

	// "Don't know" resets repetitions and schedules +1 day
	{
		let state = createInitialProgress(now);
		state = applyReview(state, true, now);
		state = applyReview(state, true, now);
		const failed = applyReview(state, false, now);
		assert(failed.repetitions === 0, 'fail resets repetitions');
		assert(failed.intervalDays === 1, 'fail interval is 1');
		assert(failed.failCount === 1, 'failCount increments');
		assert(failed.level === 'new', 'zero repetitions → new');
		assert(daysBetween(now, failed.nextReviewAt) === 1, 'fail due tomorrow');
	}

	// Fail enqueue is due immediately
	{
		const queued = createFailEnqueueProgress(now);
		assert(queued.nextReviewAt.getTime() === now.getTime(), 'fail enqueue due now');
		assert(queued.failCount === 1, 'fail enqueue has failCount');
		assert(queued.level === 'learning', 'fail enqueue level learning');
	}

	console.log('SRS tests passed');
}

run();
