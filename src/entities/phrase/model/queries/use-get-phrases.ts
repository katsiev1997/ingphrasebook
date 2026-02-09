'use client';

import { useQuery } from '@tanstack/react-query';

import { getPhrasesRequest } from '../api/get-phrases-request';
import type { Phrase } from '@/db/schema';

export const useGetPhrases = (categoryId: string) => {
	const categoryIdNum = Number(categoryId) || 1;

	const queryResult = useQuery<Phrase[]>({
		queryKey: ['phrases', categoryId],
		queryFn: () => getPhrasesRequest(categoryIdNum),
	});

	return queryResult;
};
