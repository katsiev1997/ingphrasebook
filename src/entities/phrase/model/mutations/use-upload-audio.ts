import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/shared/api';
import { useParams } from 'next/navigation';

interface UploadAudioData {
	phraseId: number;
	audioFile: File;
}

interface UploadAudioResponse {
	success: boolean;
	audioUrl: string;
}

export const useUploadAudio = () => {
	const queryClient = useQueryClient();
	const params = useParams();

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
		onSuccess: () => {
			// Инвалидируем кеш фраз для обновления данных
			queryClient.invalidateQueries({
				queryKey: ['phrases', params?.categoryId],
			});
		},
	});
};
