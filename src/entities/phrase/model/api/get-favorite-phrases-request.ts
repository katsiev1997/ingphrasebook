import { api } from '@/shared/api';
import { Phrase } from '../../../../db/schema';

export const getFavoritePhrasesRequest = async (
	userId: number | undefined
): Promise<Phrase[]> => {
	if (!userId) {
		return [];
	}
	const { data } = await api.get('/phrases/favorite', {
		params: { userId },
	});
	return data;
};
