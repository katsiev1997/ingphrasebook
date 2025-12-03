import { useQueryClient } from '@tanstack/react-query';
import { clearCachedPhrases } from '@/shared/lib/phrases-storage';

/**
 * Хук для инвалидации кеша фраз в React Query и localStorage
 * Используется после мутаций (создание, обновление, удаление фраз)
 */
export const useInvalidatePhrasesCache = () => {
	const queryClient = useQueryClient();

	const invalidate = (categoryId?: number) => {
		// Очищаем кеш localStorage для конкретной категории
		if (categoryId !== undefined) {
			clearCachedPhrases(categoryId);
		}

		// Инвалидируем кеш React Query для фраз
		if (categoryId !== undefined) {
			queryClient.invalidateQueries({
				queryKey: ['phrases', String(categoryId)],
			});
		} else {
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
