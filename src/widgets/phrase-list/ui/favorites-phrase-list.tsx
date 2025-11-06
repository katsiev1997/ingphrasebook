'use client';

import { PhraseList } from '@/entities/phrase';
import { useAuth } from '@/shared/hooks/use-auth';
import { useGetFavoritePhrases } from '../../../entities/phrase/model/queries/use-get-favorite-phrases';

export const FavoritePhraseList = () => {
	const { user } = useAuth();
	const userId = user?.id;
	const { data: phrases, isPending, isError } = useGetFavoritePhrases(userId);

	return (
		<PhraseList phrases={phrases} isPending={isPending} isError={isError} />
	);
};
