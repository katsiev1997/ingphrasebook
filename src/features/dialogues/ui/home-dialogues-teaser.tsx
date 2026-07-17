'use client';

import Link from 'next/link';
import { MessageCircle } from 'lucide-react';
import { useGetDialogues } from '../model/queries/use-dialogues';

/** Home teaser — renders only when dialogues exist in the DB. */
export function HomeDialoguesTeaser() {
	const { data, isPending, isError } = useGetDialogues();

	if (isPending || isError || !data?.length) {
		return null;
	}

	return (
		<Link
			href="/dialogues"
			className="mb-4 flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 hover:bg-muted/40 transition"
		>
			<MessageCircle className="size-5 text-primary shrink-0" />
			<div className="min-w-0 flex-1">
				<p className="font-medium text-sm">Диалоги</p>
				<p className="text-xs text-muted-foreground">
					{data.length}{' '}
					{data.length === 1
						? 'диалог'
						: data.length < 5
							? 'диалога'
							: 'диалогов'}{' '}
					для разговорной практики
				</p>
			</div>
		</Link>
	);
}
