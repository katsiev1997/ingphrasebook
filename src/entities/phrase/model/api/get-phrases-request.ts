import { api } from '@/shared/api';
import { Phrase } from '../../../../db/schema';

export const getPhrasesRequest = async (
	categoryId: number
): Promise<Phrase[]> => {
	const { data } = await api.get(`/phrases`, {
		params: { categoryId },
	});
	return data;
};
