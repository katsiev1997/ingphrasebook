'use client';

import { ArrowLeftIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

type BackButtonProps = {
	/** Used when there is no in-app history (cold open / direct link). */
	fallbackHref?: string;
};

export const BackButton = ({ fallbackHref = '/' }: BackButtonProps) => {
	const router = useRouter();

	const onBack = () => {
		if (typeof window !== 'undefined') {
			const referrer = document.referrer;
			const sameOrigin =
				referrer.startsWith(window.location.origin) ||
				(referrer === '' && window.history.length > 1);
			if (sameOrigin && window.history.length > 1) {
				router.back();
				return;
			}
		}
		router.push(fallbackHref);
	};

	return (
		<button
			type="button"
			onClick={onBack}
			className="flex items-center gap-2 text-sm border border-border rounded-md px-4 py-2 active:bg-primary dark:active:bg-primary bg-component-light dark:bg-component-dark text-black dark:text-white hover:opacity-90 transition-opacity"
		>
			<ArrowLeftIcon className="size-4" />
			<p>Назад</p>
		</button>
	);
};
