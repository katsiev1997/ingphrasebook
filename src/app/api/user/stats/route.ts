import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { db } from '@/db/drizzle';
import { users, gameStats, favoritePhrases } from '@/db/schema';
import { checkAuth, createAuthErrorResponse } from '@/shared/lib/auth-utils';
import { eq, sql, desc } from 'drizzle-orm';

// GET /api/user/stats - Получить статистику пользователя
export async function GET(req: NextRequest) {
	try {
		const authResult = await checkAuth();

		if (!authResult.success || !authResult.user) {
			return createAuthErrorResponse(authResult);
		}

		const userId = authResult.user.id;

		// Получаем данные пользователя
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

		// Вычисляем количество дней в системе
		const daysInSystem = Math.floor(
			(now.getTime() - registrationDate.getTime()) / (1000 * 60 * 60 * 24)
		);

		// Получаем статистику игр
		const stats = await db
			.select()
			.from(gameStats)
			.where(eq(gameStats.userId, userId))
			.limit(1);

		// Получаем количество избранных фраз
		const favoriteCount = await db
			.select({ count: sql<number>`count(*)` })
			.from(favoritePhrases)
			.where(eq(favoritePhrases.userId, userId));

		// Определяем последнюю активность
		// Используем updatedAt из gameStats, если статистика есть
		const lastActivity = stats.length > 0 && stats[0].updatedAt 
			? stats[0].updatedAt 
			: registrationDate;

		// Вычисляем количество дней подряд
		// Упрощенная логика: если последняя активность была сегодня, считаем 1 день
		// Для более точного подсчета нужна таблица истории активности
		let consecutiveDays = 0;
		if (stats.length > 0 && stats[0].updatedAt) {
			const lastActivityDate = stats[0].updatedAt;
			const today = new Date(now);
			today.setHours(0, 0, 0, 0);
			
			const lastActivityDay = new Date(lastActivityDate);
			lastActivityDay.setHours(0, 0, 0, 0);
			
			const daysDiff = Math.floor(
				(today.getTime() - lastActivityDay.getTime()) / (1000 * 60 * 60 * 24)
			);
			
			// Если активность была сегодня, считаем 1 день подряд
			// Если вчера, тоже 1 день (серия продолжается)
			if (daysDiff === 0) {
				consecutiveDays = 1;
			} else if (daysDiff === 1) {
				consecutiveDays = 1; // Упрощенная логика: считаем что серия продолжается
			}
		}

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
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}

