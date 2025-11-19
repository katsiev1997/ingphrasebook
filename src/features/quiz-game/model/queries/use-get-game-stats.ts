import { useQuery } from '@tanstack/react-query';
import { getGameStatsRequest } from '../api/get-game-stats-request';
import { useAuth } from '@/shared/hooks/use-auth';

export const useGetGameStats = () => {
	const { isAuthenticated } = useAuth();

	return useQuery({
		queryKey: ['game-stats'],
		queryFn: getGameStatsRequest,
		enabled: isAuthenticated,
	});
};

