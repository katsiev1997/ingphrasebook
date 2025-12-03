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
}

export const useUpdatePhrase = () => {
	const { invalidate } = useInvalidatePhrasesCache();

	return useMutation({
		mutationFn: (data: UpdatePhraseData) => updatePhraseRequest(data),
		onSuccess: (data, variables) => {
			// Инвалидируем кеш фраз для данной категории
			invalidate(variables.categoryId);
		},
	});
};
