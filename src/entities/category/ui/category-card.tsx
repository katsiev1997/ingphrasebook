import { ChevronRight, HelpCircle } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import type { LucideIconName } from '@/db/schema';
import { iconList } from '@/shared/consts/icon-list';

interface CategoryCardProps extends React.ComponentProps<'button'> {
	iconName: LucideIconName | null | undefined;
	name: string;
}

export function CategoryCard({
	iconName,
	name,
	className,
	...props
}: CategoryCardProps) {
	// Поддерживаем обратную совместимость: если приходит имя без "Icon", добавляем его
	const iconIndex = iconList.findIndex((icon) => icon.name === iconName);
	const IconComponent = iconIndex !== -1 ? iconList[iconIndex].component : null;
	return (
		<button
			className={cn(
				'flex w-full items-center gap-4 rounded-xl bg-component-light p-4 text-left shadow-sm dark:bg-component-dark',
				'transition-colors hover:opacity-90',
				className
			)}
			{...props}
		>
			<div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/20 text-primary">
				{IconComponent ? (
					<IconComponent className="size-5" />
				) : (
					<HelpCircle className="size-5" />
				)}
			</div>
			<p className="flex-1 truncate text-base font-normal leading-normal text-black dark:text-white">
				{name}
			</p>
			<div className="shrink-0">
				<ChevronRight className="size-5 text-gray-400" />
			</div>
		</button>
	);
}
