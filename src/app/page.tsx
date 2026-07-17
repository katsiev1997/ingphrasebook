'use client';

import { useState } from 'react';
import { useGetCategories } from '@/entities/category/model/queries/use-get-categories';
import { useSearchPhrases } from '@/entities/phrase/model/queries/use-search-phrases';
import { SearchBar } from '@/features/search-bar';
import { ReviewCta } from '@/features/flashcards';
import { CategoryList } from '@/widgets/category-list';
import { PhraseList } from '@/entities/phrase';

export default function Home() {
	const [searchQuery, setSearchQuery] = useState('');
	const {
		data: categories,
		isPending: categoriesPending,
		isError: categoriesError,
	} = useGetCategories();
	const {
		data: searchResults,
		isPending: searchPending,
		isError: searchError,
	} = useSearchPhrases(searchQuery);

	const isSearching = searchQuery.trim().length > 0;

	return (
		<div className="mx-auto flex h-auto min-h-screen w-full max-w-md flex-col overflow-x-hidden bg-background-light dark:bg-background-dark font-display">
			<main className="flex-1 px-4 py-4 pb-24">
				<h1 className="mb-4 text-3xl font-bold text-black dark:text-white">
					Ing Phrase
				</h1>
				{!isSearching && <ReviewCta />}
				<SearchBar onSearchChange={setSearchQuery} />
				{isSearching ? (
					<PhraseList
						phrases={searchResults}
						isPending={searchPending}
						isError={searchError}
					/>
				) : (
					<CategoryList
						categories={categories || []}
						isPending={categoriesPending}
						isError={categoriesError}
					/>
				)}
			</main>
		</div>
	);
}
