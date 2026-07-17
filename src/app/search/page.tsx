'use client';

import { useState } from 'react';
import { BackButton } from '@/shared/components/back-button';
import { SearchBar } from '@/features/search-bar';
import { PhraseList } from '@/entities/phrase';
import { useSearchPhrases } from '@/entities/phrase/model/queries/use-search-phrases';

export default function SearchPage() {
	const [searchQuery, setSearchQuery] = useState('');
	const {
		data: searchResults,
		isPending: searchPending,
		isError: searchError,
	} = useSearchPhrases(searchQuery);

	const isSearching = searchQuery.trim().length > 0;

	return (
		<div className="mx-auto flex h-auto min-h-screen w-full max-w-md flex-col overflow-x-hidden bg-background-light dark:bg-background-dark font-display">
			<main className="flex-1 space-y-4 px-4 py-4 pb-24">
				<div className="flex items-center justify-between gap-3">
					<h1 className="text-3xl font-bold text-black dark:text-white">Поиск</h1>
					<BackButton fallbackHref="/" />
				</div>

				<SearchBar onSearchChange={setSearchQuery} autoFocus />

				{isSearching ? (
					<PhraseList
						phrases={searchResults}
						isPending={searchPending}
						isError={searchError}
					/>
				) : (
					<p className="text-sm text-muted-foreground">
						Введите слово или фразу на русском или ингушском.
					</p>
				)}
			</main>
		</div>
	);
}
