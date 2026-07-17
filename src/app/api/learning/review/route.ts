import { db } from '@/db/drizzle';
import { phraseLearningProgress, phrases } from '@/db/schema';
import { checkAuth, createAuthErrorResponse } from '@/shared/lib/auth-utils';
import {
	applyReview,
	createFailEnqueueProgress,
	createInitialProgress,
} from '@/shared/lib/srs';
import { incrementUserActivity } from '@/shared/lib/user-activity';
import { and, eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

// POST /api/learning/review
// body: { phraseId, known } | { phraseIds: number[], enqueueFails: true }
export async function POST(req: NextRequest) {
	try {
		const authResult = await checkAuth();
		if (!authResult.success || !authResult.user) {
			return createAuthErrorResponse(authResult);
		}

		const userId = authResult.user.id;
		const body = await req.json();
		const now = new Date();

		if (body.enqueueFails === true && Array.isArray(body.phraseIds)) {
			const phraseIds = (body.phraseIds as unknown[])
				.map(Number)
				.filter((id) => Number.isInteger(id) && id > 0);

			for (const phraseId of phraseIds) {
				const phraseExists = await db
					.select({ id: phrases.id })
					.from(phrases)
					.where(eq(phrases.id, phraseId))
					.limit(1);
				if (phraseExists.length === 0) {
					continue;
				}

				const existing = await db
					.select()
					.from(phraseLearningProgress)
					.where(
						and(
							eq(phraseLearningProgress.userId, userId),
							eq(phraseLearningProgress.phraseId, phraseId)
						)
					)
					.limit(1);

				if (existing.length === 0) {
					const progress = createFailEnqueueProgress(now);
					await db.insert(phraseLearningProgress).values({
						userId,
						phraseId,
						...progress,
					});
				} else {
					await db
						.update(phraseLearningProgress)
						.set({
							failCount: existing[0].failCount + 1,
							nextReviewAt: now,
							level: 'learning',
							intervalDays: 0,
							repetitions: 0,
							updatedAt: now,
						})
						.where(
							and(
								eq(phraseLearningProgress.userId, userId),
								eq(phraseLearningProgress.phraseId, phraseId)
							)
						);
				}
			}

			return NextResponse.json({ enqueued: phraseIds.length });
		}

		const phraseId = Number(body.phraseId);
		const known = Boolean(body.known);

		if (
			!Number.isInteger(phraseId) ||
			phraseId <= 0 ||
			typeof body.known !== 'boolean'
		) {
			return NextResponse.json({ error: 'Invalid review payload' }, { status: 400 });
		}

		const phraseExists = await db
			.select({ id: phrases.id })
			.from(phrases)
			.where(eq(phrases.id, phraseId))
			.limit(1);

		if (phraseExists.length === 0) {
			return NextResponse.json({ error: 'Phrase not found' }, { status: 404 });
		}

		const existing = await db
			.select()
			.from(phraseLearningProgress)
			.where(
				and(
					eq(phraseLearningProgress.userId, userId),
					eq(phraseLearningProgress.phraseId, phraseId)
				)
			)
			.limit(1);

		const base =
			existing.length > 0
				? existing[0]
				: {
						...createInitialProgress(now),
						userId,
						phraseId,
					};

		const next = applyReview(
			{
				level: base.level,
				easeFactor: base.easeFactor,
				intervalDays: base.intervalDays,
				repetitions: base.repetitions,
				successCount: base.successCount,
				failCount: base.failCount,
			},
			known,
			now
		);

		let saved;
		if (existing.length === 0) {
			[saved] = await db
				.insert(phraseLearningProgress)
				.values({
					userId,
					phraseId,
					...next,
				})
				.returning();
		} else {
			[saved] = await db
				.update(phraseLearningProgress)
				.set({
					...next,
					updatedAt: now,
				})
				.where(
					and(
						eq(phraseLearningProgress.userId, userId),
						eq(phraseLearningProgress.phraseId, phraseId)
					)
				)
				.returning();
		}

		await incrementUserActivity(userId, 'reviewsCount', 1, now);

		return NextResponse.json(saved);
	} catch (error) {
		console.error('Review error:', error);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}
