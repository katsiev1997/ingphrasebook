import { useQuery } from '@tanstack/react-query';
import { getFavoritePhrasesRequest } from '../api/get-favorite-phrases-request';

export const useGetFavoritePhrases = (userId: number | undefined) => {
	return useQuery({
		queryKey: ['favorite-phrases'],
		queryFn: () => getFavoritePhrasesRequest(userId),
		enabled: !!userId,
	});
};
