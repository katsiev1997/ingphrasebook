import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/shared/api';

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
