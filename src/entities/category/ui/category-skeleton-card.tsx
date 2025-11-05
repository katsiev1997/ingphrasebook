import { cn } from '@/shared/lib/utils';
interface CategorySkeletonCardProps {
	className?: string;
}

export const CategorySkeletonCard = ({
	className,
}: CategorySkeletonCardProps) => {
	return (
		<div
			className={cn(
				'flex w-full items-center gap-4 rounded-xl bg-component-light animate-pulse backdrop-blur-2xl h-[72px] shadow-sm dark:bg-component-dark',
				className
			)}
		></div>
	);
};
