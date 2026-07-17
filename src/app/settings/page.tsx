'use client';

import Link from 'next/link';
import { AuthBlock } from '@/features/auth';
import { ThemeToggle } from '@/shared/components/theme-toggle';
import { useAuth } from '@/shared/hooks/use-auth';
import { VisitorsStats } from '@/features/visitors-stats/ui/visitors-stats';
import { ReviewRemindersToggle } from '@/features/flashcards/ui/review-reminders-toggle';
import { useGetLearningSummary } from '@/features/flashcards';
import {
	BookOpenCheck,
	ChevronRight,
	FileText,
	Info,
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import type { ReactNode } from 'react';

function Section({
	title,
	children,
	className,
}: {
	title?: string;
	children: ReactNode;
	className?: string;
}) {
	return (
		<section className={cn('space-y-3', className)}>
			{title && (
				<h2 className="px-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
					{title}
				</h2>
			)}
			{children}
		</section>
	);
}

function ProfileNavLink({
	href,
	icon,
	title,
	description,
}: {
	href: string;
	icon: ReactNode;
	title: string;
	description?: string;
}) {
	return (
		<Link
			href={href}
			className="flex items-center justify-between gap-3 rounded-xl bg-component-light px-4 py-3 shadow-sm transition-opacity hover:opacity-90 dark:bg-component-dark"
		>
			<div className="flex min-w-0 items-center gap-3">
				<div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/20 text-primary">
					{icon}
				</div>
				<div className="min-w-0">
					<p className="text-base font-normal text-black dark:text-white">
						{title}
					</p>
					{description && (
						<p className="truncate text-xs text-muted-foreground">{description}</p>
					)}
				</div>
			</div>
			<ChevronRight className="size-5 shrink-0 text-muted-foreground" />
		</Link>
	);
}

function LearningStatsLink() {
	const { data: summary } = useGetLearningSummary(true);

	return (
		<ProfileNavLink
			href="/statistics"
			icon={<BookOpenCheck className="size-5" />}
			title="Статистика обучения"
			description={
				summary
					? `Стрик ${summary.streak} дн. · сегодня ${summary.goalProgress}/${summary.dailyGoal} · к повторению ${summary.dueCount}`
					: undefined
			}
		/>
	);
}

export default function SettingsPage() {
	const { user, isModeratorOrAdmin } = useAuth();

	return (
		<div className="mx-auto flex h-auto min-h-screen w-full max-w-md flex-col overflow-x-hidden bg-background-light font-display dark:bg-background-dark">
			<main className="space-y-8 px-4 py-4 pb-24">
				<header>
					<h1 className="text-3xl font-bold text-black dark:text-white">
						Профиль
					</h1>
					<p className="mt-1 text-sm text-muted-foreground">
						Аккаунт, настройки и информация о приложении
					</p>
				</header>

				<Section title="Аккаунт">
					<div className="rounded-xl bg-component-light p-4 shadow-sm dark:bg-component-dark">
						<AuthBlock />
					</div>
					{user && <LearningStatsLink />}
				</Section>

				<Section title="Настройки">
					<ThemeToggle />
					{user && <ReviewRemindersToggle />}
				</Section>

				<Section title="О приложении">
					<ProfileNavLink
						href="/about"
						icon={<Info className="size-5" />}
						title="О проекте"
						description="Как пользоваться IngPhrase"
					/>
					<ProfileNavLink
						href="/changelog"
						icon={<FileText className="size-5" />}
						title="Обновления"
						description="История версий приложения"
					/>
				</Section>

				{isModeratorOrAdmin && (
					<Section title="Аналитика">
						<VisitorsStats />
					</Section>
				)}
			</main>
		</div>
	);
}
