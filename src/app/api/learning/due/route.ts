import { db } from '@/db/drizzle';
import { favoritePhrases, phraseLearningProgress, phrases } from '@/db/schema';
import { checkAuth, createAuthErrorResponse } from '@/shared/lib/auth-utils';
import { and, asc, eq, lte, sql } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

const DEFAULT_LIMIT = 20;

// GET /api/learning/due?categoryId=&favoritesOnly=&hardOnly=&limit=
export async function GET(req: NextRequest) {
	try {
		const authResult = await checkAuth();
		if (!authResult.success || !authResult.user) {
			return createAuthErrorResponse(authResult);
		}

		const userId = authResult.user.id;
		const { searchParams } = req.nextUrl;
		const categoryId = searchParams.get('categoryId');
		const favoritesOnly = searchParams.get('favoritesOnly') === 'true';
		const hardOnly = searchParams.get('hardOnly') === 'true';
		const limit = Math.min(
			Number(searchParams.get('limit') || DEFAULT_LIMIT),
			50
		);
		const now = new Date();

		const existingDue = await db
			.select({
				phrase: phrases,
				progress: phraseLearningProgress,
			})
			.from(phraseLearningProgress)
			.innerJoin(phrases, eq(phrases.id, phraseLearningProgress.phraseId))
			.where(
				and(
					eq(phraseLearningProgress.userId, userId),
					lte(phraseLearningProgress.nextReviewAt, now),
					hardOnly ? sql`${phraseLearningProgress.failCount} > 0` : undefined,
					categoryId ? eq(phrases.categoryId, Number(categoryId)) : undefined,
					favoritesOnly
						? sql`EXISTS (
							SELECT 1 FROM "favoritePhrases" fp
							WHERE fp."userId" = ${userId} AND fp."phraseId" = ${phrases.id}
						)`
						: undefined
				)
			)
			.orderBy(asc(phraseLearningProgress.nextReviewAt))
			.limit(limit);

		if (hardOnly || existingDue.length >= limit) {
			return NextResponse.json(existingDue);
		}

		const dueIds = new Set(existingDue.map((row) => row.phrase.id));
		const needed = limit - existingDue.length;

		const newPhrases = favoritesOnly
			? await db
					.select({ phrase: phrases })
					.from(favoritePhrases)
					.innerJoin(phrases, eq(phrases.id, favoritePhrases.phraseId))
					.leftJoin(
						phraseLearningProgress,
						and(
							eq(phraseLearningProgress.phraseId, phrases.id),
							eq(phraseLearningProgress.userId, userId)
						)
					)
					.where(
						and(
							eq(favoritePhrases.userId, userId),
							sql`${phraseLearningProgress.phraseId} IS NULL`,
							categoryId ? eq(phrases.categoryId, Number(categoryId)) : undefined
						)
					)
					.orderBy(asc(phrases.order), asc(phrases.id))
					.limit(needed + dueIds.size)
			: await db
					.select({ phrase: phrases })
					.from(phrases)
					.leftJoin(
						phraseLearningProgress,
						and(
							eq(phraseLearningProgress.phraseId, phrases.id),
							eq(phraseLearningProgress.userId, userId)
						)
					)
					.where(
						and(
							sql`${phraseLearningProgress.phraseId} IS NULL`,
							categoryId ? eq(phrases.categoryId, Number(categoryId)) : undefined
						)
					)
					.orderBy(asc(phrases.order), asc(phrases.id))
					.limit(needed + dueIds.size);

		const seeded = newPhrases
			.filter((row) => row.phrase && !dueIds.has(row.phrase.id))
			.slice(0, needed)
			.map((row) => ({
				phrase: row.phrase,
				progress: null as null,
			}));

		return NextResponse.json([...existingDue, ...seeded]);
	} catch (error) {
		console.error('Get due cards error:', error);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}
