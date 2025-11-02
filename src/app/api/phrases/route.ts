import { NextResponse } from 'next/server';
import { phrases, categories } from '../../../db/schema';
import { eq } from 'drizzle-orm';
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
			.orderBy(phrases.title);

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
		const { title, translate, transcription, categoryId } = await req.json();

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
			})
			.returning();

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
		const body = await req.json();
		const { id, title, translate, transcription, audioUrl, categoryId } = body;

		const updatedPhrase = await db
			.update(phrases)
			.set({
				title,
				translate,
				transcription,
				audioUrl,
				categoryId: Number(categoryId),
			})
			.where(eq(phrases.id, Number(id)))
			.returning();

		return NextResponse.json(updatedPhrase[0]);
	} catch (error) {
		return NextResponse.json({ error }, { status: 500 });
	}
}

// DELETE /api/phrases
export async function DELETE(req: NextRequest) {
	try {
		const { searchParams } = new URL(req.url);
		const phraseId = searchParams.get('id');

		if (!phraseId) {
			return NextResponse.json(
				{ error: 'Phrase ID is required' },
				{ status: 400 }
			);
		}

		await db.delete(phrases).where(eq(phrases.id, Number(phraseId)));

		return NextResponse.json(
			{ message: 'Phrase deleted successfully' },
			{ status: 200 }
		);
	} catch (error) {
		return NextResponse.json({ error }, { status: 500 });
	}
}
