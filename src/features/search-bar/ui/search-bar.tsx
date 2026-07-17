'use client';

import { Search, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Input } from '@/shared/components/ui/input';
import { useEffect, useMemo, useRef, useState } from 'react';
import { debounce } from '@/shared/lib/debounce';

interface SearchBarProps {
	onSearchChange?: (query: string) => void;
}

export const SearchBar = ({ onSearchChange }: SearchBarProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState('');
	const inputRef = useRef<HTMLInputElement>(null);

	const focusInput = () => {
		inputRef.current?.focus({ preventScroll: true });
	};

	const debouncedSearch = useMemo(
		() =>
			debounce((value: string) => {
				onSearchChange?.(value);
			}, 300),
		[onSearchChange]
	);

	useEffect(() => {
		if (!isOpen) return;

		const raf = requestAnimationFrame(focusInput);
		const timeout = window.setTimeout(focusInput, 50);

		return () => {
			cancelAnimationFrame(raf);
			window.clearTimeout(timeout);
		};
	}, [isOpen]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setSearchQuery(value);

		if (value.trim().length === 0) {
			onSearchChange?.('');
		} else {
			debouncedSearch(value);
		}
	};

	const open = () => setIsOpen(true);

	const close = () => {
		setIsOpen(false);
		setSearchQuery('');
		onSearchChange?.('');
	};

	return (
		<div className="pointer-events-none fixed inset-x-0 bottom-28 z-[60] mx-auto max-w-md px-4">
			<AnimatePresence mode="wait" initial={false}>
				{isOpen ? (
					<motion.div
						key="search-field"
						initial={{ opacity: 0, y: 16, scale: 0.96 }}
						animate={{ opacity: 1, y: 0, scale: 1 }}
						exit={{ opacity: 0, y: 12, scale: 0.96 }}
						transition={{ type: 'spring', stiffness: 380, damping: 28 }}
						onAnimationComplete={focusInput}
						className="pointer-events-auto relative flex items-center gap-2 rounded-full border border-border bg-component-light py-1.5 pl-4 pr-1.5 shadow-lg dark:bg-component-dark"
					>
						<Search className="size-5 shrink-0 text-muted-foreground" />
						<Input
							ref={inputRef}
							autoFocus
							className="h-10 flex-1 border-none bg-transparent px-0 text-black shadow-none placeholder-gray-600 focus-visible:ring-0 dark:text-white dark:placeholder-gray-400"
							placeholder="Поиск по всем фразам"
							type="search"
							value={searchQuery}
							onChange={handleChange}
							autoComplete="new-password"
							name="search-phrases"
							onKeyDown={(e) => {
								if (e.key === 'Escape') close();
							}}
						/>
						<motion.button
							type="button"
							aria-label="Закрыть поиск"
							whileTap={{ scale: 0.9 }}
							onClick={close}
							className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted text-foreground"
						>
							<X className="size-5" />
						</motion.button>
					</motion.div>
				) : (
					<motion.button
						key="search-fab"
						type="button"
						aria-label="Открыть поиск"
						initial={{ opacity: 0, scale: 0.8 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0.8 }}
						whileTap={{ scale: 0.92 }}
						transition={{ type: 'spring', stiffness: 400, damping: 22 }}
						onClick={open}
						className="pointer-events-auto ml-auto flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg"
					>
						<Search className="size-6" />
					</motion.button>
				)}
			</AnimatePresence>
		</div>
	);
};
