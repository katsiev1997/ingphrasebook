import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/shared/api";

interface CreatePhraseData {
	title: string;
	translate: string;
	transcription: string;
	categoryId: number;
}

interface CreatePhraseResponse {
	success: boolean;
	phrase: {
		id: number;
		title: string;
		translate: string;
		transcription: string;
		categoryId: number;
		createdAt: string;
		updatedAt: string;
	};
}

export const useCreatePhrase = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (
			data: CreatePhraseData
		): Promise<CreatePhraseResponse> => {
			const response = await api.post("/phrases", data);
			return response.data;
		},
		onSuccess: (data, variables) => {
			// Инвалидируем кеш фраз для данной категории
			queryClient.invalidateQueries({
				queryKey: ["phrases", String(variables.categoryId)],
			});
		},
	});
};
