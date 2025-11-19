export function debounce<T extends unknown[], K>(
	fn: (...args: T) => K,
	delau: number
) {
	let timer: ReturnType<typeof setTimeout> | null = null;

	return function (...args: T) {
		if (timer !== null) clearTimeout(timer);

		timer = setTimeout(() => {
			fn(...args);
		}, delau);
	};
}
