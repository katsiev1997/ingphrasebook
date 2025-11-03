import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCategoryRequest } from "../api/create-category-request";

interface CreateCategoryData {
	name: string;
}

export const useCreateCategory = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: CreateCategoryData) => createCategoryRequest(data),
		onSuccess: () => {
			// Инвалидируем кеш категорий для обновления списка
			queryClient.invalidateQueries({ queryKey: ["categories"] });
		},
	});
}; 