import { useMutation } from '@tanstack/react-query';
import { api } from '@/shared/api';
import { useInvalidatePhrasesCache } from '@/shared/hooks/use-invalidate-phrases-cache';

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
	const { invalidate } = useInvalidatePhrasesCache();

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
			invalidate(data.categoryId);
		},
	});
};
