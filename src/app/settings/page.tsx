'use client';

import { AuthBlock } from '@/features/auth';
import { ThemeToggle } from '@/shared/components/theme-toggle';
import { UserStats } from '@/features/user-stats/ui/user-stats';
import { useAuth } from '@/shared/hooks/use-auth';

export default function SettingsPage() {
	const { user } = useAuth();

	return (
		<div className="mx-auto flex h-auto min-h-screen w-full max-w-md flex-col overflow-x-hidden bg-background-light dark:bg-background-dark font-display">
			<main className="px-4 py-4 pb-24 space-y-6">
				<h1 className="mb-4 text-3xl font-bold text-black dark:text-white">
					Settings
				</h1>
				{user && <UserStats />}
				<ThemeToggle />
				<AuthBlock />
			</main>
		</div>
	);
}
