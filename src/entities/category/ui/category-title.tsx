'use client';

import { useGetCategories } from '../model/queries/use-get-categories';

export const CategoryTitle = ({ categoryId }: { categoryId: string }) => {
	const { data: categories } = useGetCategories();

	const categoryName = categories?.find(
		(cat) => cat.id === Number(categoryId)
	)?.name;

	return (
		<h1 className="text-2xl font-bold text-black dark:text-white mb-4">
			{categoryName || 'Фразы'}
		</h1>
	);
};
