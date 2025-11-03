import { api } from '@/shared/api';
import { Phrase } from '../../../../db/schema';

export const searchPhrasesRequest = async (
	query: string
): Promise<Phrase[]> => {
	const { data } = await api.get(`/phrases/search`, {
		params: { query },
	});
	return data;
};
