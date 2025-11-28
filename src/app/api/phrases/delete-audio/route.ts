import { NextResponse } from 'next/server';
import { phrases, categories } from '../../../../db/schema';
import { eq } from 'drizzle-orm';
import type { NextRequest } from 'next/server';
import { del } from '@vercel/blob';
import {
	checkModeratorAuth,
	createAuthErrorResponse,
} from '../../../../shared/lib/auth-utils';
import { db } from '@/db/drizzle';

export async function DELETE(req: NextRequest) {
	try {
		// Проверяем авторизацию и права доступа
		const authResult = await checkModeratorAuth();
		if (!authResult.success) {
			return createAuthErrorResponse(authResult);
		}

		// Получаем phraseId из URL параметров
		const { searchParams } = new URL(req.url);
		const phraseId = searchParams.get('phraseId');

		if (!phraseId) {
			return NextResponse.json(
				{ error: 'Phrase ID is required' },
				{ status: 400 }
			);
		}

		// Получаем фразу из базы данных
		const phrase = await db
			.select()
			.from(phrases)
			.where(eq(phrases.id, Number(phraseId)))
			.limit(1);

		if (phrase.length === 0) {
			return NextResponse.json({ error: 'Phrase not found' }, { status: 404 });
		}

		const phraseData = phrase[0];

		// Удаляем файл из Vercel Blob Storage (если он существует)
		if (phraseData.audioUrl) {
			try {
				await del(phraseData.audioUrl);
			} catch (error) {
				console.error('Error deleting blob:', error);
				// Продолжаем выполнение даже если файл не найден в blob storage
			}
		}

		// Обновляем фразу в базе данных
		await db
			.update(phrases)
			.set({ audioUrl: null })
			.where(eq(phrases.id, Number(phraseId)));

		// Обновляем updatedAt категории для инвалидации кеша на клиенте
		if (phraseData.categoryId) {
			await db
				.update(categories)
				.set({ updatedAt: new Date() })
				.where(eq(categories.id, Number(phraseData.categoryId)));
		}

		return NextResponse.json({
			success: true,
			message: 'Audio file deleted successfully',
			categoryId: phraseData.categoryId,
		});
	} catch (error) {
		console.error('Delete audio error:', error);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}
