import { api } from '@/shared/api';

export interface LeaderboardEntry {
	userId: number;
	username: string;
	totalQuestions: number;
	correctAnswers: number;
	totalGames: number;
	accuracy: number;
}

export const getLeaderboardRequest = async (
	limit?: number
): Promise<LeaderboardEntry[]> => {
	const params = limit ? `?limit=${limit}` : '';
	const { data } = await api.get<LeaderboardEntry[]>(`/game/leaderboard${params}`);
	return data;
};

