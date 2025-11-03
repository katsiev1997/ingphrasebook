'use client';

import { useGetPhrases } from '@/entities/phrase/model/queries/use-get-phrases';
import { PhraseCard } from '@/entities/phrase/ui/phrase-card';

interface PhraseListProps {
	categoryId: string;
}

export const PhraseList = ({ categoryId }: PhraseListProps) => {
	const { data: phrases, isPending, isError } = useGetPhrases(categoryId);

	if (isPending) {
		return <div>Loading...</div>;
	}

	if (isError) {
		return <div>Error: Something went wrong</div>;
	}

	if (!phrases || phrases.length === 0) {
		return <div>No phrases found</div>;
	}

	return (
		<div className="mt-6 flex flex-col gap-3">
			{phrases.map((phrase) => (
				<PhraseCard
					key={phrase.id}
					id={String(phrase.id)}
					phrase={phrase.title}
					translation={phrase.translate}
					transcription={phrase.transcription}
					audioUrl={phrase.audioUrl || undefined}
				/>
			))}
		</div>
	);
};

