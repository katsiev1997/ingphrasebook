'use client';

import { Suspense } from 'react';
import { BackButton } from '@/shared/components/back-button';
import { FlashcardsView } from '@/features/flashcards';

export default function FlashcardsPage() {
	return (
		<div className="mx-auto flex h-auto min-h-screen w-full max-w-md flex-col overflow-x-hidden bg-background-light dark:bg-background-dark font-display">
			<main className="flex-1 px-4 py-4 pb-24">
				<div className="mb-4 flex items-center justify-between">
					<h1 className="text-2xl font-bold text-black dark:text-white">
						Карточки
					</h1>
					<BackButton />
				</div>
				<Suspense fallback={<p className="text-muted-foreground">Загрузка...</p>}>
					<FlashcardsView />
				</Suspense>
			</main>
		</div>
	);
}
