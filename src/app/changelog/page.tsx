import type { Metadata } from 'next';
import Link from 'next/link';
import { BackButton } from '@/shared/components/back-button';
import { CHANGELOG_ENTRIES } from '@/shared/config/changelog';

export const metadata: Metadata = {
	title: 'Changelog | IngPhrase',
	description: 'История изменений IngPhrase',
};

export default function ChangelogPage() {
	return (
		<div className="mx-auto flex h-auto min-h-screen w-full max-w-md flex-col overflow-x-hidden bg-background-light dark:bg-background-dark font-display">
			<main className="flex-1 px-4 py-4 pb-24 space-y-6">
				<div className="flex items-center justify-between gap-3">
					<h1 className="text-3xl font-bold text-black dark:text-white">
						Changelog
					</h1>
					<BackButton fallbackHref="/settings" />
				</div>

				<p className="text-sm text-muted-foreground leading-relaxed">
					Что нового в IngPhrase. Актуальная версия приложения:{' '}
					<span className="font-medium text-foreground">
						{CHANGELOG_ENTRIES[0]?.version ?? '—'}
					</span>
					.
				</p>

				<ul className="space-y-6">
					{CHANGELOG_ENTRIES.map((entry) => (
						<li
							key={entry.version}
							className="rounded-2xl border border-border bg-card p-4 space-y-3"
						>
							<div className="flex items-baseline justify-between gap-3">
								<div>
									<p className="text-lg font-semibold text-foreground">
										v{entry.version}
									</p>
									<p className="text-sm text-muted-foreground">{entry.title}</p>
								</div>
								<time
									dateTime={entry.date}
									className="shrink-0 text-xs text-muted-foreground"
								>
									{entry.date}
								</time>
							</div>
							<ul className="space-y-2 list-disc pl-5 text-sm text-gray-700 dark:text-gray-300">
								{entry.changes.map((change) => (
									<li key={change}>{change}</li>
								))}
							</ul>
						</li>
					))}
				</ul>

				<p className="text-sm text-muted-foreground">
					<Link href="/about" className="underline">
						О проекте
					</Link>
					{' · '}
					<Link href="/settings" className="underline">
						Профиль
					</Link>
				</p>
			</main>
		</div>
	);
}
