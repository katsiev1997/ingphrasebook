import { db } from '@/db/drizzle';
import { favoritePhrases, gameStats, userActivity, users } from '@/db/schema';
import { checkAuth, createAuthErrorResponse } from '@/shared/lib/auth-utils';
import { computeStreak } from '@/shared/lib/user-activity';
import { eq, sql } from 'drizzle-orm';
import { NextResponse } from 'next/server';

// GET /api/user/stats - Получить статистику пользователя
export async function GET() {
	try {
		const authResult = await checkAuth();

		if (!authResult.success || !authResult.user) {
			return createAuthErrorResponse(authResult);
		}

		const userId = authResult.user.id;

		const user = await db
			.select()
			.from(users)
			.where(eq(users.id, userId))
			.limit(1);

		if (user.length === 0) {
			return NextResponse.json({ error: 'User not found' }, { status: 404 });
		}

		const userData = user[0];
		const registrationDate = userData.createdAt;
		const now = new Date();

		const daysInSystem = Math.floor(
			(now.getTime() - registrationDate.getTime()) / (1000 * 60 * 60 * 24)
		);

		const stats = await db
			.select()
			.from(gameStats)
			.where(eq(gameStats.userId, userId))
			.limit(1);

		const favoriteCount = await db
			.select({ count: sql<number>`count(*)` })
			.from(favoritePhrases)
			.where(eq(favoritePhrases.userId, userId));

		const activityRows = await db
			.select()
			.from(userActivity)
			.where(eq(userActivity.userId, userId));

		const consecutiveDays = computeStreak(
			activityRows.map((row) => row.date),
			now
		);

		const lastActivityFromLog = activityRows
			.map((row) => row.date)
			.sort()
			.at(-1);

		const lastActivity = lastActivityFromLog
			? new Date(`${lastActivityFromLog}T12:00:00.000Z`)
			: stats.length > 0 && stats[0].updatedAt
				? stats[0].updatedAt
				: registrationDate;

		return NextResponse.json({
			registrationDate,
			daysInSystem,
			consecutiveDays,
			lastActivity,
			totalGames: stats.length > 0 ? stats[0].totalGames : 0,
			favoritePhrasesCount: Number(favoriteCount[0]?.count || 0),
		});
	} catch (error) {
		console.error('Error fetching user stats:', error);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}
