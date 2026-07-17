'use client';

import Link from 'next/link';
import { AuthBlock } from '@/features/auth';
import { ThemeToggle } from '@/shared/components/theme-toggle';
import { useAuth } from '@/shared/hooks/use-auth';
import { VisitorsStats } from '@/features/visitors-stats/ui/visitors-stats';
import { ReviewRemindersToggle } from '@/features/flashcards/ui/review-reminders-toggle';
import { useGetLearningSummary } from '@/features/flashcards';
import { BookOpenCheck, ChevronRight } from 'lucide-react';

function LearningStatsLink() {
	const { data: summary } = useGetLearningSummary(true);

	return (
		<Link
			href="/statistics"
			className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-card px-4 py-3 hover:bg-muted/40 transition"
		>
			<div className="flex items-center gap-3 min-w-0">
				<BookOpenCheck className="size-5 text-primary shrink-0" />
				<div className="min-w-0">
					<p className="font-medium text-sm">Статистика обучения</p>
					{summary && (
						<p className="text-xs text-muted-foreground truncate">
							Стрик {summary.streak} дн. · сегодня {summary.goalProgress}/
							{summary.dailyGoal} · к повторению {summary.dueCount}
						</p>
					)}
				</div>
			</div>
			<ChevronRight className="size-4 text-muted-foreground shrink-0" />
		</Link>
	);
}

export default function SettingsPage() {
	const { user } = useAuth();

	return (
		<div className="mx-auto flex h-auto min-h-screen w-full max-w-md flex-col overflow-x-hidden bg-background-light dark:bg-background-dark font-display">
			<main className="px-4 py-4 pb-24 space-y-6">
				<h1 className="mb-4 text-3xl font-bold text-black dark:text-white">
					Профиль
				</h1>
				{user && <LearningStatsLink />}
				{user && <ReviewRemindersToggle />}
				<ThemeToggle />
				<AuthBlock />
				<VisitorsStats />
				<p className="text-sm text-muted-foreground space-x-1">
					<Link href="/about" className="underline">
						О проекте
					</Link>
					<span>·</span>
					<Link href="/changelog" className="underline">
						Changelog
					</Link>
				</p>
			</main>
		</div>
	);
}
