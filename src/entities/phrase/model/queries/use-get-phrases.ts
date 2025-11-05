'use client';

import { useQuery } from '@tanstack/react-query';
import { useMemo, useEffect } from 'react';

import { getPhrasesRequest } from '../api/get-phrases-request';
import {
	getCachedPhrases,
	savePhrases,
	shouldFetchPhrases,
} from '@/shared/lib/phrases-storage';
import { useGetCategories } from '@/entities/category/model/queries/use-get-categories';
import type { Phrase } from '@/db/schema';

export const useGetPhrases = (categoryId: string) => {
	const categoryIdNum = Number(categoryId) || 1;
	const { data: categories } = useGetCategories();

	const category = useMemo(() => {
		return categories?.find((cat) => cat.id === categoryIdNum);
	}, [categories, categoryIdNum]);

	const cachedData = useMemo(() => {
		return getCachedPhrases(categoryIdNum);
	}, [categoryIdNum]);

	const enabled = () => {
		if (!category?.updatedAt) {
			// Если категория ещё не загружена, не делаем запрос
			// но показываем кеш через initialData
			return false;
		}
		// Загружаем только если нужно обновить данные
		return shouldFetchPhrases(categoryIdNum, category.updatedAt);
	};

	const queryResult = useQuery<Phrase[]>({
		queryKey: ['phrases', categoryId],
		queryFn: () => getPhrasesRequest(categoryIdNum),
		initialData: cachedData?.phrases,
		enabled,
	});

	// Сохраняем данные в localStorage после успешной загрузки
	useEffect(() => {
		if (queryResult.data && category?.updatedAt) {
			savePhrases(categoryIdNum, queryResult.data, category.updatedAt);
		}
	}, [queryResult.data, category?.updatedAt, categoryIdNum]);

	return queryResult;
};
