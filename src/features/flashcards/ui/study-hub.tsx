'use client';

import Link from 'next/link';
import {
	BookOpenCheck,
	ClipboardList,
	Flame,
	Layers,
	MessageCircle,
	Mic,
	Target,
	Volume2,
} from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { useAuth } from '@/shared/hooks/use-auth';
import { useGetSurveyStatus } from '@/features/survey';
import { useGetLearningSummary } from '../model/queries/use-learning-queries';

export function StudyHub() {
	const { isAuthenticated, loading } = useAuth();
	const { data: summary } = useGetLearningSummary(isAuthenticated);
	const { data: surveyStatus } = useGetSurveyStatus(isAuthenticated);
	const showSurveyCta = isAuthenticated && surveyStatus?.submitted !== true;

	if (loading) {
		return <p className="text-muted-foreground">Загрузка...</p>;
	}

	return (
		<div className="space-y-6">
			{isAuthenticated && summary && (
				<div className="rounded-2xl border border-border bg-card p-4 space-y-3">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<Flame className="size-5 text-primary" />
							<span className="font-medium">Стрик: {summary.streak} дн.</span>
						</div>
						<div className="flex items-center gap-2 text-sm text-muted-foreground">
							<Target className="size-4" />
							{summary.goalProgress}/{summary.dailyGoal} сегодня
						</div>
					</div>
					<div className="h-2 rounded-full bg-muted overflow-hidden">
						<div
							className="h-full bg-primary transition-all"
							style={{
								width: `${Math.min(
									100,
									(summary.goalProgress / summary.dailyGoal) * 100
								)}%`,
							}}
						/>
					</div>
					<p className="text-sm text-muted-foreground">
						К повторению: {summary.dueCount}
						{summary.hardCount > 0
							? ` · сложных: ${summary.hardCount}`
							: ''}
					</p>
				</div>
			)}

			{!isAuthenticated && (
				<p className="text-sm text-muted-foreground">
					Войдите, чтобы сохранять прогресс. Можно попробовать демо-карточки.
				</p>
			)}

			<div className="grid gap-3">
				<Button asChild size="lg" className="h-14 justify-start">
					<Link href="/flashcards">
						<Layers className="mr-3 size-5" />
						Карточки
						{summary && summary.dueCount > 0
							? ` (${summary.dueCount})`
							: ''}
					</Link>
				</Button>
				{summary && summary.hardCount > 0 && (
					<Button
						asChild
						variant="outline"
						size="lg"
						className="h-12 justify-start"
					>
						<Link href="/flashcards?hard=1">
							Сложные фразы ({summary.hardCount})
						</Link>
					</Button>
				)}
				<Button asChild variant="outline" size="lg" className="h-12 justify-start">
					<Link href="/dictation">
						<Mic className="mr-3 size-5" />
						Диктовка
					</Link>
				</Button>
				<Button asChild variant="outline" size="lg" className="h-12 justify-start">
					<Link href="/dialogues">
						<MessageCircle className="mr-3 size-5" />
						Диалоги
					</Link>
				</Button>
				<Button asChild variant="outline" size="lg" className="h-12 justify-start">
					<Link href="/pronunciation">
						<Volume2 className="mr-3 size-5" />
						Произношение
					</Link>
				</Button>
				<Button asChild variant="outline" size="lg" className="h-12 justify-start">
					<Link href="/statistics">
						<BookOpenCheck className="mr-3 size-5" />
						Статистика обучения
					</Link>
				</Button>
				{showSurveyCta && (
					<Button asChild variant="outline" size="lg" className="h-12 justify-start">
						<Link href="/survey">
							<ClipboardList className="mr-3 size-5" />
							Опрос для пользователей
						</Link>
					</Button>
				)}
			</div>
		</div>
	);
}
