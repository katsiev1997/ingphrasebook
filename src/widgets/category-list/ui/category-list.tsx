import { Category, CategoryCard } from '@/entities/category';
import { CreateCategory } from '@/features/create-category';
import { useAuth } from '@/shared/hooks/use-auth';

interface CategoryListProps {
	categories: Category[];
	isPending: boolean;
	isError: boolean;
}

export const CategoryList = ({
	categories,
	isPending,
	isError,
}: CategoryListProps) => {
	const { user } = useAuth();

	const canAddPhrase = user?.role === 'MODERATOR' || user?.role === 'ADMIN';

	if (isPending) {
		return <div>Loading...</div>;
	}
	if (isError) {
		return <div>Error: Something went wrong</div>;
	}

	return (
		<div className="mt-6 flex flex-col gap-3">
			{categories.map((category) => (
				<CategoryCard
					categoryId={category.id}
					key={category.id}
					iconName={category.icon}
					name={category.name}
				/>
			))}
			{canAddPhrase && <CreateCategory />}
		</div>
	);
};
