import { NextResponse } from 'next/server';
import { phrases } from '../../../../db/schema';
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

		if (!phraseData.audioUrl) {
			return NextResponse.json(
				{ error: 'No audio file found for this phrase' },
				{ status: 404 }
			);
		}

		// Удаляем файл из Vercel Blob Storage
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

		return NextResponse.json({
			success: true,
			message: 'Audio file deleted successfully',
		});
	} catch (error) {
		console.error('Delete audio error:', error);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}
