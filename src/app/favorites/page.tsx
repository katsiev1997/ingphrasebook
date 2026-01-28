'use client';

import { useGetFavoritePhrases } from '@/entities/phrase/model/queries/use-get-favorite-phrases';
import { BackButton } from '@/shared/components/back-button';
import { useAuth } from '@/shared/hooks/use-auth';
import { FavoritePhraseList } from '@/widgets/phrase-list';

export default function FavoritesPage() {
	const { user, isAuthenticated } = useAuth();
	const userId = user?.id;
	const { data: phrases } = useGetFavoritePhrases(userId);
	const favoriteCount = phrases?.length || 0;

	return (
		<div className="mx-auto flex h-auto min-h-screen w-full max-w-md flex-col overflow-x-hidden bg-background-light dark:bg-background-dark font-display">
			<main className="flex-1 px-4 py-4 pb-24">
				<div className="mb-4 flex items-center justify-between">
					<div>
						<h1 className="text-2xl font-bold text-black dark:text-white mb-1">
							Избранное
						</h1>
						{isAuthenticated && (
							<p className="text-sm text-muted-foreground">
								{favoriteCount}{' '}
								{favoriteCount === 1 ? 'фраза' : favoriteCount < 5 ? 'фразы' : 'фраз'}
							</p>
						)}
					</div>
					<BackButton />
				</div>
				<FavoritePhraseList />
			</main>
		</div>
	);
}
