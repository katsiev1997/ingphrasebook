'use client';

import { FavoritePhraseList } from '@/widgets/phrase-list';
import { ArrowLeftIcon } from 'lucide-react';
import Link from 'next/link';
import { useGetFavoritePhrases } from '@/entities/phrase/model/queries/use-get-favorite-phrases';
import { useAuth } from '@/shared/hooks/use-auth';

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
								{favoriteCount} {favoriteCount === 1 ? 'фраза' : favoriteCount < 5 ? 'фразы' : 'фраз'}
							</p>
						)}
					</div>
					<Link
						href="/"
						className="text-black dark:text-white hover:opacity-90 transition-opacity"
					>
						<div className="flex items-center gap-2 text-sm border border-border rounded-md px-4 py-2 bg-component-light dark:bg-component-dark">
							<ArrowLeftIcon className="size-4" />
							<p>Назад</p>
						</div>
					</Link>
				</div>
				<FavoritePhraseList />
			</main>
		</div>
	);
}
