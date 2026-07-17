import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from '@/shared/components/ui/card';
import { useAuth } from '@/shared/hooks/use-auth';
import { Layers, Loader2Icon, RotateCcw, Trophy } from 'lucide-react';
import { useGetGameStats } from '../model/queries/use-get-game-stats';
import { GameSession } from '../model/types';
import { Button } from '@/shared/components/ui/button';
import { useEnqueueFailedPhrases } from '@/features/flashcards';
import { useEffect, useRef } from 'react';
import Link from 'next/link';

interface QuizFinishProps {
	accuracy: number;
	startNewGame: () => void;
	session: GameSession;
}

export const QuizFinish = ({
	accuracy,
	startNewGame,
	session,
}: QuizFinishProps) => {
	const { isAuthenticated } = useAuth();
	const { data: stats, isLoading, isError } = useGetGameStats();
	const { mutate: enqueueFails } = useEnqueueFailedPhrases();
	const enqueuedRef = useRef(false);

	useEffect(() => {
		if (
			isAuthenticated &&
			session.failedPhraseIds.length > 0 &&
			!enqueuedRef.current
		) {
			enqueuedRef.current = true;
			enqueueFails(session.failedPhraseIds);
		}
	}, [isAuthenticated, session.failedPhraseIds, enqueueFails]);

	return (
		<div className="mx-auto flex h-auto min-h-screen w-full max-w-md flex-col overflow-x-hidden bg-background-light dark:bg-background-dark">
			<main className="flex-1 px-4 py-4 pb-24">
				<Card className="mt-8">
					<CardHeader className="text-center">
						<Trophy className="mx-auto mb-4 size-16 text-primary" />
						<CardTitle className="text-2xl">Игра завершена!</CardTitle>
					</CardHeader>
					<CardContent className="space-y-6">
						<div className="space-y-4 text-center">
							<div>
								<p className="text-4xl font-bold text-primary">
									{session.correctAnswers} / {session.totalQuestions}
								</p>
								<p className="text-muted-foreground">Правильных ответов</p>
							</div>
							<div>
								<p className="text-3xl font-bold">{accuracy}%</p>
								<p className="text-muted-foreground">Точность</p>
							</div>
						</div>

						{isLoading && (
							<div className="rounded-lg border bg-muted/50 p-4">
								<p className="mb-2 text-sm font-medium">Общая статистика</p>
								<div className="space-y-2 text-sm">
									<div className="flex justify-between">
										<span className="text-muted-foreground">Всего игр:</span>
										<Loader2Icon className="size-4 animate-spin" />
									</div>
									<div className="flex justify-between">
										<span className="text-muted-foreground">Всего вопросов:</span>
										<Loader2Icon className="size-4 animate-spin" />
									</div>
									<div className="flex justify-between">
										<span className="text-muted-foreground">Правильных ответов:</span>
										<Loader2Icon className="size-4 animate-spin" />
									</div>
								</div>
							</div>
						)}
						{isError && (
							<div className="flex h-[40vh] items-center justify-center">
								<p className="text-muted-foreground">
									Ошибка при загрузке статистики
								</p>
							</div>
						)}

						{isAuthenticated && stats && (
							<div className="rounded-lg border bg-muted/50 p-4">
								<p className="mb-2 text-sm font-medium">Общая статистика</p>
								<div className="space-y-2 text-sm">
									<div className="flex justify-between">
										<span className="text-muted-foreground">Всего игр:</span>
										<span className="font-medium">{stats.totalGames}</span>
									</div>
									<div className="flex justify-between">
										<span className="text-muted-foreground">Всего вопросов:</span>
										<span className="font-medium">{stats.totalQuestions}</span>
									</div>
									<div className="flex justify-between">
										<span className="text-muted-foreground">Правильных ответов:</span>
										<span className="font-medium">{stats.correctAnswers}</span>
									</div>
									{stats.totalQuestions > 0 && (
										<div className="flex justify-between">
											<span className="text-muted-foreground">Общая точность:</span>
											<span className="font-medium">
												{Math.round(
													(stats.correctAnswers / stats.totalQuestions) * 100
												)}
												%
											</span>
										</div>
									)}
								</div>
							</div>
						)}

						{isAuthenticated && session.failedPhraseIds.length > 0 && (
							<p className="text-sm text-center text-muted-foreground">
								Ошибки добавлены в очередь повторения (
								{session.failedPhraseIds.length})
							</p>
						)}

						<div className="grid gap-2">
							<Button
								onClick={startNewGame}
								className="w-full active:bg-accent dark:active:bg-accent"
								size="lg"
							>
								<RotateCcw className="mr-2 size-4" />
								Играть снова
							</Button>
							{isAuthenticated && session.failedPhraseIds.length > 0 && (
								<Button asChild variant="outline" size="lg" className="w-full">
									<Link href="/flashcards">
										<Layers className="mr-2 size-4" />
										Повторить ошибки
									</Link>
								</Button>
							)}
						</div>
					</CardContent>
				</Card>
			</main>
		</div>
	);
};
