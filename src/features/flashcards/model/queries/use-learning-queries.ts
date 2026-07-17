import { useQuery } from '@tanstack/react-query';
import {
	getDueCardsRequest,
	getLearningSummaryRequest,
	GetDueParams,
} from '../api/learning-requests';

export const useGetDueCards = (
	params: GetDueParams = {},
	enabled = true
) => {
	return useQuery({
		queryKey: ['learning-due', params],
		queryFn: () => getDueCardsRequest(params),
		enabled,
	});
};

export const useGetLearningSummary = (enabled = true) => {
	return useQuery({
		queryKey: ['learning-summary'],
		queryFn: getLearningSummaryRequest,
		enabled,
		staleTime: 30_000,
	});
};
