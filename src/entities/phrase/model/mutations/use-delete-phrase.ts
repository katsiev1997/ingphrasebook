import { useMutation } from '@tanstack/react-query';
import { deletePhraseRequest } from '../api/delete-phrase-request';
import { useInvalidatePhrasesCache } from '@/shared/hooks/use-invalidate-phrases-cache';

interface DeletePhraseParams {
	phraseId: number;
	categoryId?: number;
}

export const useDeletePhrase = () => {
	const { invalidate } = useInvalidatePhrasesCache();

	return useMutation({
		mutationFn: ({ phraseId }: DeletePhraseParams) =>
			deletePhraseRequest(phraseId),
		onSuccess: (_, variables) => {
			// Инвалидируем кеш фраз для конкретной категории
			invalidate(variables.categoryId);
		},
	});
};
