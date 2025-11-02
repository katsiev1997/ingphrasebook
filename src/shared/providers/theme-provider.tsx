'use client';

import {
	createContext,
	useContext,
	useEffect,
	useState,
	startTransition,
} from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
	theme: Theme;
	setTheme: (theme: Theme) => void;
	toggleTheme: () => void;
	mounted: boolean;
	resolvedTheme: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
	const [theme, setTheme] = useState<Theme>(() => {
		// Проверяем localStorage при инициализации
		if (typeof window !== 'undefined') {
			const savedTheme = localStorage.getItem('theme') as Theme;
			return savedTheme || 'system';
		}
		return 'system';
	});
	const [mounted, setMounted] = useState(false);

	// Вычисляемую тему (light/dark) на основе выбранной темы
	const resolvedTheme =
		theme === 'system'
			? typeof window !== 'undefined' &&
			  window.matchMedia('(prefers-color-scheme: dark)').matches
				? 'dark'
				: 'light'
			: theme;

	useEffect(() => {
		startTransition(() => {
			setMounted(true);
		});
	}, []);

	useEffect(() => {
		if (!mounted) return;

		const root = window.document.documentElement;
		root.classList.remove('light', 'dark');
		root.classList.add(resolvedTheme);

		localStorage.setItem('theme', theme);
	}, [theme, resolvedTheme, mounted]);

	// Инициализация темы при первой загрузке (до монтирования)
	useEffect(() => {
		const savedTheme = localStorage.getItem('theme') as Theme;
		const initialTheme = savedTheme || 'system';

		const initialResolvedTheme =
			initialTheme === 'system'
				? window.matchMedia('(prefers-color-scheme: dark)').matches
					? 'dark'
					: 'light'
				: initialTheme;

		const root = window.document.documentElement;
		root.classList.remove('light', 'dark');
		root.classList.add(initialResolvedTheme);
	}, []);

	// Слушаем изменения системной темы
	useEffect(() => {
		if (theme !== 'system') return;

		const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
		const handleChange = () => {
			const root = window.document.documentElement;
			root.classList.remove('light', 'dark');
			root.classList.add(mediaQuery.matches ? 'dark' : 'light');
		};

		mediaQuery.addEventListener('change', handleChange);
		return () => mediaQuery.removeEventListener('change', handleChange);
	}, [theme]);

	const toggleTheme = () => {
		setTheme((prev) => {
			if (prev === 'light') return 'dark';
			if (prev === 'dark') return 'system';
			return 'light';
		});
	};

	const value = {
		theme,
		setTheme,
		toggleTheme,
		mounted,
		resolvedTheme,
	};

	return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
	const context = useContext(ThemeContext);
	if (context === undefined) {
		throw new Error('useTheme must be used within a ThemeProvider');
	}
	return context;
}
