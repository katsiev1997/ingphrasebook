'use client';

import { Search } from 'lucide-react';
import { Input } from '@/shared/components/ui/input';
import { useState, useMemo } from 'react';
import { debounce } from '@/shared/lib/debounce';

interface SearchBarProps {
	onSearchChange?: (query: string) => void;
}

export const SearchBar = ({ onSearchChange }: SearchBarProps) => {
	const [searchQuery, setSearchQuery] = useState('');

	const debouncedSearch = useMemo(
		() =>
			debounce((value: string) => {
				onSearchChange?.(value);
			}, 300),
		[onSearchChange]
	);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setSearchQuery(value);

		// Если поле очищено, обновляем поиск сразу без задержки
		if (value.trim().length === 0) {
			onSearchChange?.('');
		} else {
			debouncedSearch(value);
		}
	};

	return (
		<div className="relative">
			<Search className="size-5 text-gray-400 dark:text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
			<Input
				className="w-full rounded-lg border-none bg-component-light h-12 pl-10 pr-4 text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/50 dark:bg-component-dark dark:text-white dark:placeholder-gray-400"
				placeholder="Search all phrases"
				type="search"
				value={searchQuery}
				onChange={handleChange}
				autoComplete="new-password"
				name="search-phrases"
			/>
		</div>
	);
};
