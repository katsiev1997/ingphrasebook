import { api } from '@/shared/api';
import { GameStats } from '../types';

export interface SaveGameStatsParams {
	correctAnswers: number;
	totalQuestions: number;
}

export const saveGameStatsRequest = async (
	params: SaveGameStatsParams
): Promise<GameStats> => {
	const { data } = await api.post<GameStats>('/game/stats', params);
	return data;
};

