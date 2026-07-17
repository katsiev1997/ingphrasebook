'use client';

import { use } from 'react';
import { BackButton } from '@/shared/components/back-button';
import { DialogueDetail } from '@/features/dialogues/ui/dialogue-detail';
import { useGetDialogue } from '@/features/dialogues/model/queries/use-dialogues';

export default function DialoguePage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id: idParam } = use(params);
	const id = Number(idParam);
	const { data } = useGetDialogue(Number.isFinite(id) ? id : undefined);

	return (
		<div className="mx-auto flex h-auto min-h-screen w-full max-w-md flex-col overflow-x-hidden bg-background-light dark:bg-background-dark font-display">
			<main className="flex-1 px-4 py-4 pb-24">
				<div className="mb-4 flex items-center justify-between gap-3">
					<h1 className="text-2xl font-bold text-black dark:text-white">
						{data?.title ?? 'Диалог'}
					</h1>
					<BackButton />
				</div>
				{Number.isFinite(id) ? (
					<DialogueDetail id={id} />
				) : (
					<p className="text-muted-foreground">Некорректный id</p>
				)}
			</main>
		</div>
	);
}
