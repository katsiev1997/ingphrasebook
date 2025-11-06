import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteFavoritePhraseRequest } from '../api/delete-favorite-phrase-request';
import { addFavoritePhraseRequest } from '../api/add-favorite-phrase-request';

export const useToggleFavorite = (isFavorite: boolean) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationKey: ['toggle-favorite'],
		mutationFn: ({ userId, phraseId }: { userId: number; phraseId: number }) =>
			isFavorite
				? deleteFavoritePhraseRequest(userId, phraseId)
				: addFavoritePhraseRequest(userId, phraseId),
		onSuccess: () =>
			queryClient.refetchQueries({
				queryKey: ['favorite-phrases'],
			}),
	});
};
