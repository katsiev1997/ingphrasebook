'use client';

import * as React from 'react';
import Link from 'next/link';
import { BookOpen, Star, Settings } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { usePathname } from 'next/navigation';

interface NavItem {
	href: string;
	icon: React.ComponentType<{ className?: string }>;
	label: string;
	isActive?: boolean;
}

interface BottomNavigationProps {
	className?: string;
}

const navItems: NavItem[] = [
	{
		href: '/',
		icon: BookOpen,
		label: 'Phrasebook',
	},
	{
		href: '/favorites',
		icon: Star,
		label: 'Favorites',
	},
	{
		href: '/settings',
		icon: Settings,
		label: 'Settings',
	},
];

export function BottomNavigation({ className }: BottomNavigationProps) {
	const pathname = usePathname();
	const isActive = (href: string) => pathname === href;
	return (
		<footer
			className={cn(
				'fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200/60 bg-white/70 pb-4 pt-2 backdrop-blur-lg dark:border-white/10 dark:bg-black/50',
				'mx-auto max-w-md',
				className
			)}
		>
			<div className="flex justify-around">
				{navItems.map((item) => {
					const Icon = item.icon;
					return (
						<Link
							key={item.href}
							href={item.href}
							className={cn(
								'flex flex-col items-center gap-1',
								isActive(item.href)
									? 'text-primary'
									: 'text-gray-500 dark:text-gray-400'
							)}
						>
							<Icon className={cn('size-6', item.isActive && 'font-semibold')} />
							<span className="text-xs font-medium">{item.label}</span>
						</Link>
					);
				})}
			</div>
		</footer>
	);
}
