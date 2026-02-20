import { NextResponse } from 'next/server';

const YANDEX_METRIKA_API_URL = 'https://api-metrika.yandex.net/stat/v1/data';
const FALLBACK_COUNTER_ID = '105812506';

interface YandexMetrikaDimension {
	name?: string;
	id?: string;
}

interface YandexMetrikaRow {
	dimensions?: YandexMetrikaDimension[];
	metrics?: unknown[];
}

interface YandexMetrikaApiResponse {
	query?: {
		date1?: string;
		date2?: string;
	};
	totals?: unknown[];
	data?: YandexMetrikaRow[];
}

const toNumber = (value: unknown): number => {
	const parsed = Number(value);
	return Number.isFinite(parsed) ? parsed : 0;
};

// GET /api/admin/visitors - публичная статистика посетителей из Яндекс.Метрики
export async function GET() {
	try {
		const token = process.env.YANDEX_METRIKA_API_TOKEN;
		const counterId =
			process.env.YANDEX_METRIKA_COUNTER_ID ||
			process.env.NEXT_PUBLIC_YANDEX_METRIKA_COUNTER_ID ||
			FALLBACK_COUNTER_ID;

		if (!token) {
			return NextResponse.json({
				configured: false,
				message:
					'Для загрузки статистики добавьте YANDEX_METRIKA_API_TOKEN в переменные окружения.',
			});
		}

		const params = new URLSearchParams({
			ids: counterId,
			dimensions: 'ym:s:date',
			metrics: 'ym:s:users,ym:s:visits,ym:s:pageviews',
			date1: '6daysAgo',
			date2: 'today',
			sort: 'ym:s:date',
			accuracy: 'full',
			limit: '100',
		});

		const response = await fetch(`${YANDEX_METRIKA_API_URL}?${params.toString()}`, {
			method: 'GET',
			headers: {
				Authorization: `OAuth ${token}`,
			},
			cache: 'no-store',
		});

		if (!response.ok) {
			const errorBody = await response.text();
			console.error('Yandex Metrika API error:', response.status, errorBody);
			return NextResponse.json(
				{
					error: 'Не удалось получить данные из Яндекс.Метрики.',
				},
				{ status: 502 }
			);
		}

		const payload = (await response.json()) as YandexMetrikaApiResponse;
		const totals = payload.totals ?? [];
		const rows = payload.data ?? [];

		const daily = rows
			.map((row) => {
				const firstDimension = row.dimensions?.[0];
				const rawDate = firstDimension?.name || firstDimension?.id || '';
				const metrics = row.metrics ?? [];

				return {
					date: rawDate,
					users: toNumber(metrics[0]),
					visits: toNumber(metrics[1]),
					pageviews: toNumber(metrics[2]),
				};
			})
			.filter((row) => row.date);

		return NextResponse.json({
			configured: true,
			period: {
				from: payload.query?.date1 ?? null,
				to: payload.query?.date2 ?? null,
			},
			totals: {
				users: toNumber(totals[0]),
				visits: toNumber(totals[1]),
				pageviews: toNumber(totals[2]),
			},
			daily,
		});
	} catch (error) {
		console.error('Error fetching Yandex Metrika visitors:', error);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}
