import { useMutation, useQueryClient } from '@tanstack/react-query';
import { saveGameStatsRequest, SaveGameStatsParams } from '../api/save-game-stats-request';

export const useSaveGameStats = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: ['save-game-stats'],
		mutationFn: (params: SaveGameStatsParams) => saveGameStatsRequest(params),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['game-stats'] });
		},
	});
};

