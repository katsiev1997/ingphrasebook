import { useState, useCallback, useMemo, useEffect } from 'react';
import { Phrase } from '@/db/schema';
import { QuizQuestion, GameSession } from '../types';
import { useGetGamePhrases } from '../queries/use-get-game-phrases';
import { useSaveGameStats } from '../mutations/use-save-game-stats';
import { useAuth } from '@/shared/hooks/use-auth';

const QUESTIONS_PER_GAME = 10;

function shuffleArray<T>(array: T[]): T[] {
	const shuffled = [...array];
	for (let i = shuffled.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
	}
	return shuffled;
}

function createQuestion(phrases: Phrase[]): QuizQuestion | null {
	if (phrases.length < 4) {
		return null;
	}

	const shuffled = shuffleArray(phrases);
	const correctPhrase = shuffled[0];
	const wrongPhrases = shuffled.slice(1, 4);
	const allOptions = shuffleArray([correctPhrase, ...wrongPhrases]);

	return {
		correctPhrase,
		wrongPhrases,
		allOptions,
	};
}

export const useQuizGame = () => {
	const { isAuthenticated } = useAuth();
	const { data: phrases, refetch: refetchPhrases, isLoading } = useGetGamePhrases();
	const { mutate: saveStats } = useSaveGameStats();

	const [session, setSession] = useState<GameSession>({
		currentQuestion: null,
		questionIndex: 0,
		totalQuestions: QUESTIONS_PER_GAME,
		correctAnswers: 0,
		selectedAnswerId: null,
		isAnswered: false,
		isCorrect: null,
	});

	const currentQuestion = useMemo(() => {
		if (!phrases || phrases.length < 4) {
			return null;
		}
		return createQuestion(phrases);
	}, [phrases]);

	const startNewGame = useCallback(() => {
		setSession({
			currentQuestion: null,
			questionIndex: 0,
			totalQuestions: QUESTIONS_PER_GAME,
			correctAnswers: 0,
			selectedAnswerId: null,
			isAnswered: false,
			isCorrect: null,
		});
		refetchPhrases();
	}, [refetchPhrases]);

	const loadNextQuestion = useCallback(() => {
		if (!phrases || phrases.length < 4) {
			return;
		}

		const question = createQuestion(phrases);
		setSession((prev) => ({
			...prev,
			currentQuestion: question,
			questionIndex: prev.questionIndex + 1,
			selectedAnswerId: null,
			isAnswered: false,
			isCorrect: null,
		}));
	}, [phrases]);

	const selectAnswer = useCallback(
		(phraseId: number) => {
			if (session.isAnswered || !session.currentQuestion) {
				return;
			}

			const isCorrect = phraseId === session.currentQuestion.correctPhrase.id;

			setSession((prev) => ({
				...prev,
				selectedAnswerId: phraseId,
				isAnswered: true,
				isCorrect,
				correctAnswers: isCorrect ? prev.correctAnswers + 1 : prev.correctAnswers,
			}));
		},
		[session.isAnswered, session.currentQuestion]
	);

	const nextQuestion = useCallback(() => {
		// Если это был последний вопрос, завершаем игру
		if (session.questionIndex >= session.totalQuestions) {
			setSession((prev) => ({
				...prev,
				questionIndex: prev.totalQuestions + 1, // Устанавливаем индекс больше totalQuestions для isGameFinished
			}));
			return;
		}

		loadNextQuestion();
	}, [session, loadNextQuestion]);

	const isGameFinished = useMemo(() => {
		return session.questionIndex > session.totalQuestions;
	}, [session.questionIndex, session.totalQuestions]);

	useEffect(() => {
		if (phrases && phrases.length >= 4 && session.questionIndex === 0 && !session.currentQuestion) {
			loadNextQuestion();
		}
	}, [phrases, session.questionIndex, session.currentQuestion, loadNextQuestion]);

	// Сохраняем статистику при завершении игры
	useEffect(() => {
		if (isGameFinished && isAuthenticated && session.questionIndex > 0) {
			saveStats({
				correctAnswers: session.correctAnswers,
				totalQuestions: session.totalQuestions,
			});
		}
	}, [isGameFinished, isAuthenticated, session, saveStats]);

	return {
		session,
		currentQuestion: session.currentQuestion || currentQuestion,
		isLoading,
		isGameFinished,
		selectAnswer,
		nextQuestion,
		startNewGame,
	};
};

