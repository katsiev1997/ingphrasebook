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
			// Do not invalidate learning-due mid-session — refetch remounts the deck
			// and resets the card index (1→2→1 flicker).
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
