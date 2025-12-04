'use client';

import { Phrase } from '@/db/schema';
import { ReactNode, useEffect, useState, useTransition } from 'react';
import { PhraseCard } from './phrase-card';
import { PhrasesSkeleton } from './phrases-skeleton';

interface PhraseListProps {
	phrases: Phrase[] | undefined;
	isPending: boolean;
	isError: boolean;
	createPhrase?: ReactNode;
}

export const PhraseList = ({
	phrases,
	isPending,
	isError,
	createPhrase,
}: PhraseListProps) => {
	const [isMounted, setIsMounted] = useState(false);
	const [, startTransition] = useTransition();

	useEffect(() => {
		startTransition(() => {
			setIsMounted(true);
		});
	}, []);

	// Prevent hydration mismatch by ensuring initial render matches server
	const showContent = isMounted && !isPending && !isError;
	const showLoading = !isMounted || isPending;

	return (
		<div className="mt-6 flex flex-col gap-3">
			{showLoading && <PhrasesSkeleton />}
			{isError && (
				<div className="text-sm text-destructive">Error: Something went wrong</div>
			)}
			{showContent && (!phrases || phrases.length === 0) && (
				<div className="text-sm text-foreground-light dark:text-foreground-dark">
					No phrases found
				</div>
			)}
			{showContent &&
				phrases &&
				phrases.length > 0 &&
				phrases.map((phrase) => (
					<PhraseCard
						key={phrase.id}
						id={phrase.id}
						phrase={phrase.title}
						translation={phrase.translate}
						transcription={phrase.transcription}
						categoryId={phrase.categoryId}
						audioUrl={phrase.audioUrl || undefined}
						views={phrase.views}
						favoritesCount={phrase.favoritesCount}
					/>
				))}
			{createPhrase}
		</div>
	);
};
