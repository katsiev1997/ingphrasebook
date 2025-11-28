import type { Phrase } from '@/db/schema';

const STORAGE_KEY_PREFIX = 'phrases:';

interface CachedPhrases {
	phrases: Phrase[];
	categoryUpdatedAt: string;
}

export const getCachedPhrases = (categoryId: number): CachedPhrases | null => {
	if (typeof window === 'undefined') {
		return null;
	}

	try {
		const key = `${STORAGE_KEY_PREFIX}${categoryId}`;
		const cached = localStorage.getItem(key);
		if (!cached) {
			return null;
		}
		return JSON.parse(cached) as CachedPhrases;
	} catch (error) {
		console.error('Error reading from localStorage:', error);
		return null;
	}
};

export const savePhrases = (
	categoryId: number,
	phrases: Phrase[],
	categoryUpdatedAt: string
): void => {
	if (typeof window === 'undefined') {
		return;
	}

	try {
		const key = `${STORAGE_KEY_PREFIX}${categoryId}`;
		const data: CachedPhrases = {
			phrases,
			categoryUpdatedAt,
		};
		localStorage.setItem(key, JSON.stringify(data));
	} catch (error) {
		console.error('Error saving to localStorage:', error);
	}
};

export const shouldFetchPhrases = (
	categoryId: number,
	currentUpdatedAt: string
): boolean => {
	const cached = getCachedPhrases(categoryId);
	if (!cached) {
		return true;
	}
	return cached.categoryUpdatedAt !== currentUpdatedAt;
};

export const clearCachedPhrases = (categoryId: number): void => {
	if (typeof window === 'undefined') {
		return;
	}

	try {
		const key = `${STORAGE_KEY_PREFIX}${categoryId}`;
		localStorage.removeItem(key);
	} catch (error) {
		console.error('Error clearing cached phrases:', error);
	}
};
