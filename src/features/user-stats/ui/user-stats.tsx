'use client';

import { useQuery } from '@tanstack/react-query';
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from '@/shared/components/ui/card';
import { Calendar, Clock, Flame, Activity } from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

async function getUserStatsRequest() {
	const response = await fetch('/api/user/stats');
	if (!response.ok) {
		throw new Error('Failed to fetch user stats');
	}
	return response.json();
}

export function UserStats() {
	const {
		data: stats,
		isLoading,
		isError,
	} = useQuery({
		queryKey: ['user-stats'],
		queryFn: getUserStatsRequest,
		retry: false,
	});

	if (isLoading) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>Статистика</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="text-sm text-muted-foreground">Загрузка...</p>
				</CardContent>
			</Card>
		);
	}

	if (isError || !stats) {
		return null;
	}

	const formatDate = (date: string | Date) => {
		return format(new Date(date), 'd MMMM yyyy', { locale: ru });
	};

	const formatDateTime = (date: string | Date) => {
		return format(new Date(date), 'd MMMM yyyy, HH:mm', { locale: ru });
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>Статистика</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="flex items-center gap-3">
					<Calendar className="size-5 text-primary" />
					<div className="flex-1">
						<p className="text-sm text-muted-foreground">Дата регистрации</p>
						<p className="font-medium">{formatDate(stats.registrationDate)}</p>
					</div>
				</div>
				<div className="flex items-center gap-3">
					<Clock className="size-5 text-primary" />
					<div className="flex-1">
						<p className="text-sm text-muted-foreground">Дней в системе</p>
						<p className="font-medium">{stats.daysInSystem}</p>
					</div>
				</div>
				<div className="flex items-center gap-3">
					<Flame className="size-5 text-primary" />
					<div className="flex-1">
						<p className="text-sm text-muted-foreground">Дней подряд</p>
						<p className="font-medium">{stats.consecutiveDays}</p>
					</div>
				</div>
				<div className="flex items-center gap-3">
					<Activity className="size-5 text-primary" />
					<div className="flex-1">
						<p className="text-sm text-muted-foreground">Последняя активность</p>
						<p className="font-medium">{formatDateTime(stats.lastActivity)}</p>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
