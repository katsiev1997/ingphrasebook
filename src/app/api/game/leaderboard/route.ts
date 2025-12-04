import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { db } from '@/db/drizzle';
import { gameStats, users } from '@/db/schema';
import { desc, sql } from 'drizzle-orm';

// GET /api/game/leaderboard - Получить топ игроков
export async function GET(req: NextRequest) {
	try {
		const { searchParams } = req.nextUrl;
		const limit = Number(searchParams.get('limit')) || 10;

		// Получаем топ игроков по проценту правильных ответов
		// Сортируем по проценту правильных ответов, затем по общему количеству игр
		const leaderboard = await db
			.select({
				userId: gameStats.userId,
				username: users.username,
				totalQuestions: gameStats.totalQuestions,
				correctAnswers: gameStats.correctAnswers,
				totalGames: gameStats.totalGames,
				accuracy: sql<number>`CASE 
					WHEN ${gameStats.totalQuestions} > 0 
					THEN ROUND((${gameStats.correctAnswers}::float / ${gameStats.totalQuestions}::float) * 100, 2)
					ELSE 0
				END`.as('accuracy'),
			})
			.from(gameStats)
			.innerJoin(users, sql`${gameStats.userId} = ${users.id}`)
			.where(sql`${gameStats.totalGames} > 0`)
			.orderBy(
				desc(sql`CASE 
					WHEN ${gameStats.totalQuestions} > 0 
					THEN ${gameStats.correctAnswers}::float / ${gameStats.totalQuestions}::float
					ELSE 0
				END`),
				desc(gameStats.totalGames)
			)
			.limit(limit);

		return NextResponse.json(leaderboard);
	} catch (error) {
		console.error('Error fetching leaderboard:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}

