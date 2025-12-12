'use client';

import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from '@/shared/components/ui/card';
import { Progress } from '@/shared/components/ui/progress';
import { cn } from '@/shared/lib/utils';
import { CheckCircle2, XCircle } from 'lucide-react';
import { useQuizGame } from '../model/hooks/use-quiz-game';
import { QuizFinish } from './quiz-finish';
import { QuizLoader } from './quiz-loader';
import { QuizStart } from './quiz-start';

export function QuizGame() {
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
		return <QuizLoader />;
	}

	if (isGameFinished) {
		const accuracy =
			session.totalQuestions > 0
				? Math.round((session.correctAnswers / session.totalQuestions) * 100)
				: 0;

		return (
			<QuizFinish
				accuracy={accuracy}
				startNewGame={startNewGame}
				session={session}
			/>
		);
	}

	if (!currentQuestion && !isGameStarted) {
		return <QuizStart isLoading={isLoading} startGame={startGame} />;
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

	if (!currentQuestion) {
		return null;
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
									'w-full justify-start text-left h-auto py-2 px-3 active:bg-primary dark:active:bg-primary',
									!session.isAnswered && 'hover:bg-accent',
									session.isAnswered && !isSelected && !isCorrect && 'opacity-50'
								)}
								onClick={() => selectAnswer(phrase.id)}
								disabled={session.isAnswered}
							>
								<div className="flex w-full items-center justify-between">
									<div className="text-wrap text-left">
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
