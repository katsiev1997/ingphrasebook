import { db } from '@/db/drizzle';
import { phrases } from '../../../../db/schema';
import { eq, sql } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

// POST /api/phrases/view - Увеличить счетчик просмотров фразы
export async function POST(req: NextRequest) {
	try {
		const body = await req.json();
		const { phraseId } = body;

		if (!phraseId) {
			return NextResponse.json(
				{ error: 'Phrase ID is required' },
				{ status: 400 }
			);
		}

		// Увеличиваем счетчик просмотров
		const updatedPhrase = await db
			.update(phrases)
			.set({
				views: sql`${phrases.views} + 1`,
				updatedAt: new Date(),
			})
			.where(eq(phrases.id, Number(phraseId)))
			.returning();

		if (updatedPhrase.length === 0) {
			return NextResponse.json({ error: 'Phrase not found' }, { status: 404 });
		}

		return NextResponse.json({
			success: true,
			views: updatedPhrase[0].views,
		});
	} catch (error) {
		console.error('Error incrementing phrase views:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}

