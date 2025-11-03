import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/shared/api";

interface DeleteAudioResponse {
	success: boolean;
	message: string;
}

export const useDeleteAudio = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (phraseId: string): Promise<DeleteAudioResponse> => {
			const response = await api.delete(
				`/phrases/delete-audio?phraseId=${phraseId}`
			);
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
