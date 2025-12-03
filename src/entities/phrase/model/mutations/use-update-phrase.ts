import { useMutation } from '@tanstack/react-query';
import { updatePhraseRequest } from '../api/update-phrase-request';
import { useInvalidatePhrasesCache } from '@/shared/hooks/use-invalidate-phrases-cache';

interface UpdatePhraseData {
	id: number;
	title: string;
	translate: string;
	transcription: string;
	categoryId: number;
	audioUrl?: string;
	oldCategoryId?: number;
}

export const useUpdatePhrase = () => {
	const { invalidate } = useInvalidatePhrasesCache();

	return useMutation({
		mutationFn: (data: UpdatePhraseData) => {
			const { oldCategoryId, ...requestData } = data;
			return updatePhraseRequest(requestData);
		},
		onSuccess: (data, variables) => {
			// Инвалидируем кеш фраз для новой и старой категории (если категория изменилась)
			invalidate(variables.categoryId, variables.oldCategoryId);
		},
	});
};
