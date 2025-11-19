import { api } from '@/shared/api';
import { GameStats } from '../types';

export const getGameStatsRequest = async (): Promise<GameStats> => {
	const { data } = await api.get<GameStats>('/game/stats');
	return data;
};

