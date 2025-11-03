'use client';

import { useEffect, useState, useTransition } from 'react';
import { useGetPhrases } from '@/entities/phrase/model/queries/use-get-phrases';
import { PhraseCard } from '@/entities/phrase/ui/phrase-card';
import { useAuth } from '@/shared/hooks/use-auth';
import { CreatePhrase } from '@/widgets/create-phrase';

interface PhraseListProps {
	categoryId: string;
}

export const PhraseList = ({ categoryId }: PhraseListProps) => {
	const { data: phrases, isPending, isError } = useGetPhrases(categoryId);
	const [isMounted, setIsMounted] = useState(false);
	const [, startTransition] = useTransition();

	const { isModeratorOrAdmin } = useAuth();

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
			{showLoading && (
				<div className="text-sm text-foreground-light dark:text-foreground-dark">
					Loading...
				</div>
			)}
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
						id={String(phrase.id)}
						phrase={phrase.title}
						translation={phrase.translate}
						transcription={phrase.transcription}
						audioUrl={phrase.audioUrl || undefined}
					/>
				))}
			{isModeratorOrAdmin && <CreatePhrase defaultCategoryId={categoryId} />}
		</div>
	);
};
