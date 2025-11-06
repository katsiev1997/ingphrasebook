import { api } from '@/shared/api';
import { Phrase } from '../../../../db/schema';

export const deleteFavoritePhraseRequest = async (
	userId: number,
	phraseId: number
): Promise<Phrase[]> => {
	const { data } = await api.delete(
		`/phrases/favorite?userId=${userId}&phraseId=${phraseId}`
	);
	return data;
};
