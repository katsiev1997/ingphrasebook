import { db } from '@/db/drizzle';
import { phraseLearningProgress, userActivity } from '@/db/schema';
import { checkAuth, createAuthErrorResponse } from '@/shared/lib/auth-utils';
import { computeStreak, todayDateKey } from '@/shared/lib/user-activity';
import { and, eq, gte, lte, sql } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export const DAILY_REVIEW_GOAL = 10;

// GET /api/learning/summary
export async function GET() {
	try {
		const authResult = await checkAuth();
		if (!authResult.success || !authResult.user) {
			return createAuthErrorResponse(authResult);
		}

		const userId = authResult.user.id;
		const now = new Date();
		const today = todayDateKey(now);
		const weekAgo = new Date(now);
		weekAgo.setDate(weekAgo.getDate() - 7);
		const weekAgoKey = todayDateKey(weekAgo);

		const [dueRow] = await db
			.select({ count: sql<number>`count(*)::int` })
			.from(phraseLearningProgress)
			.where(
				and(
					eq(phraseLearningProgress.userId, userId),
					lte(phraseLearningProgress.nextReviewAt, now)
				)
			);

		const [learningRow] = await db
			.select({ count: sql<number>`count(*)::int` })
			.from(phraseLearningProgress)
			.where(
				and(
					eq(phraseLearningProgress.userId, userId),
					eq(phraseLearningProgress.level, 'learning')
				)
			);

		const [masteredRow] = await db
			.select({ count: sql<number>`count(*)::int` })
			.from(phraseLearningProgress)
			.where(
				and(
					eq(phraseLearningProgress.userId, userId),
					eq(phraseLearningProgress.level, 'mastered')
				)
			);

		const [hardRow] = await db
			.select({ count: sql<number>`count(*)::int` })
			.from(phraseLearningProgress)
			.where(
				and(
					eq(phraseLearningProgress.userId, userId),
					sql`${phraseLearningProgress.failCount} > 0`,
					lte(phraseLearningProgress.nextReviewAt, now)
				)
			);

		const todayActivity = await db
			.select()
			.from(userActivity)
			.where(and(eq(userActivity.userId, userId), eq(userActivity.date, today)))
			.limit(1);

		const weekActivity = await db
			.select()
			.from(userActivity)
			.where(
				and(
					eq(userActivity.userId, userId),
					gte(userActivity.date, weekAgoKey)
				)
			);

		const allActivity = await db
			.select({ date: userActivity.date })
			.from(userActivity)
			.where(eq(userActivity.userId, userId));

		const reviewsToday = todayActivity[0]?.reviewsCount ?? 0;
		const reviewsLast7Days = weekActivity.reduce(
			(sum, row) => sum + row.reviewsCount,
			0
		);
		const streak = computeStreak(
			allActivity.map((row) => row.date),
			now
		);

		return NextResponse.json({
			dueCount: dueRow?.count ?? 0,
			learningCount: learningRow?.count ?? 0,
			masteredCount: masteredRow?.count ?? 0,
			hardCount: hardRow?.count ?? 0,
			reviewsToday,
			reviewsLast7Days,
			dailyGoal: DAILY_REVIEW_GOAL,
			goalProgress: Math.min(reviewsToday, DAILY_REVIEW_GOAL),
			streak,
		});
	} catch (error) {
		console.error('Learning summary error:', error);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}
