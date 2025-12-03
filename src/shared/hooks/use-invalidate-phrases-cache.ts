import { useQueryClient } from '@tanstack/react-query';
import { clearCachedPhrases } from '@/shared/lib/phrases-storage';

/**
 * Хук для инвалидации кеша фраз в React Query и localStorage
 * Используется после мутаций (создание, обновление, удаление фраз)
 */
export const useInvalidatePhrasesCache = () => {
	const queryClient = useQueryClient();

	const invalidate = (categoryId?: number, oldCategoryId?: number) => {
		// Очищаем кеш localStorage для конкретных категорий
		if (categoryId !== undefined) {
			clearCachedPhrases(categoryId);
		}
		if (oldCategoryId !== undefined && oldCategoryId !== categoryId) {
			clearCachedPhrases(oldCategoryId);
		}

		// Инвалидируем кеш React Query для фраз
		if (categoryId !== undefined) {
			queryClient.invalidateQueries({
				queryKey: ['phrases', String(categoryId)],
			});
		}
		if (oldCategoryId !== undefined && oldCategoryId !== categoryId) {
			queryClient.invalidateQueries({
				queryKey: ['phrases', String(oldCategoryId)],
			});
		}
		
		if (categoryId === undefined && oldCategoryId === undefined) {
			// Если categoryId неизвестен, инвалидируем все кеши фраз
			queryClient.invalidateQueries({
				queryKey: ['phrases'],
			});
		}

		// Также инвалидируем кеш категорий, так как updatedAt изменился
		queryClient.invalidateQueries({
			queryKey: ['categories'],
		});
	};

	return { invalidate };
};
