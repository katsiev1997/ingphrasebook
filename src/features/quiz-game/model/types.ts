import { Phrase } from '@/db/schema';

export interface QuizQuestion {
	correctPhrase: Phrase;
	wrongPhrases: Phrase[];
	allOptions: Phrase[];
}

export interface GameStats {
	id: number;
	userId: number;
	totalQuestions: number;
	correctAnswers: number;
	totalGames: number;
	createdAt: Date;
	updatedAt: Date;
}

export interface GameSession {
	currentQuestion: QuizQuestion | null;
	questionIndex: number;
	totalQuestions: number;
	correctAnswers: number;
	selectedAnswerId: number | null;
	isAnswered: boolean;
	isCorrect: boolean | null;
	usedPhraseIds: Set<number>;
}

