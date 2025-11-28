import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/shared/api';
import { clearCachedPhrases } from '@/shared/lib/phrases-storage';

interface UploadAudioData {
	phraseId: number;
	audioFile: File;
}

interface UploadAudioResponse {
	success: boolean;
	audioUrl: string;
	categoryId?: number;
}

export const useUploadAudio = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: UploadAudioData): Promise<UploadAudioResponse> => {
			const formData = new FormData();
			formData.append('phraseId', String(data.phraseId));
			formData.append('audio', data.audioFile);

			const response = await api.post('/phrases/upload-audio', formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			});
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
