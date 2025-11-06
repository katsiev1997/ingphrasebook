'use client';

import { PhraseList, useGetPhrases } from '@/entities/phrase';
import { CreatePhrase } from '@/features/create-phrase';
import { useAuth } from '@/shared/hooks/use-auth';

type Props = {
	categoryId: string;
};

export const PhraseListCategory = ({ categoryId }: Props) => {
	const { data: phrases, isPending, isError } = useGetPhrases(categoryId);
	const { isModeratorOrAdmin } = useAuth();

	return (
		<PhraseList
			phrases={phrases}
			isPending={isPending}
			isError={isError}
			createPhrase={
				isModeratorOrAdmin && <CreatePhrase defaultCategoryId={categoryId} />
			}
		/>
	);
};
