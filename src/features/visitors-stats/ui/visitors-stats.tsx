'use client';

import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Activity, Eye, MousePointerClick, Users } from 'lucide-react';
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from '@/shared/components/ui/card';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/shared/components/ui/table';

interface VisitorsStatsResponse {
	configured: boolean;
	message?: string;
	error?: string;
	period?: {
		from: string | null;
		to: string | null;
	};
	totals?: {
		users: number;
		visits: number;
		pageviews: number;
	};
	daily?: Array<{
		date: string;
		users: number;
		visits: number;
		pageviews: number;
	}>;
}

async function getVisitorsStatsRequest(): Promise<VisitorsStatsResponse> {
	const response = await fetch('/api/visitors', { cache: 'no-store' });

	if (!response.ok) {
		let message = 'Не удалось загрузить статистику посетителей.';

		try {
			const errorPayload = (await response.json()) as { error?: string };
			if (errorPayload.error) {
				message = errorPayload.error;
			}
		} catch {
			// Игнорируем ошибку парсинга и используем стандартный текст.
		}

		throw new Error(message);
	}

	return response.json();
}

const formatDate = (value: string | null | undefined): string => {
	if (!value) {
		return '-';
	}

	const parsedDate = new Date(value);
	if (Number.isNaN(parsedDate.getTime())) {
		return value;
	}

	return format(parsedDate, 'd MMM', { locale: ru });
};

const formatNumber = (value: number): string => {
	return value.toLocaleString('ru-RU');
};

export function VisitorsStats() {
	const { data, isLoading, isError, error } = useQuery({
		queryKey: ['visitors-stats'],
		queryFn: getVisitorsStatsRequest,
		retry: false,
		refetchOnWindowFocus: false,
	});

	if (isLoading) {
		return (
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Activity className="size-5 text-primary" />
						Посетители сайта
					</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="text-sm text-muted-foreground">Загрузка...</p>
				</CardContent>
			</Card>
		);
	}

	if (isError) {
		return (
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Activity className="size-5 text-primary" />
						Посетители сайта
					</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="text-sm text-destructive">
						{error instanceof Error
							? error.message
							: 'Не удалось загрузить статистику.'}
					</p>
				</CardContent>
			</Card>
		);
	}

	if (!data) {
		return null;
	}

	if (!data.configured) {
		return (
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Activity className="size-5 text-primary" />
						Посетители сайта
					</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="text-sm text-muted-foreground">
						{data.message ||
							'Статистика недоступна. Проверьте настройки Яндекс.Метрики.'}
					</p>
				</CardContent>
			</Card>
		);
	}

	const totals = data.totals ?? { users: 0, visits: 0, pageviews: 0 };
	const daily = data.daily ?? [];
	const periodLabel =
		data.period?.from && data.period?.to
			? `${formatDate(data.period.from)} - ${formatDate(data.period.to)}`
			: 'последние 7 дней';

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Activity className="size-5 text-primary" />
					Посетители сайта
				</CardTitle>
				<p className="text-xs text-muted-foreground">
					Данные Яндекс.Метрики за {periodLabel}
				</p>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
					<div className="rounded-lg border p-3">
						<div className="mb-1 flex items-center gap-2 text-xs text-muted-foreground">
							<Users className="size-4" />
							Пользователи
						</div>
						<p className="text-lg font-semibold">{formatNumber(totals.users)}</p>
					</div>
					<div className="rounded-lg border p-3">
						<div className="mb-1 flex items-center gap-2 text-xs text-muted-foreground">
							<MousePointerClick className="size-4" />
							Визиты
						</div>
						<p className="text-lg font-semibold">{formatNumber(totals.visits)}</p>
					</div>
					<div className="rounded-lg border p-3">
						<div className="mb-1 flex items-center gap-2 text-xs text-muted-foreground">
							<Eye className="size-4" />
							Просмотры
						</div>
						<p className="text-lg font-semibold">
							{formatNumber(totals.pageviews)}
						</p>
					</div>
				</div>

				{daily.length > 0 && (
					<div>
						<p className="mb-2 text-xs text-muted-foreground">По дням</p>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Дата</TableHead>
									<TableHead>Пользователи</TableHead>
									<TableHead>Визиты</TableHead>
									<TableHead>Просмотры</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{daily.map((row) => (
									<TableRow key={row.date}>
										<TableCell>{formatDate(row.date)}</TableCell>
										<TableCell>{formatNumber(row.users)}</TableCell>
										<TableCell>{formatNumber(row.visits)}</TableCell>
										<TableCell>{formatNumber(row.pageviews)}</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
