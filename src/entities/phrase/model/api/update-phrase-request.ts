import { api } from '@/shared/api';
import { Phrase } from '../../../../db/schema';

interface UpdatePhraseData {
	id: number;
	title: string;
	translate: string;
	transcription: string;
	categoryId: number;
	audioUrl?: string;
}

export const updatePhraseRequest = async (
	data: UpdatePhraseData
): Promise<Phrase> => {
	const { data: response } = await api.put<Phrase>('/phrases', data);
	return response;
};
