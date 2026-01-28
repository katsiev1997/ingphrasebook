import { ChevronRight, HelpCircle } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import type { LucideIconName } from '@/db/schema';
import { iconList } from '@/shared/consts/icon-list';
import Link from 'next/link';

interface CategoryCardProps extends React.ComponentProps<'a'> {
	iconName: LucideIconName | null | undefined;
	name: string;
	categoryId: number;
	phraseCount?: number;
}

export function CategoryCard({
	iconName,
	name,
	categoryId,
	phraseCount,
	className,
	...props
}: CategoryCardProps) {
	// Поддерживаем обратную совместимость: если приходит имя без "Icon", добавляем его
	const iconIndex = iconList.findIndex((icon) => icon.name === iconName);
	const IconComponent = iconIndex !== -1 ? iconList[iconIndex].component : null;
	return (
		<Link
			href={`/phrases/${categoryId}`}
			className={cn(
				'flex w-full items-center gap-4 rounded-xl bg-component-light p-4 text-left shadow-sm dark:bg-component-dark active:opacity-50',
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
			<div className="flex-1 min-w-0">
				<p className="truncate text-base font-normal leading-normal text-black dark:text-white">
					{name}
				</p>
				{phraseCount !== undefined && (
					<p className="text-xs text-muted-foreground">
						{phraseCount}{' '}
						{phraseCount === 1 ? 'фраза' : phraseCount < 5 ? 'фразы' : 'фраз'}
					</p>
				)}
			</div>
			<div className="shrink-0">
				<ChevronRight className="size-5 text-gray-400" />
			</div>
		</Link>
	);
}
