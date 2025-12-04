import { api } from '@/shared/api';

export const incrementPhraseViewsRequest = async (
	phraseId: number
): Promise<{ success: boolean; views: number }> => {
	const { data } = await api.post<{ success: boolean; views: number }>(
		'/phrases/view',
		{ phraseId }
	);
	return data;
};

