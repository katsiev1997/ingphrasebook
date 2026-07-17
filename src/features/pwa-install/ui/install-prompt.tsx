'use client';

import { useEffect, useState } from 'react';
import { Share, X } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { cn } from '@/shared/lib/utils';

const DISMISS_KEY = 'ingphrase-a2hs-dismissed';
const VISITED_KEY = 'ingphrase-has-visited';

function isStandaloneDisplay(): boolean {
	if (typeof window === 'undefined') return false;
	const mediaStandalone = window.matchMedia(
		'(display-mode: standalone)'
	).matches;
	const iosStandalone =
		(navigator as Navigator & { standalone?: boolean }).standalone === true;
	return mediaStandalone || iosStandalone;
}

function isIosDevice(): boolean {
	if (typeof window === 'undefined') return false;
	return (
		/iPad|iPhone|iPod/.test(navigator.userAgent) &&
		!(window as Window & { MSStream?: unknown }).MSStream
	);
}

export function InstallPrompt() {
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		if (isStandaloneDisplay()) return;
		if (!isIosDevice()) return;
		if (localStorage.getItem(DISMISS_KEY) === '1') return;

		const hasVisited = localStorage.getItem(VISITED_KEY) === '1';
		if (!hasVisited) {
			localStorage.setItem(VISITED_KEY, '1');
			return;
		}

		const timer = window.setTimeout(() => setVisible(true), 1200);
		return () => window.clearTimeout(timer);
	}, []);

	function dismiss() {
		localStorage.setItem(DISMISS_KEY, '1');
		setVisible(false);
	}

	if (!visible) return null;

	return (
		<div
			role="status"
			className={cn(
				'fixed left-2 right-2 z-40 mx-auto max-w-md',
				'bottom-[calc(5rem+env(safe-area-inset-bottom,0px))]',
				'rounded-2xl border border-gray-200/60 bg-white/90 p-4 shadow-lg backdrop-blur-lg',
				'dark:border-white/10 dark:bg-black/70'
			)}
		>
			<div className="flex items-start gap-3">
				<div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
					<Share className="size-4" aria-hidden />
				</div>
				<div className="min-w-0 flex-1 space-y-1">
					<p className="text-sm font-semibold text-foreground">
						Установить IngPhrase
					</p>
					<p className="text-xs leading-relaxed text-muted-foreground">
						Нажмите{' '}
						<span className="font-medium text-foreground">Поделиться</span>{' '}
						<span aria-hidden>⎋</span>, затем{' '}
						<span className="font-medium text-foreground">
							На экран «Домой»
						</span>{' '}
						<span aria-hidden>➕</span>.
					</p>
				</div>
				<Button
					type="button"
					variant="ghost"
					size="icon-sm"
					className="shrink-0"
					onClick={dismiss}
					aria-label="Закрыть"
				>
					<X className="size-4" />
				</Button>
			</div>
		</div>
	);
}
