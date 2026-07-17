import { api } from '@/shared/api';
import type { Phrase, PhraseLearningProgress } from '@/db/schema';

export type DueCard = {
	phrase: Phrase;
	progress: PhraseLearningProgress | null;
};

export type LearningSummary = {
	dueCount: number;
	learningCount: number;
	masteredCount: number;
	hardCount: number;
	reviewsToday: number;
	reviewsLast7Days: number;
	dailyGoal: number;
	goalProgress: number;
	streak: number;
};

export type GetDueParams = {
	categoryId?: number;
	favoritesOnly?: boolean;
	hardOnly?: boolean;
	limit?: number;
};

export const getDueCardsRequest = async (params: GetDueParams = {}) => {
	const searchParams = new URLSearchParams();
	if (params.categoryId) {
		searchParams.set('categoryId', String(params.categoryId));
	}
	if (params.favoritesOnly) {
		searchParams.set('favoritesOnly', 'true');
	}
	if (params.hardOnly) {
		searchParams.set('hardOnly', 'true');
	}
	if (params.limit) {
		searchParams.set('limit', String(params.limit));
	}
	const query = searchParams.toString();
	const { data } = await api.get<DueCard[]>(
		`/learning/due${query ? `?${query}` : ''}`
	);
	return data;
};

export const getLearningSummaryRequest = async () => {
	const { data } = await api.get<LearningSummary>('/learning/summary');
	return data;
};

export const submitReviewRequest = async (params: {
	phraseId: number;
	known: boolean;
}) => {
	const { data } = await api.post<PhraseLearningProgress>(
		'/learning/review',
		params
	);
	return data;
};

export const enqueueFailedPhrasesRequest = async (phraseIds: number[]) => {
	const { data } = await api.post<{ enqueued: number }>('/learning/review', {
		enqueueFails: true,
		phraseIds,
	});
	return data;
};
