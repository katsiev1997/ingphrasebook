import { useMutation } from "@tanstack/react-query";
import { api } from "@/shared/api";
import { useInvalidatePhrasesCache } from '@/shared/hooks/use-invalidate-phrases-cache';

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
	const { invalidate } = useInvalidatePhrasesCache();

	return useMutation({
		mutationFn: async (
			data: CreatePhraseData
		): Promise<CreatePhraseResponse> => {
			const response = await api.post("/phrases", data);
			return response.data;
		},
		onSuccess: (data, variables) => {
			// Инвалидируем кеш фраз для данной категории
			invalidate(variables.categoryId);
		},
	});
};
