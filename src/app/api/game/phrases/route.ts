import { NextResponse } from 'next/server';
import { db } from '@/db/drizzle';
import { phrases } from '@/db/schema';
import { sql } from 'drizzle-orm';

// GET /api/game/phrases - Получить случайные фразы для игры
export async function GET() {
	try {
		// Получаем случайные 60 фраз из всех категорий (хватит на 10+ вопросов)
		const randomPhrases = await db
			.select()
			.from(phrases)
			.orderBy(sql`RANDOM()`)
			.limit(60);

		if (randomPhrases.length < 4) {
			return NextResponse.json(
				{ error: 'Not enough phrases in database' },
				{ status: 400 }
			);
		}

		return NextResponse.json(randomPhrases);
	} catch (error) {
		console.error('Error fetching game phrases:', error);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}
