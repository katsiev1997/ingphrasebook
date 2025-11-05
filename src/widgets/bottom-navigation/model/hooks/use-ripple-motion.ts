import { MouseEvent, useEffect, useRef, useState } from 'react';

interface Ripple {
	id: string;
	x: number;
	y: number;
}

export const useRippleMotion = (activeIndex: number) => {
	const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

	const [indicatorStyle, setIndicatorStyle] = useState<{
		width: number;
		height: number;
		left: number;
		top: number;
	} | null>(null);
	const [ripples, setRipples] = useState<Record<number, Ripple[]>>({});
	const rippleIdCounter = useRef(0);

	useEffect(() => {
		const updateIndicatorPosition = () => {
			const activeItemRef = itemRefs.current[activeIndex];
			if (activeItemRef) {
				setIndicatorStyle({
					width: activeItemRef.offsetWidth,
					height: activeItemRef.offsetHeight,
					left: activeItemRef.offsetLeft,
					top: activeItemRef.offsetTop,
				});
			}
		};

		// Используем requestAnimationFrame для обновления после рендера
		requestAnimationFrame(() => {
			updateIndicatorPosition();
		});

		window.addEventListener('resize', updateIndicatorPosition);
		return () => window.removeEventListener('resize', updateIndicatorPosition);
	}, [activeIndex]);

	const handleRipple = (index: number, event: MouseEvent<HTMLDivElement>) => {
		const rect = event.currentTarget.getBoundingClientRect();
		const x = event.clientX - rect.left;
		const y = event.clientY - rect.top;

		rippleIdCounter.current += 1;
		const rippleId = `ripple-${rippleIdCounter.current}`;
		const newRipple: Ripple = { id: rippleId, x, y };

		setRipples((prev) => ({
			...prev,
			[index]: [...(prev[index] || []), newRipple],
		}));

		// Удаляем ripple после анимации
		setTimeout(() => {
			setRipples((prev) => ({
				...prev,
				[index]: (prev[index] || []).filter((r) => r.id !== rippleId),
			}));
		}, 600);
	};

	return { indicatorStyle, ripples, handleRipple, itemRefs };
};
