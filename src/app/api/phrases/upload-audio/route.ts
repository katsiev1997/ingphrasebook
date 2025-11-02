import { NextResponse } from 'next/server';
import { phrases } from '../../../../db/schema';
import { eq } from 'drizzle-orm';
import type { NextRequest } from 'next/server';
import { put } from '@vercel/blob';
import {
	checkModeratorAuth,
	createAuthErrorResponse,
} from '@/shared/lib/auth-utils';
import { db } from '@/db/drizzle';

export async function POST(req: NextRequest) {
	try {
		// Проверяем авторизацию и права доступа
		const authResult = await checkModeratorAuth();
		if (!authResult.success) {
			return createAuthErrorResponse(authResult);
		}

		// Получаем данные формы
		const formData = await req.formData();
		const phraseId = formData.get('phraseId') as string;
		const audioFile = formData.get('audio') as File;

		if (!phraseId || !audioFile) {
			return NextResponse.json(
				{ error: 'Phrase ID and audio file are required' },
				{ status: 400 }
			);
		}

		// Валидация phraseId
		const phraseIdNumber = Number(phraseId);
		if (isNaN(phraseIdNumber) || phraseIdNumber <= 0 || !Number.isInteger(phraseIdNumber)) {
			return NextResponse.json(
				{ error: 'Phrase ID must be a positive integer' },
				{ status: 400 }
			);
		}

		// Проверяем существование фразы
		const phrase = await db
			.select()
			.from(phrases)
			.where(eq(phrases.id, phraseIdNumber))
			.limit(1);

		if (phrase.length === 0) {
			return NextResponse.json({ error: 'Phrase not found' }, { status: 404 });
		}

		// Проверяем тип файла
		if (!audioFile.type.startsWith('audio/')) {
			return NextResponse.json(
				{ error: 'Only audio files are allowed' },
				{ status: 400 }
			);
		}

		// Проверяем размер файла (максимум 10MB)
		if (audioFile.size > 10 * 1024 * 1024) {
			return NextResponse.json(
				{ error: 'File size must be less than 10MB' },
				{ status: 400 }
			);
		}

		// Генерируем уникальное имя файла с оригинальным расширением
		const fileExtension = audioFile.name.split('.').pop() || 'webm';
		const fileName = `phrase_${phraseIdNumber}_${Date.now()}.${fileExtension}`;

		// Загружаем файл в Vercel Blob Storage
		const { url } = await put(fileName, audioFile, {
			access: 'public',
			addRandomSuffix: false,
		});

		// Обновляем фразу в базе данных
		await db
			.update(phrases)
			.set({ audioUrl: url })
			.where(eq(phrases.id, phraseIdNumber));

		return NextResponse.json({
			success: true,
			audioUrl: url,
		});
	} catch (error) {
		console.error('Upload audio error:', error);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}
