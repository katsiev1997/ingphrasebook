import * as React from 'react';
import { ChevronRight, HelpCircle } from 'lucide-react';
import * as Icons from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import type { LucideIconName } from '@/db/schema';
import type { LucideIcon } from 'lucide-react';

interface CategoryCardProps extends React.ComponentProps<'button'> {
	iconName: LucideIconName | null | undefined;
	name: string;
}

// Создаем маппинг всех иконок: iconName (без "Icon") -> компонент иконки
const iconMap = Object.keys(Icons)
	.filter((key) => key.endsWith('Icon'))
	.reduce((acc, key) => {
		const iconName = key.replace('Icon', '');
		acc[iconName] = Icons[key as keyof typeof Icons] as LucideIcon;
		return acc;
	}, {} as Record<string, LucideIcon>);

export function CategoryCard({
	iconName,
	name,
	className,
	...props
}: CategoryCardProps) {
	const IconComponent = iconName ? iconMap[iconName] : null;

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
