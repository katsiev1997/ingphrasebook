import { Category, CategoryCard } from '@/entities/category';

interface CategoryListProps {
	categories: Category[];
}

export const CategoryList = ({ categories }: CategoryListProps) => {
	return (
		<div className="mt-6 flex flex-col gap-3">
			{categories.map((category) => (
				<CategoryCard
					key={category.id}
					iconName={category.icon}
					name={category.name}
				/>
			))}
		</div>
	);
};
