import { useQuery } from '@tanstack/react-query';
import { getSurveyStatusRequest } from '../api/survey-requests';

export const useGetSurveyStatus = (enabled = true) => {
	return useQuery({
		queryKey: ['survey-status'],
		queryFn: getSurveyStatusRequest,
		enabled,
		staleTime: 60_000,
	});
};
