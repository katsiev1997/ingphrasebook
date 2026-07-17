'use client';

import { ChevronRight, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';
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
		<motion.div
			initial={{ opacity: 0, y: 12 }}
			animate={{ opacity: 1, y: 0 }}
			whileHover="hover"
			whileTap={{ scale: 0.98 }}
			transition={{
				opacity: { duration: 0.25, ease: 'easeOut' },
				y: { duration: 0.25, ease: 'easeOut' },
				scale: { type: 'spring', stiffness: 400, damping: 24 },
			}}
			variants={{
				hover: { opacity: 0.9 },
			}}
			className={cn(
				'rounded-xl bg-component-light shadow-sm dark:bg-component-dark',
				className
			)}
		>
			<Link
				href={`/phrases/${categoryId}`}
				className="flex w-full items-center gap-4 p-4 text-left"
				{...props}
			>
				<motion.div
					className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/20 text-primary"
					variants={{
						hover: { scale: 1.06 },
					}}
					transition={{ type: 'spring', stiffness: 400, damping: 20 }}
				>
					{IconComponent ? (
						<IconComponent className="size-5" />
					) : (
						<HelpCircle className="size-5" />
					)}
				</motion.div>
				<div className="flex-1 min-w-0">
					<p className="truncate text-base font-normal leading-normal text-black dark:text-white">
						{name}
					</p>
					{phraseCount !== undefined && (
						<p className="text-xs text-muted-foreground">
							{phraseCount}{' '}
							{phraseCount === 1
								? 'фраза'
								: phraseCount < 5
									? 'фразы'
									: 'фраз'}
						</p>
					)}
				</div>
				<motion.div
					className="shrink-0"
					variants={{
						hover: { x: 3 },
					}}
					transition={{ type: 'spring', stiffness: 400, damping: 24 }}
				>
					<ChevronRight className="size-5 text-gray-400" />
				</motion.div>
			</Link>
		</motion.div>
	);
}
