import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/shared/api';

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
			// Инвалидируем кеш фраз для конкретной категории
			if (data.categoryId !== undefined) {
				queryClient.invalidateQueries({
					queryKey: ['phrases', String(data.categoryId)],
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
