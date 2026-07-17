import { api } from '@/shared/api';
import type { Dialogue, Message } from '@/db/schema';

export type DialogueWithMessages = Dialogue & { messages: Message[] };

export const getDialoguesRequest = async () => {
	const { data } = await api.get<DialogueWithMessages[]>('/dialogs');
	return data;
};

export const getDialogueRequest = async (id: number) => {
	const dialogues = await getDialoguesRequest();
	return dialogues.find((d) => d.id === id) ?? null;
};
