import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/shared/api';
import { clearCachedPhrases } from '@/shared/lib/phrases-storage';

interface DeleteAudioResponse {
	success: boolean;
	message: string;
	categoryId?: number;
}

export const useDeleteAudio = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (phraseId: number): Promise<DeleteAudioResponse> => {
			const response = await api.delete(
				`/phrases/delete-audio?phraseId=${phraseId}`
			);
			return response.data;
		},
		onSuccess: (data) => {
			// Очищаем кеш localStorage для конкретной категории
			if (data.categoryId) {
				clearCachedPhrases(data.categoryId);
			}
			// Инвалидируем все запросы фраз для обновления данных
			// Это включает ['phrases', categoryId] и другие варианты
			queryClient.invalidateQueries({
				queryKey: ['phrases'],
			});
			// Также инвалидируем кеш категорий, так как updatedAt изменился
			queryClient.invalidateQueries({
				queryKey: ['categories'],
			});
		},
	});
};
