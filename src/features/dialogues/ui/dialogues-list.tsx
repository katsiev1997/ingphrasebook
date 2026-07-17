'use client';

import Link from 'next/link';
import { MessageCircle } from 'lucide-react';
import { useGetDialogues } from '../model/queries/use-dialogues';

export function DialoguesList() {
	const { data, isPending, isError } = useGetDialogues();

	if (isPending) {
		return <p className="text-muted-foreground">Загрузка диалогов...</p>;
	}

	if (isError) {
		return (
			<p className="text-muted-foreground">Не удалось загрузить диалоги</p>
		);
	}

	if (!data?.length) {
		return (
			<p className="text-muted-foreground text-center mt-8">
				Пока нет диалогов. Модераторы могут добавить их через API.
			</p>
		);
	}

	return (
		<ul className="space-y-3">
			{data.map((dialogue) => (
				<li key={dialogue.id}>
					<Link
						href={`/dialogues/${dialogue.id}`}
						className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4 hover:bg-muted/40 transition"
					>
						<MessageCircle className="size-5 text-primary mt-0.5 shrink-0" />
						<div>
							<p className="font-medium">{dialogue.title}</p>
							<p className="text-sm text-muted-foreground mt-1">
								{dialogue.messages?.length ?? 0} реплик
							</p>
						</div>
					</Link>
				</li>
			))}
		</ul>
	);
}
