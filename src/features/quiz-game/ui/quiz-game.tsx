'use client';

import { useQuizGame } from '../model/hooks/use-quiz-game';
import { useGetGameStats } from '../model/queries/use-get-game-stats';
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Progress } from '@/shared/components/ui/progress';
import { Badge } from '@/shared/components/ui/badge';
import { CheckCircle2, XCircle, Trophy, RotateCcw } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { useAuth } from '@/shared/hooks/use-auth';
import { Leaderboard } from './leaderboard';

export function QuizGame() {
	const { isAuthenticated } = useAuth();
	const { data: stats } = useGetGameStats();
	const {
		session,
		currentQuestion,
		isLoading,
		isGameFinished,
		isGameStarted,
		selectAnswer,
		nextQuestion,
		startNewGame,
		startGame,
	} = useQuizGame();

	if (isLoading) {
		return (
			<div className="mx-auto flex h-auto min-h-screen w-full max-w-md flex-col overflow-x-hidden bg-background-light dark:bg-background-dark">
				<main className="flex-1 px-4 py-4 pb-24">
					<div className="flex h-[60vh] items-center justify-center">
						<p className="text-muted-foreground">Загрузка...</p>
					</div>
				</main>
			</div>
		);
	}

	if (isGameFinished) {
		const accuracy =
			session.totalQuestions > 0
				? Math.round((session.correctAnswers / session.totalQuestions) * 100)
				: 0;

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
													{Math.round((stats.correctAnswers / stats.totalQuestions) * 100)}%
												</span>
											</div>
										)}
									</div>
								</div>
							)}

							<div className="flex gap-3">
								<Button
									onClick={startNewGame}
									variant="outline"
									className="flex-1"
									size="lg"
								>
									<Trophy className="mr-2 size-4" />
									К топу игроков
								</Button>
								<Button onClick={startNewGame} className="flex-1" size="lg">
									<RotateCcw className="mr-2 size-4" />
									Играть снова
								</Button>
							</div>
						</CardContent>
					</Card>
				</main>
			</div>
		);
	}

	if (!currentQuestion && !isGameStarted) {
		return (
			<div className="mx-auto flex h-auto min-h-screen w-full max-w-md flex-col overflow-x-hidden bg-background-light dark:bg-background-dark">
				<main className="flex-1 px-4 py-4 pb-24">
					<div className="mb-6 mt-4">
						<h1 className="mb-4 text-2xl font-bold">Квиз</h1>
						<Leaderboard />
					</div>
					{isLoading ? (
						<div className="flex h-[40vh] items-center justify-center">
							<p className="text-muted-foreground">Загрузка...</p>
						</div>
					) : (
						<div className="flex flex-col items-center justify-center gap-4 py-8">
							<p className="text-center text-muted-foreground">
								Готовы начать? Проверьте свои знания ингушского языка!
							</p>
							<Button onClick={startGame} size="lg" className="w-full">
								Начать игру
							</Button>
						</div>
					)}
				</main>
			</div>
		);
	}

	if (!currentQuestion && isGameStarted) {
		return (
			<div className="mx-auto flex h-auto min-h-screen w-full max-w-md flex-col overflow-x-hidden bg-background-light dark:bg-background-dark">
				<main className="flex-1 px-4 py-4 pb-24">
					<div className="flex h-[60vh] items-center justify-center">
						<p className="text-muted-foreground">Недостаточно фраз для игры</p>
					</div>
				</main>
			</div>
		);
	}

	const progress = (session.questionIndex / session.totalQuestions) * 100;

	return (
		<div className="mx-auto flex h-auto min-h-screen w-full max-w-md flex-col overflow-x-hidden bg-background-light dark:bg-background-dark">
			<main className="flex-1 px-4 py-4 pb-24">
				<div className="mb-6 mt-4">
					<div className="mb-2 flex items-center justify-between">
						{session.questionIndex > 0 && (
							<h1 className="text-2xl font-bold">Квиз</h1>
						)}
						<Badge variant="secondary">
							{session.questionIndex} / {session.totalQuestions}
						</Badge>
					</div>
					{session.questionIndex > 0 && (
						<Progress value={progress} className="h-2" />
					)}
				</div>

				<Card className="mb-3 gap-0 py-4">
					<CardHeader>
						<CardTitle className="text-lg">Выберите правильный перевод:</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-lg font-semibold text-primary">
							{currentQuestion.correctPhrase.title}
						</p>
					</CardContent>
				</Card>

				<div className="space-y-2">
					{currentQuestion.allOptions.map((phrase) => {
						const isSelected = session.selectedAnswerId === phrase.id;
						const isCorrect = phrase.id === currentQuestion.correctPhrase.id;
						const showResult = session.isAnswered;

						let variant: 'default' | 'secondary' | 'destructive' | 'outline' =
							'outline';
						if (showResult) {
							if (isCorrect) {
								variant = 'default';
							} else if (isSelected && !isCorrect) {
								variant = 'destructive';
							}
						} else if (isSelected) {
							variant = 'secondary';
						}

						return (
							<Button
								key={phrase.id}
								variant={variant}
								size="lg"
								className={cn(
									'w-full justify-start text-left h-auto py-2 px-3',
									!session.isAnswered && 'hover:bg-accent',
									session.isAnswered && !isSelected && !isCorrect && 'opacity-50'
								)}
								onClick={() => selectAnswer(phrase.id)}
								disabled={session.isAnswered}
							>
								<div className="flex w-full items-center justify-between">
									<div className="flex-1 text-left">
										<p className="text-base font-semibold">{phrase.translate}</p>
										<p className="text-xs text-muted-foreground mt-0.5">
											[{phrase.transcription}]
										</p>
									</div>
									{showResult && isSelected && (
										<div className="ml-3 shrink-0">
											{isCorrect ? (
												<CheckCircle2 className="size-4 text-primary-foreground" />
											) : (
												<XCircle className="size-4 text-destructive-foreground" />
											)}
										</div>
									)}
								</div>
							</Button>
						);
					})}
				</div>

				{session.isAnswered && (
					<Button onClick={nextQuestion} className="mt-3 w-full" size="lg">
						{session.questionIndex >= session.totalQuestions
							? 'Завершить игру'
							: 'Следующий вопрос'}
					</Button>
				)}
			</main>
		</div>
	);
}
