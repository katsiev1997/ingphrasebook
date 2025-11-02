import { NextResponse } from 'next/server';
import { dialogues, messages } from '../../../db/schema';
import { eq, desc } from 'drizzle-orm';
import type { NextRequest } from 'next/server';
import {
	checkModeratorAuth,
	createAuthErrorResponse,
} from '@/shared/lib/auth-utils';
import { db } from '@/db/drizzle';

// GET /api/dialogs
export async function GET() {
	try {
		const dialoguesList = await db
			.select()
			.from(dialogues)
			.orderBy(desc(dialogues.createdAt));

		// Получаем сообщения для каждого диалога
		const dialoguesWithMessages = await Promise.all(
			dialoguesList.map(async (dialogue) => {
				const dialogueMessages = await db
					.select()
					.from(messages)
					.where(eq(messages.dialogueId, dialogue.id));

				return {
					...dialogue,
					messages: dialogueMessages,
				};
			})
		);

		return NextResponse.json(dialoguesWithMessages);
	} catch (error) {
		console.error('Get dialogues error:', error);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}

// POST /api/dialogs
export async function POST(req: NextRequest) {
	try {
		// Проверяем авторизацию и права доступа
		const authResult = await checkModeratorAuth();
		if (!authResult.success) {
			return createAuthErrorResponse(authResult);
		}

		// Получаем данные из запроса
		const { title, messages: messagesData } = await req.json();

		// Валидация данных
		if (!title || typeof title !== 'string' || title.trim().length === 0) {
			return NextResponse.json(
				{ error: 'Title must be a non-empty string' },
				{ status: 400 }
			);
		}

		if (
			!messagesData ||
			!Array.isArray(messagesData) ||
			messagesData.length === 0
		) {
			return NextResponse.json(
				{ error: 'Messages array is required and must not be empty' },
				{ status: 400 }
			);
		}

		// Валидация сообщений
		for (const message of messagesData) {
			if (
				!message.originalText ||
				typeof message.originalText !== 'string' ||
				message.originalText.trim().length === 0
			) {
				return NextResponse.json(
					{
						error: 'All messages must have a non-empty originalText string',
					},
					{ status: 400 }
				);
			}

			if (
				!message.translatedText ||
				typeof message.translatedText !== 'string' ||
				message.translatedText.trim().length === 0
			) {
				return NextResponse.json(
					{
						error: 'All messages must have a non-empty translatedText string',
					},
					{ status: 400 }
				);
			}
		}

		// Создаем диалог
		const newDialogue = await db
			.insert(dialogues)
			.values({
				title: title.trim(),
			})
			.returning();

		const dialogueId = newDialogue[0].id;

		// Создаем сообщения для диалога
		const dialogueMessages = await db
			.insert(messages)
			.values(
				messagesData.map(
					(message: { originalText: string; translatedText: string }) => ({
						originalText: message.originalText.trim(),
						translatedText: message.translatedText.trim(),
						dialogueId,
					})
				)
			)
			.returning();

		const dialogue = {
			...newDialogue[0],
			messages: dialogueMessages,
		};

		return NextResponse.json({
			success: true,
			dialogue,
		});
	} catch (error) {
		console.error('Create dialogue error:', error);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}
