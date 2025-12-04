'use client';

import { useGetLeaderboard } from '../model/queries/use-get-leaderboard';
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from '@/shared/components/ui/card';
import { Trophy, Medal, Award } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

export function Leaderboard() {
	const { data: leaderboard, isLoading } = useGetLeaderboard(10);

	if (isLoading) {
		return (
			<Card className="mb-6">
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Trophy className="size-5 text-primary" />
						Топ игроков
					</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="text-sm text-muted-foreground">Загрузка...</p>
				</CardContent>
			</Card>
		);
	}

	if (!leaderboard || leaderboard.length === 0) {
		return (
			<Card className="mb-6">
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Trophy className="size-5 text-primary" />
						Топ игроков
					</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="text-sm text-muted-foreground">
						Пока нет игроков в рейтинге
					</p>
				</CardContent>
			</Card>
		);
	}

	const getRankIcon = (index: number) => {
		if (index === 0) return <Trophy className="size-5 text-yellow-500" />;
		if (index === 1) return <Medal className="size-5 text-gray-400" />;
		if (index === 2) return <Award className="size-5 text-amber-600" />;
		return null;
	};

	return (
		<Card className="mb-6">
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Trophy className="size-5 text-primary" />
					Топ игроков
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="space-y-2">
					{leaderboard.map((entry, index) => (
						<div
							key={entry.userId}
							className={cn(
								'flex items-center justify-between rounded-lg border p-3',
								index < 3 && 'bg-muted/50'
							)}
						>
							<div className="flex items-center gap-3">
								<div className="flex items-center justify-center w-8">
									{getRankIcon(index) || (
										<span className="text-sm font-medium text-muted-foreground">
											{index + 1}
										</span>
									)}
								</div>
								<div>
									<p className="font-medium">{entry.username}</p>
									<p className="text-xs text-muted-foreground">
										{entry.totalGames} игр
									</p>
								</div>
							</div>
							<div className="text-right">
								<p className="font-semibold text-primary">
									{Number(entry.accuracy).toFixed(1)}%
								</p>
								<p className="text-xs text-muted-foreground">
									{entry.correctAnswers}/{entry.totalQuestions}
								</p>
							</div>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}

