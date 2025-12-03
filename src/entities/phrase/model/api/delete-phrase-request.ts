import { api } from '@/shared/api';

export const deletePhraseRequest = async (phraseId: number): Promise<void> => {
	await api.delete(`/phrases?id=${phraseId}`);
};
