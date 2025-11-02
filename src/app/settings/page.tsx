import { ThemeToggle } from '@/shared/components/theme-toggle';

export default function SettingsPage() {
	return (
		<div className="mx-auto flex h-auto min-h-screen w-full max-w-md flex-col overflow-x-hidden bg-background-light dark:bg-background-dark font-display">
			<main className="space-y-2">
				<h1 className="mb-4 text-3xl font-bold text-black dark:text-white">
					Settings
				</h1>
				<ThemeToggle />
			</main>
		</div>
	);
}
