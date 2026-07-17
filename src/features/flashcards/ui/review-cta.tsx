'use client';

import Link from 'next/link';
import { Layers } from 'lucide-react';
import { useAuth } from '@/shared/hooks/use-auth';
import { useGetLearningSummary } from '@/features/flashcards';
import { Button } from '@/shared/components/ui/button';

export function ReviewCta() {
	const { isAuthenticated } = useAuth();
	const { data: summary } = useGetLearningSummary(isAuthenticated);

	if (!isAuthenticated) {
		return (
			<Button asChild variant="outline" className="mb-4 w-full justify-start">
				<Link href="/study">
					<Layers className="mr-2 size-4" />
					Начать учёбу (демо)
				</Link>
			</Button>
		);
	}

	const due = summary?.dueCount ?? 0;

	return (
		<Button asChild className="mb-4 w-full justify-start" variant={due > 0 ? 'default' : 'outline'}>
			<Link href={due > 0 ? '/flashcards' : '/study'}>
				<Layers className="mr-2 size-4" />
				{due > 0 ? `Повторить (${due})` : 'Учёба'}
			</Link>
		</Button>
	);
}
