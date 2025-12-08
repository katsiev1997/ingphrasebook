'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

const FIRST_VISIT_KEY = 'ingphrasebook:first-visit';

export function FirstVisitRedirect() {
	const router = useRouter();
	const pathname = usePathname();

	useEffect(() => {
		// Avoid running during SSR
		if (typeof window === 'undefined') return;

		// Redirect only when user lands on the homepage
		if (pathname !== '/') return;

		const hasVisited = localStorage.getItem(FIRST_VISIT_KEY);
		if (hasVisited) return;

		localStorage.setItem(FIRST_VISIT_KEY, 'true');

		if (pathname !== '/about') {
			router.replace('/about');
		}
	}, [pathname, router]);

	return null;
}
