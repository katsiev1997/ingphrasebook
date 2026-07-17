'use client';

import { Volume2 } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { useGetDialogue } from '../model/queries/use-dialogues';

export function DialogueDetail({ id }: { id: number }) {
	const { data, isPending, isError } = useGetDialogue(id);

	if (isPending) {
		return <p className="text-muted-foreground">Загрузка...</p>;
	}

	if (isError || !data) {
		return <p className="text-muted-foreground">Диалог не найден</p>;
	}

	const playAudio = () => {
		if (!data.audioUrl) {
			return;
		}
		void new Audio(data.audioUrl).play();
	};

	return (
		<div className="space-y-4">
			{data.audioUrl && (
				<Button type="button" variant="outline" className="w-full" onClick={playAudio}>
					<Volume2 className="mr-2 size-4" />
					Слушать диалог
				</Button>
			)}
			<ul className="space-y-3">
				{data.messages.map((message, index) => (
					<li
						key={message.id}
						className={`rounded-2xl border border-border p-4 ${
							index % 2 === 0 ? 'bg-card' : 'bg-muted/40'
						}`}
					>
						<p className="font-medium text-lg">{message.originalText}</p>
						<p className="text-muted-foreground mt-2">{message.translatedText}</p>
					</li>
				))}
			</ul>
		</div>
	);
}
