'use client';

import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from '@/shared/providers/theme-provider';
import { cn } from '@/shared/lib/utils';

export function ThemeToggle() {
	const { theme, resolvedTheme, toggleTheme, mounted } = useTheme();

	if (!mounted) {
		return (
			<div className="flex w-full items-center gap-4 rounded-xl bg-component-light p-4 shadow-sm dark:bg-component-dark animate-pulse">
				<div className="size-10 shrink-0 rounded-lg bg-primary/20" />
				<div className="h-5 flex-1 rounded bg-gray-200 dark:bg-gray-700" />
			</div>
		);
	}

	const getIcon = () => {
		switch (theme) {
			case 'light':
				return <Sun className="size-5" />;
			case 'dark':
				return <Moon className="size-5" />;
			case 'system':
				return <Monitor className="size-5" />;
			default:
				return <Monitor className="size-5" />;
		}
	};

	const getLabel = () => {
		switch (theme) {
			case 'light':
				return 'Светлая тема';
			case 'dark':
				return 'Темная тема';
			case 'system':
				return `Системная тема (${
					resolvedTheme === 'dark' ? 'темная' : 'светлая'
				})`;
			default:
				return 'Системная тема';
		}
	};

	return (
		<button
			onClick={toggleTheme}
			className={cn(
				'flex w-full items-center gap-4 rounded-xl bg-component-light p-4 text-left shadow-sm dark:bg-component-dark',
				'transition-colors hover:opacity-90'
			)}
			aria-label={`Переключить тему. Текущая: ${getLabel()}`}
		>
			<div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/20 text-primary">
				{getIcon()}
			</div>
			<p className="flex-1 truncate text-base font-normal leading-normal text-black dark:text-white">
				{getLabel()}
			</p>
		</button>
	);
}
