import { api } from '@/shared/api';
import { Phrase } from '../../../../db/schema';

export const addFavoritePhraseRequest = async (
	userId: number,
	phraseId: number
): Promise<Phrase[]> => {
	const { data } = await api.post('/phrases/favorite', {
		userId,
		phraseId,
	});
	return data;
};
