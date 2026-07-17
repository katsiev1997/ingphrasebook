'use client';

import Link from 'next/link';
import { BackButton } from '@/shared/components/back-button';
import { Button } from '@/shared/components/ui/button';
import { useAuth } from '@/shared/hooks/use-auth';
import { SurveyForm, useGetSurveyStatus } from '@/features/survey';

export default function SurveyPage() {
	const { isAuthenticated, loading } = useAuth();
	const { data: status, isPending } = useGetSurveyStatus(isAuthenticated);
	const submitted = status?.submitted === true;

	return (
		<div className="mx-auto flex h-auto min-h-screen w-full max-w-md flex-col overflow-x-hidden bg-background-light dark:bg-background-dark font-display">
			<main className="flex-1 px-4 py-4 pb-24 space-y-4">
				<div className="flex items-center justify-between">
					<h1 className="text-2xl font-bold text-black dark:text-white">
						Опрос
					</h1>
					<BackButton fallbackHref="/study" />
				</div>

				<p className="text-sm text-muted-foreground">
					Помогите улучшить IngPhrase — 2–3 минуты, один раз.
				</p>

				{(loading || (isAuthenticated && isPending)) && (
					<p className="text-muted-foreground">Загрузка...</p>
				)}

				{!isAuthenticated && !loading && (
					<div className="space-y-3">
						<p className="text-muted-foreground">
							Войдите, чтобы пройти опрос — ответы сохраняются в вашем аккаунте.
						</p>
						<Button asChild>
							<Link href="/settings">Войти</Link>
						</Button>
					</div>
				)}

				{isAuthenticated && !isPending && submitted && (
					<div className="space-y-3 rounded-2xl border border-border bg-card p-4">
						<p className="font-medium">Спасибо за ответы!</p>
						<p className="text-sm text-muted-foreground">
							Вы уже прошли этот опрос. Мы учтём ваши ответы при развитии
							приложения.
						</p>
						<Button asChild variant="outline">
							<Link href="/study">К обучению</Link>
						</Button>
					</div>
				)}

				{isAuthenticated && !isPending && !submitted && <SurveyForm />}
			</main>
		</div>
	);
}
