'use client';

import Link from 'next/link';
import { AuthBlock } from '@/features/auth';
import { ThemeToggle } from '@/shared/components/theme-toggle';
import { UserStats } from '@/features/user-stats/ui/user-stats';
import { useAuth } from '@/shared/hooks/use-auth';
import { VisitorsStats } from '@/features/visitors-stats/ui/visitors-stats';
import { ReviewRemindersToggle } from '@/features/flashcards/ui/review-reminders-toggle';
import { useGetLearningSummary } from '@/features/flashcards';
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from '@/shared/components/ui/card';
import { Target } from 'lucide-react';

function LearningGoalCard() {
	const { data: summary } = useGetLearningSummary(true);
	if (!summary) {
		return null;
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-base flex items-center gap-2">
					<Target className="size-5 text-primary" />
					Цель на сегодня
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-2">
				<p className="font-medium">
					{summary.goalProgress} / {summary.dailyGoal} повторений
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
				<p className="text-sm text-muted-foreground">
					Стрик: {summary.streak} дн. · к повторению: {summary.dueCount}
				</p>
				<Link href="/statistics" className="text-sm text-primary underline">
					Подробная статистика
				</Link>
			</CardContent>
		</Card>
	);
}

export default function SettingsPage() {
	const { user } = useAuth();

	return (
		<div className="mx-auto flex h-auto min-h-screen w-full max-w-md flex-col overflow-x-hidden bg-background-light dark:bg-background-dark font-display">
			<main className="px-4 py-4 pb-24 space-y-6">
				<h1 className="mb-4 text-3xl font-bold text-black dark:text-white">
					Settings
				</h1>
				{user && <UserStats />}
				{user && <LearningGoalCard />}
				{user && <ReviewRemindersToggle />}
				<ThemeToggle />
				<AuthBlock />
				<VisitorsStats />
				<p className="text-sm text-muted-foreground">
					<Link href="/about" className="underline">
						О проекте
					</Link>
				</p>
			</main>
		</div>
	);
}
