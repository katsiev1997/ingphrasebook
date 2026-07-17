'use client';

import { BackButton } from '@/shared/components/back-button';
import { DialoguesList } from '@/features/dialogues/ui/dialogues-list';

export default function DialoguesPage() {
	return (
		<div className="mx-auto flex h-auto min-h-screen w-full max-w-md flex-col overflow-x-hidden bg-background-light dark:bg-background-dark font-display">
			<main className="flex-1 px-4 py-4 pb-24">
				<div className="mb-4 flex items-center justify-between">
					<h1 className="text-2xl font-bold text-black dark:text-white">
						Диалоги
					</h1>
					<BackButton fallbackHref="/study" />
				</div>
				<DialoguesList />
			</main>
		</div>
	);
}
