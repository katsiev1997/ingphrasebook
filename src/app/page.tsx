'use client';

import { useGetCategories } from '@/entities/category/model/queries/use-get-categories';
import { SearchFab } from '@/features/search-bar';
import { ReviewCta } from '@/features/flashcards';
import { HomeDialoguesTeaser } from '@/features/dialogues/ui/home-dialogues-teaser';
import { CategoryList } from '@/widgets/category-list';

export default function Home() {
	const {
		data: categories,
		isPending: categoriesPending,
		isError: categoriesError,
	} = useGetCategories();

	return (
		<div className="mx-auto flex h-auto min-h-screen w-full max-w-md flex-col overflow-x-hidden bg-background-light dark:bg-background-dark font-display">
			<main className="flex-1 px-4 py-4 pb-24">
				<h1 className="mb-4 text-3xl font-bold text-black dark:text-white">
					Ing Phrase
				</h1>
				<ReviewCta />
				<HomeDialoguesTeaser />
				<SearchFab />
				<CategoryList
					categories={categories || []}
					isPending={categoriesPending}
					isError={categoriesError}
				/>
			</main>
		</div>
	);
}
