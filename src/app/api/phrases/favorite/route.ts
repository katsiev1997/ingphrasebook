import { db } from '@/db/drizzle';
import { users, phrases, favoritePhrases } from '../../../../db/schema';
import { eq, and } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/phrases/favorites?userId=1
export async function GET(req: NextRequest) {
	try {
		const { searchParams } = new URL(req.url);
		const userId = searchParams.get('userId');

		// Проверка на наличие userId в запросе
		if (!userId) {
			return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
		}

		// Проверяем существование пользователя
		const user = await db
			.select()
			.from(users)
			.where(eq(users.id, Number(userId)))
			.limit(1);

		if (user.length === 0) {
			return NextResponse.json({ error: 'User not found' }, { status: 404 });
		}

		// Получаем избранные фразы пользователя
		const userFavorites = await db
			.select({
				userId: favoritePhrases.userId,
				phraseId: favoritePhrases.phraseId,
				phrase: {
					id: phrases.id,
					title: phrases.title,
					translate: phrases.translate,
					transcription: phrases.transcription,
					audioUrl: phrases.audioUrl,
					categoryId: phrases.categoryId,
					createdAt: phrases.createdAt,
					updatedAt: phrases.updatedAt,
				},
			})
			.from(favoritePhrases)
			.leftJoin(phrases, eq(favoritePhrases.phraseId, phrases.id))
			.where(eq(favoritePhrases.userId, Number(userId)));

		// Возвращаем только фразы
		const favoritePhrasesList = userFavorites
			.map((fav) => fav.phrase)
			.filter(Boolean);
		return NextResponse.json(favoritePhrasesList);
	} catch (error) {
		return NextResponse.json({ error }, { status: 500 });
	}
}

// POST /api/phrases/favorite
export async function POST(req: NextRequest) {
	try {
		const body = await req.json();
		const { userId, phraseId } = body;

		// Проверка на наличие необходимых данных
		if (!userId || !phraseId) {
			return NextResponse.json(
				{ error: 'User ID and Phrase ID are required' },
				{ status: 400 }
			);
		}

		// Проверяем, существует ли пользователь
		const user = await db
			.select()
			.from(users)
			.where(eq(users.id, Number(userId)))
			.limit(1);

		if (user.length === 0) {
			return NextResponse.json({ error: 'User not found' }, { status: 404 });
		}

		// Проверяем, существует ли фраза
		const phrase = await db
			.select()
			.from(phrases)
			.where(eq(phrases.id, Number(phraseId)))
			.limit(1);

		if (phrase.length === 0) {
			return NextResponse.json({ error: 'Phrase not found' }, { status: 404 });
		}

		// Проверяем, не добавлена ли уже фраза в избранное
		const existingFavorite = await db
			.select()
			.from(favoritePhrases)
			.where(
				and(
					eq(favoritePhrases.userId, Number(userId)),
					eq(favoritePhrases.phraseId, Number(phraseId))
				)
			)
			.limit(1);

		if (existingFavorite.length > 0) {
			return NextResponse.json(
				{ error: 'Phrase already in favorites' },
				{ status: 409 }
			);
		}

		// Добавляем фразу в избранное пользователя
		await db.insert(favoritePhrases).values({
			userId: Number(userId),
			phraseId: Number(phraseId),
		});

		// Получаем обновленный список избранных фраз
		const updatedFavorites = await db
			.select({
				userId: favoritePhrases.userId,
				phraseId: favoritePhrases.phraseId,
				phrase: {
					id: phrases.id,
					title: phrases.title,
					translate: phrases.translate,
					transcription: phrases.transcription,
					audioUrl: phrases.audioUrl,
					categoryId: phrases.categoryId,
					createdAt: phrases.createdAt,
					updatedAt: phrases.updatedAt,
				},
			})
			.from(favoritePhrases)
			.leftJoin(phrases, eq(favoritePhrases.phraseId, phrases.id))
			.where(eq(favoritePhrases.userId, Number(userId)));

		const favoritePhrasesList = updatedFavorites
			.map((fav) => fav.phrase)
			.filter(Boolean);

		return NextResponse.json({
			...user[0],
			favoritePhrases: favoritePhrasesList,
		});
	} catch (error) {
		return NextResponse.json({ error }, { status: 500 });
	}
}

// DELETE /api/phrases/favorite
export async function DELETE(req: NextRequest) {
	try {
		const { searchParams } = new URL(req.url);
		const userId = searchParams.get('userId');
		const phraseId = searchParams.get('phraseId');

		if (!userId || !phraseId) {
			return NextResponse.json(
				{ error: 'User ID and Phrase ID are required' },
				{ status: 400 }
			);
		}

		// Удаляем фразу из избранного
		await db
			.delete(favoritePhrases)
			.where(
				and(
					eq(favoritePhrases.userId, Number(userId)),
					eq(favoritePhrases.phraseId, Number(phraseId))
				)
			);

		// Получаем обновленный список избранных фраз
		const updatedFavorites = await db
			.select({
				userId: favoritePhrases.userId,
				phraseId: favoritePhrases.phraseId,
				phrase: {
					id: phrases.id,
					title: phrases.title,
					translate: phrases.translate,
					transcription: phrases.transcription,
					audioUrl: phrases.audioUrl,
					categoryId: phrases.categoryId,
					createdAt: phrases.createdAt,
					updatedAt: phrases.updatedAt,
				},
			})
			.from(favoritePhrases)
			.leftJoin(phrases, eq(favoritePhrases.phraseId, phrases.id))
			.where(eq(favoritePhrases.userId, Number(userId)));

		const favoritePhrasesList = updatedFavorites
			.map((fav) => fav.phrase)
			.filter(Boolean);

		// Получаем информацию о пользователе
		const user = await db
			.select()
			.from(users)
			.where(eq(users.id, Number(userId)))
			.limit(1);

		return NextResponse.json({
			...user[0],
			favoritePhrases: favoritePhrasesList,
		});
	} catch (error) {
		return NextResponse.json({ error }, { status: 500 });
	}
}
