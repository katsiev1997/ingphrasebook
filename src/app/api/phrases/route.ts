import { NextResponse } from 'next/server';
import { phrases, categories } from '../../../db/schema';
import { eq, asc } from 'drizzle-orm';
import type { NextRequest } from 'next/server';
import {
	checkModeratorAuth,
	createAuthErrorResponse,
} from '../../../shared/lib/auth-utils';
import { db } from '@/db/drizzle';

// GET /api/phrases
export async function GET(req: NextRequest) {
	try {
		const { searchParams } = req.nextUrl;
		const categoryId = searchParams.get('categoryId');

		if (!categoryId) {
			return NextResponse.json({ error: 'Category not found' }, { status: 404 });
		}

		const phrasesList = await db
			.select()
			.from(phrases)
			.where(eq(phrases.categoryId, Number(categoryId)))
			.orderBy(asc(phrases.order), asc(phrases.id));

		// Проверяем длину массива фраз
		if (phrasesList.length === 0) {
			return NextResponse.json({ error: 'No phrases found' }, { status: 404 });
		}

		return NextResponse.json(phrasesList);
	} catch (error) {
		return NextResponse.json({ error }, { status: 500 });
	}
}

// POST /api/phrases
export async function POST(req: NextRequest) {
	try {
		// Проверяем авторизацию и права доступа
		const authResult = await checkModeratorAuth();
		if (!authResult.success) {
			return createAuthErrorResponse(authResult);
		}

		// Получаем данные из запроса
		const { title, translate, transcription, categoryId, order } = await req.json();

		// Валидация данных
		if (!title || !translate || !transcription || !categoryId) {
			return NextResponse.json(
				{ error: 'All fields are required' },
				{ status: 400 }
			);
		}

		// Проверяем существование категории
		const category = await db
			.select()
			.from(categories)
			.where(eq(categories.id, Number(categoryId)))
			.limit(1);

		if (category.length === 0) {
			return NextResponse.json({ error: 'Category not found' }, { status: 404 });
		}

		// Создаем новую фразу
		const phrase = await db
			.insert(phrases)
			.values({
				title,
				translate,
				transcription,
				categoryId: Number(categoryId),
				order: order !== undefined ? Number(order) : 0,
				updatedAt: new Date(),
			})
			.returning();

		// Обновляем updatedAt категории после добавления фразы
		// Это нужно для корректной работы кеширования на клиенте
		await db
			.update(categories)
			.set({ updatedAt: new Date() })
			.where(eq(categories.id, Number(categoryId)));

		return NextResponse.json({
			success: true,
			phrase: phrase[0],
		});
	} catch (error) {
		console.error('Create phrase error:', error);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}

// PUT /api/phrases
export async function PUT(req: NextRequest) {
	try {
		// Проверяем авторизацию и права доступа
		const authResult = await checkModeratorAuth();
		if (!authResult.success) {
			return createAuthErrorResponse(authResult);
		}

		const body = await req.json();
		const { id, title, translate, transcription, audioUrl, categoryId, order } = body;

		const updateData: {
			title: string;
			translate: string;
			transcription: string;
			audioUrl: string | null | undefined;
			categoryId: number | null;
			updatedAt: Date;
			order?: number;
		} = {
			title,
			translate,
			transcription,
			audioUrl,
			categoryId: Number(categoryId),
			updatedAt: new Date(),
		};
		
		if (order !== undefined) {
			updateData.order = Number(order);
		}

		const updatedPhrase = await db
			.update(phrases)
			.set(updateData)
			.where(eq(phrases.id, Number(id)))
			.returning();

		// Обновляем updatedAt категории, к которой относится фраза
		if (categoryId) {
			await db
				.update(categories)
				.set({ updatedAt: new Date() })
				.where(eq(categories.id, Number(categoryId)));
		}

		return NextResponse.json(updatedPhrase[0]);
	} catch (error) {
		return NextResponse.json({ error }, { status: 500 });
	}
}

// DELETE /api/phrases
export async function DELETE(req: NextRequest) {
	try {
		// Проверяем авторизацию и права доступа
		const authResult = await checkModeratorAuth();
		if (!authResult.success) {
			return createAuthErrorResponse(authResult);
		}

		const { searchParams } = new URL(req.url);
		const phraseId = searchParams.get('id');

		if (!phraseId) {
			return NextResponse.json(
				{ error: 'Phrase ID is required' },
				{ status: 400 }
			);
		}

		// Получаем фразу, чтобы узнать categoryId
		const existing = await db
			.select()
			.from(phrases)
			.where(eq(phrases.id, Number(phraseId)))
			.limit(1);
		const categoryId = existing[0]?.categoryId;

		await db.delete(phrases).where(eq(phrases.id, Number(phraseId)));

		// Обновляем updatedAt категории, если известна
		if (categoryId) {
			await db
				.update(categories)
				.set({ updatedAt: new Date() })
				.where(eq(categories.id, Number(categoryId)));
		}

		return NextResponse.json(
			{ message: 'Phrase deleted successfully' },
			{ status: 200 }
		);
	} catch (error) {
		return NextResponse.json({ error }, { status: 500 });
	}
}
