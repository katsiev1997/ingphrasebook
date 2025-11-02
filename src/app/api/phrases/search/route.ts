import { db } from '@/db/drizzle';
import { phrases, categories, favoritePhrases } from '../../../../db/schema';
import { ilike, or, eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/phrases/search
export async function GET(req: NextRequest) {
	try {
		const { searchParams } = new URL(req.url);
		const query = searchParams.get('query');

		if (!query) {
			return NextResponse.json(
				{ error: 'Search query is required' },
				{ status: 400 }
			);
		}

		const phrasesList = await db
			.select({
				id: phrases.id,
				title: phrases.title,
				translate: phrases.translate,
				transcription: phrases.transcription,
				audioUrl: phrases.audioUrl,
				categoryId: phrases.categoryId,
				createdAt: phrases.createdAt,
				updatedAt: phrases.updatedAt,
				category: {
					id: categories.id,
					name: categories.name,
					createdAt: categories.createdAt,
					updatedAt: categories.updatedAt,
				},
			})
			.from(phrases)
			.leftJoin(categories, eq(phrases.categoryId, categories.id))
			.where(
				or(
					ilike(phrases.title, `%${query}%`),
					ilike(phrases.translate, `%${query}%`)
				)
			);

		// Получаем информацию о том, кто добавил фразы в избранное
		const phrasesWithFavorites = await Promise.all(
			phrasesList.map(async (phrase) => {
				const favorites = await db
					.select()
					.from(favoritePhrases)
					.where(eq(favoritePhrases.phraseId, phrase.id));

				return {
					...phrase,
					favoritedBy: favorites,
				};
			})
		);

		return NextResponse.json(phrasesWithFavorites);
	} catch (error) {
		return NextResponse.json({ error }, { status: 500 });
	}
}
