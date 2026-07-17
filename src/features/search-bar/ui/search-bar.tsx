'use client';

import { Search } from 'lucide-react';
import { Input } from '@/shared/components/ui/input';
import { useEffect, useMemo, useRef, useState } from 'react';
import { debounce } from '@/shared/lib/debounce';

interface SearchBarProps {
	onSearchChange?: (query: string) => void;
	autoFocus?: boolean;
}

export const SearchBar = ({
	onSearchChange,
	autoFocus = false,
}: SearchBarProps) => {
	const [searchQuery, setSearchQuery] = useState('');
	const inputRef = useRef<HTMLInputElement>(null);

	const debouncedSearch = useMemo(
		() =>
			debounce((value: string) => {
				onSearchChange?.(value);
			}, 300),
		[onSearchChange]
	);

	useEffect(() => {
		if (!autoFocus) return;
		const id = requestAnimationFrame(() => {
			inputRef.current?.focus({ preventScroll: true });
		});
		return () => cancelAnimationFrame(id);
	}, [autoFocus]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setSearchQuery(value);

		if (value.trim().length === 0) {
			onSearchChange?.('');
		} else {
			debouncedSearch(value);
		}
	};

	return (
		<div className="relative">
			<Search className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
			<Input
				ref={inputRef}
				autoFocus={autoFocus}
				className="h-12 w-full rounded-lg border-none bg-component-light pl-10 pr-4 text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/50 dark:bg-component-dark dark:text-white dark:placeholder-gray-400"
				placeholder="Поиск по всем фразам"
				type="search"
				value={searchQuery}
				onChange={handleChange}
				autoComplete="new-password"
				name="search-phrases"
			/>
		</div>
	);
};
