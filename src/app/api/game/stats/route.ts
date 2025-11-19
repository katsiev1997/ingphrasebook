import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { db } from '@/db/drizzle';
import { gameStats } from '@/db/schema';
import { checkAuth, createAuthErrorResponse } from '@/shared/lib/auth-utils';
import { eq } from 'drizzle-orm';

// GET /api/game/stats - Получить статистику пользователя
export async function GET(req: NextRequest) {
	try {
		const authResult = await checkAuth();

		if (!authResult.success || !authResult.user) {
			return createAuthErrorResponse(authResult);
		}

		const userId = authResult.user.id;

		const stats = await db
			.select()
			.from(gameStats)
			.where(eq(gameStats.userId, userId))
			.limit(1);

		if (stats.length === 0) {
			// Если статистики нет, создаем новую запись
			const [newStats] = await db
				.insert(gameStats)
				.values({
					userId,
					totalQuestions: 0,
					correctAnswers: 0,
					totalGames: 0,
				})
				.returning();

			return NextResponse.json(newStats);
		}

		return NextResponse.json(stats[0]);
	} catch (error) {
		console.error('Error fetching game stats:', error);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}

// POST /api/game/stats - Обновить статистику игры
export async function POST(req: NextRequest) {
	try {
		const authResult = await checkAuth();

		if (!authResult.success || !authResult.user) {
			return createAuthErrorResponse(authResult);
		}

		const userId = authResult.user.id;
		const body = await req.json();
		const { correctAnswers, totalQuestions } = body;

		if (
			typeof correctAnswers !== 'number' ||
			typeof totalQuestions !== 'number' ||
			correctAnswers < 0 ||
			totalQuestions < 0 ||
			correctAnswers > totalQuestions
		) {
			return NextResponse.json(
				{ error: 'Invalid statistics data' },
				{ status: 400 }
			);
		}

		// Проверяем существование статистики
		const existingStats = await db
			.select()
			.from(gameStats)
			.where(eq(gameStats.userId, userId))
			.limit(1);

		if (existingStats.length === 0) {
			// Создаем новую запись статистики
			const [newStats] = await db
				.insert(gameStats)
				.values({
					userId,
					totalQuestions,
					correctAnswers,
					totalGames: 1,
				})
				.returning();

			return NextResponse.json(newStats);
		}

		// Обновляем существующую статистику
		const [updatedStats] = await db
			.update(gameStats)
			.set({
				totalQuestions: existingStats[0].totalQuestions + totalQuestions,
				correctAnswers: existingStats[0].correctAnswers + correctAnswers,
				totalGames: existingStats[0].totalGames + 1,
				updatedAt: new Date(),
			})
			.where(eq(gameStats.userId, userId))
			.returning();

		return NextResponse.json(updatedStats);
	} catch (error) {
		console.error('Error updating game stats:', error);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}

