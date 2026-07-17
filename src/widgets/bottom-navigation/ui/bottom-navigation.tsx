'use client';

import { cn } from '@/shared/lib/utils';
import { motion } from 'framer-motion';
import {
	BookOpen,
	GamepadDirectionalIcon,
	Layers,
	Star,
	User,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ComponentType, useCallback, useMemo } from 'react';
import { useRippleMotion } from '../model/hooks/use-ripple-motion';

interface NavItem {
	href: string;
	icon: ComponentType<{ className?: string }>;
	label: string;
	isActive?: boolean;
	matchPrefix?: boolean;
}

interface BottomNavigationProps {
	className?: string;
}

const navItems: NavItem[] = [
	{
		href: '/',
		icon: BookOpen,
		label: 'Фразы',
	},
	{
		href: '/study',
		icon: Layers,
		label: 'Обучение',
		matchPrefix: true,
	},
	{
		href: '/game',
		icon: GamepadDirectionalIcon,
		label: 'Игра',
	},
	{
		href: '/favorites',
		icon: Star,
		label: 'Избранное',
	},
	{
		href: '/settings',
		icon: User,
		label: 'Профиль',
	},
];

function pathMatches(pathname: string, item: NavItem) {
	if (item.href === '/') {
		return (
			pathname === '/' ||
			pathname.startsWith('/search') ||
			pathname.startsWith('/phrases')
		);
	}
	if (item.matchPrefix) {
		return (
			pathname === item.href ||
			pathname.startsWith(`${item.href}/`) ||
			pathname.startsWith('/flashcards') ||
			pathname.startsWith('/dialogues') ||
			pathname.startsWith('/dictation') ||
			pathname.startsWith('/statistics') ||
			pathname.startsWith('/pronunciation')
		);
	}
	return pathname === item.href;
}

export function BottomNavigation({ className }: BottomNavigationProps) {
	const pathname = usePathname();
	const isActive = useCallback(
		(item: NavItem) => pathMatches(pathname, item),
		[pathname]
	);
	const activeIndex = useMemo(() => {
		const index = navItems.findIndex((item) => pathMatches(pathname, item));
		return index !== -1 ? index : 0;
	}, [pathname]);

	const { handleRipple, indicatorStyle, ripples, itemRefs } =
		useRippleMotion(activeIndex);

	return (
		<footer
			className={cn(
				'fixed h-[68px] items-center bottom-5 left-2 right-2 rounded-full z-50 border border-gray-200/60 bg-white/70 backdrop-blur-lg dark:border-white/10 dark:bg-black/50',
				'mx-auto max-w-md',
				className
			)}
		>
			<div className="relative flex h-full items-center justify-around px-1">
				{indicatorStyle && (
					<motion.div
						className="absolute border border-gray-200/60 bg-white/20 backdrop-blur-lg rounded-full"
						layoutId="activeIndicator"
						initial={false}
						animate={indicatorStyle}
						transition={{
							type: 'spring',
							stiffness: 300,
							damping: 30,
						}}
					/>
				)}
				{navItems.map((item, index) => {
					const Icon = item.icon;
					return (
						<div
							key={item.href}
							ref={(el) => {
								itemRefs.current[index] = el;
							}}
							className="relative w-24 rounded-full p-2 overflow-hidden"
							onClick={(e) => handleRipple(index, e)}
						>
							{(ripples[index] || []).map((ripple) => (
								<motion.span
									key={ripple.id}
									className="absolute rounded-full bg-primary/40 dark:bg-white/20"
									initial={{
										width: 0,
										height: 0,
										left: ripple.x,
										top: ripple.y,
										x: '-50%',
										y: '-50%',
										opacity: 0.6,
									}}
									animate={{
										width: 200,
										height: 200,
										opacity: 0,
									}}
									transition={{
										duration: 0.6,
										ease: 'easeOut',
									}}
									style={{
										pointerEvents: 'none',
									}}
								/>
							))}
							<Link
								href={item.href}
								className={cn(
									'relative z-10 flex flex-col items-center gap-1',
									isActive(item)
										? 'text-primary'
										: 'text-gray-500 dark:text-gray-400'
								)}
							>
								<Icon className={cn('size-6', item.isActive && 'font-semibold')} />
								<span className="text-xs font-medium">{item.label}</span>
							</Link>
						</div>
					);
				})}
			</div>
		</footer>
	);
}
