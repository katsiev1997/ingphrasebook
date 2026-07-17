import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
	enqueueFailedPhrasesRequest,
	submitReviewRequest,
} from '../api/learning-requests';

export const useSubmitReview = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: ['learning-review'],
		mutationFn: submitReviewRequest,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['learning-due'] });
			queryClient.invalidateQueries({ queryKey: ['learning-summary'] });
			queryClient.invalidateQueries({ queryKey: ['user-stats'] });
		},
	});
};

export const useEnqueueFailedPhrases = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: ['learning-enqueue-fails'],
		mutationFn: enqueueFailedPhrasesRequest,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['learning-due'] });
			queryClient.invalidateQueries({ queryKey: ['learning-summary'] });
		},
	});
};
