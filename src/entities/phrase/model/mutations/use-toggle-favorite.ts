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
		onSuccess: () => {
			// Обновляем кеш избранных фраз
			queryClient.refetchQueries({
				queryKey: ['favorite-phrases'],
			});
			// Инвалидируем все кеши фраз, чтобы обновился счетчик favoritesCount
			queryClient.invalidateQueries({
				queryKey: ['phrases'],
			});
		},
	});
};
