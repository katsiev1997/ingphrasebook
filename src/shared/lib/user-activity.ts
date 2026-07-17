import { db } from '@/db/drizzle';
import { userActivity } from '@/db/schema';
import { and, eq, sql } from 'drizzle-orm';

export function todayDateKey(now = new Date()): string {
	return now.toISOString().slice(0, 10);
}

export async function incrementUserActivity(
	userId: number,
	field: 'reviewsCount' | 'quizCount',
	amount = 1,
	now = new Date()
) {
	const date = todayDateKey(now);

	const existing = await db
		.select()
		.from(userActivity)
		.where(and(eq(userActivity.userId, userId), eq(userActivity.date, date)))
		.limit(1);

	if (existing.length === 0) {
		await db.insert(userActivity).values({
			userId,
			date,
			reviewsCount: field === 'reviewsCount' ? amount : 0,
			quizCount: field === 'quizCount' ? amount : 0,
		});
		return;
	}

	if (field === 'reviewsCount') {
		await db
			.update(userActivity)
			.set({
				reviewsCount: sql`${userActivity.reviewsCount} + ${amount}`,
			})
			.where(and(eq(userActivity.userId, userId), eq(userActivity.date, date)));
	} else {
		await db
			.update(userActivity)
			.set({
				quizCount: sql`${userActivity.quizCount} + ${amount}`,
			})
			.where(and(eq(userActivity.userId, userId), eq(userActivity.date, date)));
	}
}

/** Count consecutive days ending today or yesterday with any activity. */
export function computeStreak(
	activityDates: string[],
	now = new Date()
): number {
	if (activityDates.length === 0) {
		return 0;
	}

	const set = new Set(activityDates);
	const cursor = new Date(now);
	cursor.setUTCHours(0, 0, 0, 0);

	const todayKey = cursor.toISOString().slice(0, 10);
	const yesterday = new Date(cursor);
	yesterday.setUTCDate(yesterday.getUTCDate() - 1);
	const yesterdayKey = yesterday.toISOString().slice(0, 10);

	if (!set.has(todayKey) && !set.has(yesterdayKey)) {
		return 0;
	}

	if (!set.has(todayKey)) {
		cursor.setUTCDate(cursor.getUTCDate() - 1);
	}

	let streak = 0;
	while (true) {
		const key = cursor.toISOString().slice(0, 10);
		if (!set.has(key)) {
			break;
		}
		streak += 1;
		cursor.setUTCDate(cursor.getUTCDate() - 1);
	}

	return streak;
}
