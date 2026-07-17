import { useQuery } from '@tanstack/react-query';
import { getDialogueRequest, getDialoguesRequest } from '../api/dialogues-requests';

export const useGetDialogues = () => {
	return useQuery({
		queryKey: ['dialogues'],
		queryFn: getDialoguesRequest,
	});
};

export const useGetDialogue = (id: number | undefined) => {
	return useQuery({
		queryKey: ['dialogue', id],
		queryFn: () => getDialogueRequest(id!),
		enabled: !!id,
	});
};
