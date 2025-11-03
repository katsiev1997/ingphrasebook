'use client';

import { cn } from '@/shared/lib/utils';
import { AudioControls } from './audio-controls';

type PhraseCardProps = {
	phrase: string;
	translation: string;
	transcription: string;
	id: string;
	audioUrl?: string;
	className?: string;
};

export function PhraseCard({
	phrase,
	translation,
	transcription,
	audioUrl,
	className,
	id,
}: PhraseCardProps) {
	return (
		<div
			className={cn(
				'flex items-center gap-4 rounded-xl bg-component-light p-4 shadow-md dark:bg-component-dark',
				className
			)}
		>
			<div className="flex flex-1 flex-col justify-center gap-0.5">
				<p className="text-lg font-medium leading-normal text-black dark:text-white">
					{phrase}
				</p>
				<p className="text-base font-normal leading-normal text-muted-foreground">
					{translation}
				</p>
				<p className="text-sm font-normal leading-normal text-muted-foreground/80">
					[{transcription}]
				</p>
			</div>
			{audioUrl && <AudioControls phraseId={id} audioUrl={audioUrl} />}
		</div>
	);
}
