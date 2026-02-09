import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updatePhraseRequest } from '../api/update-phrase-request';

interface UpdatePhraseData {
	id: number;
	title: string;
	translate: string;
	transcription: string;
	categoryId: number;
	audioUrl?: string;
}

export const useUpdatePhrase = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: UpdatePhraseData) => {
			return updatePhraseRequest(data);
		},
		onSuccess: () => {
			// Инвалидируем все фразы и категории
			queryClient.invalidateQueries({
				queryKey: ['phrases'],
			});
			queryClient.invalidateQueries({
				queryKey: ['categories'],
			});
		},
	});
};
