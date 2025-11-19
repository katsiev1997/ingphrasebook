import { api } from '@/shared/api';
import { Phrase } from '@/db/schema';

export const getGamePhrasesRequest = async (): Promise<Phrase[]> => {
	const { data } = await api.get<Phrase[]>('/game/phrases');
	return data;
};

