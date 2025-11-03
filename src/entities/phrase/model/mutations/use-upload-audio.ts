import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/shared/api";

interface UploadAudioData {
	phraseId: string;
	audioFile: File;
}

interface UploadAudioResponse {
	success: boolean;
	audioUrl: string;
}

export const useUploadAudio = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: UploadAudioData): Promise<UploadAudioResponse> => {
			const formData = new FormData();
			formData.append("phraseId", data.phraseId);
			formData.append("audio", data.audioFile);

			const response = await api.post("/phrases/upload-audio", formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});
			return response.data;
		},
		onSuccess: () => {
			// Инвалидируем кеш фраз для обновления данных
			queryClient.invalidateQueries({
				queryKey: ["phrases"],
			});
		},
	});
};
