import { Category } from '@/entities/category';
import { SearchBar } from '@/features/search-bar';
import { CategoryList } from '@/widgets/category-list';

// Temporary categories data - will be replaced with react-query later
const categories: Category[] = [
	{
		id: 1,
		name: 'Greetings & Basics',
		icon: 'Hand',
	},
	{
		id: 2,
		name: 'Travel & Directions',
		icon: 'Plane',
	},
	{
		id: 3,
		name: 'Food & Dining',
		icon: 'Utensils',
	},
	{
		id: 4,
		name: 'Shopping',
		icon: 'ShoppingBag',
	},
	{
		id: 5,
		name: 'Emergency',
		icon: 'AlertCircle',
	},
	{
		id: 6,
		name: 'Numbers & Time',
		icon: 'Clock',
	},
];

export default function Home() {
	return (
		<div className="mx-auto flex h-auto min-h-screen w-full max-w-md flex-col overflow-x-hidden bg-background-light dark:bg-background-dark font-display">
			<main className="flex-1 px-4 py-4 pb-24">
				<h1 className="mb-4 text-3xl font-bold text-black dark:text-white">
					Ing Phrase
				</h1>
				<SearchBar />
				<CategoryList categories={categories} />
			</main>

			{/* Bottom Navigation */}
		</div>
	);
}
