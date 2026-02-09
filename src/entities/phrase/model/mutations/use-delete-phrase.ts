import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deletePhraseRequest } from '../api/delete-phrase-request';

interface DeletePhraseParams {
	phraseId: number;
	categoryId?: number;
}

export const useDeletePhrase = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ phraseId }: DeletePhraseParams) =>
			deletePhraseRequest(phraseId),
		onSuccess: (_, variables) => {
			// Инвалидируем кеш фраз для конкретной категории
			if (variables.categoryId !== undefined) {
				queryClient.invalidateQueries({
					queryKey: ['phrases', String(variables.categoryId)],
				});
			} else {
				queryClient.invalidateQueries({
					queryKey: ['phrases'],
				});
			}
			queryClient.invalidateQueries({
				queryKey: ['categories'],
			});
		},
	});
};
