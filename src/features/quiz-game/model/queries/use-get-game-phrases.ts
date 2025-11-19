import { useQuery } from '@tanstack/react-query';
import { getGamePhrasesRequest } from '../api/get-game-phrases-request';

export const useGetGamePhrases = () => {
	return useQuery({
		queryKey: ['game-phrases'],
		queryFn: getGamePhrasesRequest,
	});
};

