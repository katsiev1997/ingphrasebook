import { PhraseList } from '@/widgets/phrase-list';
import { ArrowLeftIcon } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';
import type { Metadata } from 'next';
import { getCategoriesRequest, CategoryTitle } from '@/entities/category';
import { PhrasesSkeleton } from '@/entities/phrase';
import { QueryClient } from '@tanstack/react-query';
import { getPhrasesRequest } from '@/entities/phrase/model/api/get-phrases-request';

type Props = {
	params: Promise<{
		categoryId: string;
	}>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const categoryId = parseInt((await params).categoryId);

	try {
		const categories = await getCategoriesRequest();
		const category = categories.find((cat) => cat.id === categoryId);

		return {
			title: category ? `${category.name} | IngPhrase` : 'Фразы | IngPhrase',
			description: category
				? `Фразы категории "${category.name}" на ингушском языке`
				: 'Фразы на ингушском языке',
		};
	} catch {
		return {
			title: 'Фразы | IngPhrase',
			description: 'Фразы на ингушском языке',
		};
	}
}

export default async function PhrasesPage({ params }: Props) {
	const categoryId = (await params).categoryId;

	const queryClient = new QueryClient();

	queryClient.prefetchQuery({
		queryKey: ['phrases', categoryId],
		queryFn: () => getPhrasesRequest(Number(categoryId)),
	});

	return (
		<div className="mx-auto flex h-auto min-h-screen w-full max-w-md flex-col overflow-x-hidden bg-background-light dark:bg-background-dark font-display">
			<main className="flex-1 px-4 py-4 pb-24">
				<div className="mb-4 flex items-center justify-between">
					<CategoryTitle categoryId={categoryId} />
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
				<Suspense fallback={<PhrasesSkeleton />}>
					<PhraseList categoryId={categoryId} />
				</Suspense>
			</main>
		</div>
	);
}
