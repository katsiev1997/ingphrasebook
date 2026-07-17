import { useMutation, useQueryClient } from '@tanstack/react-query';
import { submitSurveyRequest } from '../api/survey-requests';

export const useSubmitSurvey = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: ['survey-submit'],
		mutationFn: submitSurveyRequest,
		onSuccess: () => {
			queryClient.setQueryData(['survey-status'], { submitted: true });
			queryClient.invalidateQueries({ queryKey: ['survey-status'] });
		},
	});
};
