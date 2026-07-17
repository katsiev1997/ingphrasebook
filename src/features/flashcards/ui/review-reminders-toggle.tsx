'use client';

import { Switch } from '@/shared/components/ui/switch';
import { Label } from '@/shared/components/ui/label';
import { useEffect, useSyncExternalStore } from 'react';
import { Bell } from 'lucide-react';
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from '@/shared/components/ui/card';
import { useGetLearningSummary } from '@/features/flashcards';
import { useAuth } from '@/shared/hooks/use-auth';

const STORAGE_KEY = 'ingphrase-review-reminders';

function subscribeReminder(onStoreChange: () => void) {
	window.addEventListener('storage', onStoreChange);
	return () => window.removeEventListener('storage', onStoreChange);
}

function getReminderSnapshot() {
	return localStorage.getItem(STORAGE_KEY) === '1';
}

function getReminderServerSnapshot() {
	return false;
}

function getPermissionSnapshot(): NotificationPermission {
	if (typeof window === 'undefined' || !('Notification' in window)) {
		return 'default';
	}
	return Notification.permission;
}

function getPermissionServerSnapshot(): NotificationPermission {
	return 'default';
}

function subscribePermission(onStoreChange: () => void) {
	const id = window.setInterval(onStoreChange, 2000);
	return () => window.clearInterval(id);
}

export function ReviewRemindersToggle() {
	const { isAuthenticated } = useAuth();
	const { data: summary } = useGetLearningSummary(isAuthenticated);
	const enabled = useSyncExternalStore(
		subscribeReminder,
		getReminderSnapshot,
		getReminderServerSnapshot
	);
	const permission = useSyncExternalStore(
		subscribePermission,
		getPermissionSnapshot,
		getPermissionServerSnapshot
	);

	useEffect(() => {
		if (
			!enabled ||
			typeof window === 'undefined' ||
			!('Notification' in window) ||
			Notification.permission !== 'granted' ||
			!summary ||
			summary.dueCount <= 0
		) {
			return;
		}

		const todayKey = new Date().toISOString().slice(0, 10);
		const shownKey = `ingphrase-reminder-shown-${todayKey}`;
		if (sessionStorage.getItem(shownKey) === '1') {
			return;
		}

		new Notification('IngPhrase', {
			body: `Есть ${summary.dueCount} карточек к повторению`,
			tag: 'ingphrase-due-reviews',
		});
		sessionStorage.setItem(shownKey, '1');
	}, [enabled, summary]);

	const onToggle = async (value: boolean) => {
		if (typeof window === 'undefined' || !('Notification' in window)) {
			return;
		}

		if (value) {
			const result = await Notification.requestPermission();
			if (result !== 'granted') {
				localStorage.setItem(STORAGE_KEY, '0');
				window.dispatchEvent(new Event('storage'));
				return;
			}
			localStorage.setItem(STORAGE_KEY, '1');
		} else {
			localStorage.setItem(STORAGE_KEY, '0');
		}
		window.dispatchEvent(new Event('storage'));
	};

	if (!isAuthenticated) {
		return null;
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2 text-base">
					<Bell className="size-5" />
					Напоминания о повторении
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-3">
				<div className="flex items-center justify-between gap-4">
					<Label htmlFor="review-reminders" className="text-sm font-normal">
						Браузерные уведомления, если есть карточки на сегодня
					</Label>
					<Switch
						id="review-reminders"
						checked={enabled}
						onCheckedChange={(v) => void onToggle(v)}
					/>
				</div>
				{permission === 'denied' && (
					<p className="text-xs text-muted-foreground">
						Уведомления заблокированы в настройках браузера.
					</p>
				)}
			</CardContent>
		</Card>
	);
}
