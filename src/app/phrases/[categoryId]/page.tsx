import { CategoryTitle, getCategoriesRequest } from '@/entities/category';
import { BackButton } from '@/shared/components/back-button';
import { PhraseListCategory } from '@/widgets/phrase-list';
import type { Metadata } from 'next';

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

	return (
		<div className="mx-auto flex h-auto min-h-screen w-full max-w-md flex-col overflow-x-hidden bg-background-light dark:bg-background-dark font-display">
			<main className="flex-1 px-4 py-4 pb-24">
				<div className="mb-4 flex items-center justify-between">
					<CategoryTitle categoryId={categoryId} />
					<BackButton fallbackHref="/" />
				</div>
				<PhraseListCategory categoryId={categoryId} />
			</main>
		</div>
	);
}
