import { db } from '@/db/drizzle';
import { phrases, categories } from '../../../../db/schema';
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
				order: phrases.order,
				views: phrases.views,
				favoritesCount: phrases.favoritesCount,
				createdAt: phrases.createdAt,
				updatedAt: phrases.updatedAt,
				category: {
					id: categories.id,
					name: categories.name,
					icon: categories.icon,
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

		return NextResponse.json(phrasesList);
	} catch (error) {
		console.error('Search phrases failed:', error);
		return NextResponse.json(
			{ error: 'Failed to search phrases' },
			{ status: 500 }
		);
	}
}
