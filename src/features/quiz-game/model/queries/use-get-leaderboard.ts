import { useQuery } from '@tanstack/react-query';
import { getLeaderboardRequest } from '../api/get-leaderboard-request';

export const useGetLeaderboard = (limit?: number) => {
	return useQuery({
		queryKey: ['leaderboard', limit],
		queryFn: () => getLeaderboardRequest(limit),
		staleTime: 60 * 1000, // 1 минута
	});
};

