'use client';

import { useGetPhrases } from '@/entities/phrase/model/queries/use-get-phrases';
import { PhraseCard } from '@/entities/phrase/ui/phrase-card';
import { useAuth } from '@/shared/hooks/use-auth';
import { CreatePhrase } from '@/widgets/create-phrase';

interface PhraseListProps {
	categoryId: string;
}

export const PhraseList = ({ categoryId }: PhraseListProps) => {
	const { data: phrases, isPending, isError } = useGetPhrases(categoryId);

	const { isModeratorOrAdmin } = useAuth();

	return (
		<div className="mt-6 flex flex-col gap-3">
			{isPending && (
				<div className="text-sm text-foreground-light dark:text-foreground-dark">
					Loading...
				</div>
			)}
			{isError && (
				<div className="text-sm text-destructive">Error: Something went wrong</div>
			)}
			{!isPending && !isError && (!phrases || phrases.length === 0) && (
				<div className="text-sm text-foreground-light dark:text-foreground-dark">
					No phrases found
				</div>
			)}
			{!isPending &&
				!isError &&
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
