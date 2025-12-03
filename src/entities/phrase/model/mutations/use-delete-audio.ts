import { useMutation } from '@tanstack/react-query';
import { api } from '@/shared/api';
import { useInvalidatePhrasesCache } from '@/shared/hooks/use-invalidate-phrases-cache';

interface DeleteAudioResponse {
	success: boolean;
	message: string;
	categoryId?: number;
}

export const useDeleteAudio = () => {
	const { invalidate } = useInvalidatePhrasesCache();

	return useMutation({
		mutationFn: async (phraseId: number): Promise<DeleteAudioResponse> => {
			const response = await api.delete(
				`/phrases/delete-audio?phraseId=${phraseId}`
			);
			return response.data;
		},
		onSuccess: (data) => {
			// Инвалидируем кеш фраз для конкретной категории
			invalidate(data.categoryId);
		},
	});
};
