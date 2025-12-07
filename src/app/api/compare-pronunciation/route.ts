import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { put } from '@vercel/blob';

const HF_API_URL =
	'https://katsiev1997-pronunciation-checker.hf.space/api/predict';

export async function POST(req: NextRequest) {
	try {
		const formData = await req.formData();
		const referenceAudioUrl = formData.get('referenceAudioUrl') as string | null;
		const referenceAudioFile = formData.get('referenceAudio') as File | null;
		const userAudioFile = formData.get('userAudio') as File;

		if (!userAudioFile) {
			return NextResponse.json(
				{ error: 'User audio file is required' },
				{ status: 400 }
			);
		}

		if (!referenceAudioUrl && !referenceAudioFile) {
			return NextResponse.json(
				{ error: 'Either reference audio URL or file is required' },
				{ status: 400 }
			);
		}

		// Проверяем тип файла пользователя
		if (!userAudioFile.type.startsWith('audio/')) {
			return NextResponse.json(
				{ error: 'Only audio files are allowed' },
				{ status: 400 }
			);
		}

		let referenceAudioUrlFinal: string;

		// Если передан URL эталонного аудио, используем его напрямую
		if (referenceAudioUrl) {
			referenceAudioUrlFinal = referenceAudioUrl;
		} else if (referenceAudioFile) {
			// Если передан файл, загружаем его
			if (!referenceAudioFile.type.startsWith('audio/')) {
				return NextResponse.json(
					{ error: 'Only audio files are allowed' },
					{ status: 400 }
				);
			}
			const referenceFileName = `temp_reference_${Date.now()}_${
				referenceAudioFile.name
			}`;
			const referenceBlob = await put(referenceFileName, referenceAudioFile, {
				access: 'public',
				addRandomSuffix: false,
			});
			referenceAudioUrlFinal = referenceBlob.url;
		} else {
			return NextResponse.json(
				{ error: 'Reference audio is required' },
				{ status: 400 }
			);
		}

		// Загружаем пользовательский файл во временное хранилище
		const userFileName = `temp_user_${Date.now()}_${userAudioFile.name}`;
		const userBlob = await put(userFileName, userAudioFile, {
			access: 'public',
			addRandomSuffix: false,
		});

		try {
			// Вызываем Hugging Face API
			// Gradio API ожидает простые URL строки в массиве data
			const hfResponse = await fetch(HF_API_URL, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					data: [referenceAudioUrlFinal, userBlob.url],
				}),
				// Таймаут 60 секунд для обработки аудио
				signal: AbortSignal.timeout(60000),
			});

			if (!hfResponse.ok) {
				const errorText = await hfResponse.text();
				console.error('Hugging Face API error:', hfResponse.status, errorText);

				// Специальная обработка для разных статусов
				let errorMessage = 'Не удалось сравнить произношение';
				let userFriendlyMessage = errorMessage;

				if (hfResponse.status === 503) {
					errorMessage = 'Hugging Face Space недоступен (503)';
					userFriendlyMessage =
						'Сервис сравнения произношения временно недоступен. Возможные причины:\n' +
						'• Space еще не запустился (проверьте статус на Hugging Face)\n' +
						'• Space спит (бесплатные Spaces засыпают после неактивности)\n' +
						'• Space перегружен\n\n' +
						'Попробуйте позже или проверьте статус Space на Hugging Face.';
				} else if (hfResponse.status === 500) {
					errorMessage = 'Hugging Face Space внутренняя ошибка (500)';
					userFriendlyMessage =
						'Произошла ошибка на стороне сервиса сравнения произношения. ' +
						'Возможно, Space не запустился из-за ошибки в коде. ' +
						'Проверьте логи Space на Hugging Face.';
				} else if (hfResponse.status === 504) {
					errorMessage = 'Hugging Face Space таймаут (504)';
					userFriendlyMessage =
						'Превышено время ожидания ответа от сервиса сравнения произношения. ' +
						'Попробуйте позже.';
				} else {
					errorMessage = `Hugging Face API error: ${hfResponse.status}`;
					userFriendlyMessage = `Ошибка сервиса сравнения произношения (${hfResponse.status})`;
				}

				return NextResponse.json(
					{
						error: errorMessage,
						userMessage: userFriendlyMessage,
						status: hfResponse.status,
						details: errorText.substring(0, 500), // Ограничиваем длину
					},
					{ status: hfResponse.status >= 500 ? 503 : hfResponse.status }
				);
			}

			const hfResult = await hfResponse.json();

			// Gradio API возвращает результат в формате { data: { similarity, percent, feedback, ... } }
			// где data - это объект напрямую, а не массив
			const result = hfResult.data || hfResult;

			// Извлекаем similarity (число от 0 до 1) или percent (число от 0 до 100)
			let score: number;
			if (typeof result === 'number') {
				// Если результат - просто число
				score = result;
			} else if (result && typeof result === 'object') {
				// Если результат - объект, извлекаем similarity или percent
				if (typeof result.similarity === 'number') {
					score = result.similarity;
				} else if (typeof result.percent === 'number') {
					score = result.percent / 100; // Конвертируем проценты в 0-1
				} else if (typeof result.score === 'number') {
					score = result.score;
				} else {
					// Fallback: пытаемся найти любое числовое значение
					const values = Object.values(result).filter(
						(v) => typeof v === 'number' && v >= 0 && v <= 1
					);
					score = values.length > 0 ? (values[0] as number) : 0;
				}
			} else {
				score = 0;
			}

			// Ограничиваем score в диапазоне 0-1
			score = Math.max(0, Math.min(1, score));

			return NextResponse.json({
				success: true,
				score,
				// Дополнительная информация из Space (если есть)
				...(result &&
					typeof result === 'object' && {
						feedback: result.feedback,
						method: result.method,
						percent: result.percent || Math.round(score * 100 * 10) / 10,
					}),
			});
		} catch (error) {
			console.error('Hugging Face API call failed:', error);
			// Если это не наш обработанный ответ, пробрасываем дальше
			if (
				error instanceof Error &&
				error.message.includes('Hugging Face API error')
			) {
				throw error;
			}
			// Обработка таймаута
			if (error instanceof Error && error.name === 'TimeoutError') {
				throw new Error(
					'Превышено время ожидания ответа от сервиса сравнения произношения (60 секунд). ' +
						'Попробуйте позже или используйте более короткие аудиофайлы.'
				);
			}
			// Для других ошибок (сеть, таймаут и т.д.)
			throw new Error(
				'Не удалось подключиться к сервису сравнения произношения. Проверьте подключение к интернету.'
			);
		}
	} catch (error) {
		console.error('Compare pronunciation error:', error);

		// Если это уже обработанная ошибка с userMessage, возвращаем её
		if (
			error instanceof Error &&
			error.message.includes('Hugging Face API error')
		) {
			// Это уже обработано выше, не должно сюда попасть
		}

		return NextResponse.json(
			{
				error: 'Failed to compare pronunciation',
				userMessage:
					error instanceof Error
						? error.message
						: 'Произошла неизвестная ошибка при сравнении произношения',
				details: error instanceof Error ? error.message : 'Unknown error',
			},
			{ status: 500 }
		);
	}
}
