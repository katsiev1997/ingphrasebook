'use client';

import Link from 'next/link';
import { BackButton } from '@/shared/components/back-button';
import { Button } from '@/shared/components/ui/button';
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from '@/shared/components/ui/card';
import { useAuth } from '@/shared/hooks/use-auth';
import { useGetLearningSummary } from '@/features/flashcards';
import { Flame, Layers, Target } from 'lucide-react';

export default function StatisticsPage() {
	const { isAuthenticated, loading } = useAuth();
	const { data: summary, isPending } = useGetLearningSummary(isAuthenticated);

	return (
		<div className="mx-auto flex h-auto min-h-screen w-full max-w-md flex-col overflow-x-hidden bg-background-light dark:bg-background-dark font-display">
			<main className="flex-1 px-4 py-4 pb-24 space-y-4">
				<div className="flex items-center justify-between">
					<h1 className="text-2xl font-bold text-black dark:text-white">
						Статистика
					</h1>
					<BackButton />
				</div>

				{(loading || (isAuthenticated && isPending)) && (
					<p className="text-muted-foreground">Загрузка...</p>
				)}

				{!isAuthenticated && !loading && (
					<div className="space-y-3">
						<p className="text-muted-foreground">
							Войдите, чтобы видеть прогресс обучения.
						</p>
						<Button asChild>
							<Link href="/settings">Войти</Link>
						</Button>
					</div>
				)}

				{isAuthenticated && summary && (
					<>
						<Card>
							<CardHeader>
								<CardTitle className="text-base flex items-center gap-2">
									<Flame className="size-5 text-primary" />
									Стрик
								</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-3xl font-bold">{summary.streak} дн.</p>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle className="text-base flex items-center gap-2">
									<Target className="size-5 text-primary" />
									Цель на сегодня
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-2">
								<p className="text-3xl font-bold">
									{summary.goalProgress} / {summary.dailyGoal}
								</p>
								<div className="h-2 rounded-full bg-muted overflow-hidden">
									<div
										className="h-full bg-primary"
										style={{
											width: `${Math.min(
												100,
												(summary.goalProgress / summary.dailyGoal) * 100
											)}%`,
										}}
									/>
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle className="text-base flex items-center gap-2">
									<Layers className="size-5 text-primary" />
									Прогресс
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-2 text-sm">
								<div className="flex justify-between">
									<span className="text-muted-foreground">К повторению</span>
									<span className="font-medium">{summary.dueCount}</span>
								</div>
								<div className="flex justify-between">
									<span className="text-muted-foreground">Изучается</span>
									<span className="font-medium">{summary.learningCount}</span>
								</div>
								<div className="flex justify-between">
									<span className="text-muted-foreground">Освоено</span>
									<span className="font-medium">{summary.masteredCount}</span>
								</div>
								<div className="flex justify-between">
									<span className="text-muted-foreground">Сложных due</span>
									<span className="font-medium">{summary.hardCount}</span>
								</div>
								<div className="flex justify-between">
									<span className="text-muted-foreground">Повторений за 7 дней</span>
									<span className="font-medium">{summary.reviewsLast7Days}</span>
								</div>
							</CardContent>
						</Card>

						{summary.hardCount > 0 && (
							<Button asChild variant="outline" className="w-full">
								<Link href="/flashcards?hard=1">
									Повторить сложные ({summary.hardCount})
								</Link>
							</Button>
						)}
					</>
				)}
			</main>
		</div>
	);
}
